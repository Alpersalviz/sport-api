var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');
var md5  = require('md5');
var moment = require('moment');
var https = require('https');
var http = require('http');

module.exports = {
    future: function (req, res, next) {
        var now = moment().toDate();
        console.log(now);
        var results  = {};
        var matchIds = [];
        req.models.match.find({ matchDate : orm.gte(now)}, [ "matchCode", "A" ],function (errr,matches) {
            matches.forEach(function (match) {
                matchIds.push(match.matchId);
                results[match.matchId] = match;
            });
            req.models.matchOdd.find({matchId : matchIds  , type : ["S.1","S.2","S.X"]}
               ,function (errr2,odds) {
                console.log(odds);
               odds.forEach(function (matchOdd) {
                  if(results[matchOdd.matchId].odds === undefined){
                      results[matchOdd.matchId].odds = [];
                  }
                   results[matchOdd.matchId].odds.push(matchOdd);
               });
                results = Object.keys(results).map(function(key) {
                    return results[key];
                });
                results.sort(function (a,b) {
                    if (a.matchCode < b.matchCode)
                        return -1;
                    if (a.matchCode > b.matchCode)
                        return 1;
                    return 0;
                })
                res.json(results);
            });
        });
    },
    live : function (req,res,next) {
        https.get("https://livescore.oley.com/LiveScore/DeltaData?sportId=1&languageId=1&packageNo=1", function(response) {
            var str = "";
            response.on('data', function (chunk) {
                str += chunk;
            })
            response.on('end', function () {
                console.log("https end");
                var obj = JSON.parse(str);
                console.log(obj);
                var matchIds = [];
                var matchItems = {};
                obj.MatchList.forEach(function (matchItem) {
                    matchIds.push(matchItem.Id);
                    matchItems[matchItem.Id] = matchItem;

                });
                req.models.match.find({matchToken: matchIds}, function (err, matches) {
                    matches.forEach(function (match) {
                        match.halfScore = matchItems[match.matchToken].Score_HT.replace(" ", "");
                        match.score = matchItems[match.matchToken].HomeTeamScore_FT + "-" + matchItems[match.matchToken].AwayTeamScore_FT;
                        match.redCards = matchItems[match.matchToken].HomeTeamRedCards + "-" + matchItems[match.matchToken].AwayTeamRedCards;
                        match.status = matchItems[match.matchToken].StatusName;
                        match.minute =  Math.floor((Date.now() - Date.parse(matchItems[match.matchToken].PeriodStartDate))/(60*1000))-180;
                        if(matchItems[match.matchToken].StatusId == 3){
                            match.minute += 45;
                        }
                        console.log(matchItems[match.matchToken]);
                    });
                    matches = matches.sort(function (a,b) {
                        if (a.matchDate < b.matchDate)
                            return -1;
                        if (a.matchDate > b.matchDate)
                            return 1;
                        return 0;
                    }).filter(function (t) {
                        return t.minute  > 0  ;
                    })
                    res.json(matches);
                });
            });
        });
    },
    result : function (req,res,next) {
        var now = moment().toDate();
        req.models.match.find({ matchDate : orm.lte(now),score : orm.ne(null)},function (errr,matches) {
            matches.sort(function (a,b) {
                if (a.matchDate > b.matchDate)
                    return -1;
                if (a.matchDate < b.matchDate)
                    return 1;
                return 0;
            })
            res.json(matches);
        });
    },
    detail : function (req,res,next) {
        req.models.match.one({matchId: req.params.id}, function (err, match) {

            req.db.driver.execQuery("" +
                "select " +
                "OddGroup.Name as groupName, OddGroup.groupId,OddGroup.DisplayOrder," +
                "mbs,value,type,odd.name " +
                "from MatchOdd " +
                "inner join Odd  on MatchOdd.OddId = Odd.OddId " +
                "inner join OddGroup on Odd.groupId = OddGroup.groupId " +
                "where MatchOdd.MatchID = "+match.matchId+" " +
                "order by OddGroup.DisplayOrder asc", function (err, odds) {
                match.odds = {};
                odds.forEach(function(item){
                    if(match.odds[item.DisplayOrder] == undefined)
                        match.odds[item.DisplayOrder] = [];
                    match.odds[item.DisplayOrder].push(item);
                });
                match.odds = Object.keys(match.odds).map(function(key) {
                    return match.odds[key];
                });
                var post_options = {
                    host: 'matchcenter-oley.broadagesports.com',
                    port: '80',
                    path: "/LiveMatch/GetLiveMatchData?sportId=1&matchId="+match.matchToken+"&packageNumber=-1&languageId=1",
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept' :'application/json, text/javascript, */*; q=0.01'
                    }
                };


                http.get(post_options,function (response) {
                    var str = "";
                    console.log(response);
                    response.on('data', function (chunk) {
                        str += chunk;
                    })
                    response.on('end', function () {
                        str = str.split("</html>")[1];
                        var obj = JSON.parse(str);
                        match.stats = obj.ST;
                        match.events = obj.EL;
                        res.json(match);
                    });
                });


            });
        })
    },
    bankOfDay: function(req,res,next){
        req.db.driver.execQuery("" +
            "select matchDate,match.matchId,match.AwayTeam,match.HomeTeam,odd.Name,odd.OddType,matchOdd.value,matchOdd.status from matchOdd " +
            "inner join `match`  on matchOdd.matchId = match.matchId " +
            "inner join odd on odd.OddType = matchOdd.type " +
            "where bank = 1 limit 100",function (errr,data) {
            if(errr != null){
                res.statusCode = 505;
                res.json({message : errr.toString()});
            }
            res.json(data);
            return;
        })

    },
    setComment:function (req,res,next) {
        var now = moment().toDate();
        var comment = {
            userId: req.user.userId,
            matchId:req.params.matchId*1,
            comments:req.body.comments,
            createdAt : now
        };
        console.log(comment);
        req.models.comment.create(comment,function (errr) {
            res.json(comment);
        })
    },
    getComment:function (req,res,next) {
        req.db.driver.execQuery("" +
            "select comment.*,user.userName from comment " +
            "inner join user on user.userId = comment.userId " +
            "where matchId = "+(req.params.matchId*1),function (errr,data) {
            if(errr != null){
                res.statusCode = 505;
                res.json({message : errr.toString()});
            }
            res.json(data);
            return;
        })
    }
};
