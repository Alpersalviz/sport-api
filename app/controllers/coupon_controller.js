var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');
var md5  = require('md5');
var moment = require('moment');
var https = require('https');
var http = require('http');
var Promise = require('promise');

module.exports = {
    submit: function (req, res, next) {
        var couponValue = req.body.couponValue * 1;
        console.log(req.user.balance);
        if (couponValue > req.user.balance*1) {
            res.status(400);
            return res.json({
                message: "Bakiyeniz yetersiz"
            });
        }
        var items = req.body.items.split(",");
        var matchIds = [];
        var oddTypes  = [];
        var queries = "";
        for(var key in items){
            var item = items[key];
            if(item.indexOf("__") == -1){
                break;
            }
            var matchId = item.split("__")[0];
            var oddType = item.split("__")[1];
            matchIds.push(matchId);
            oddTypes.push(oddType);
            queries += (queries == "" ? "" : " or " )+"( matchId = "+matchId+" and oddType = '"+oddType+"')";

        }

        req.models.match.findAsync({matchId: matchIds}).then(function (matches) {
            for(var key in matches){
                var match = matches[key];
                if(match.matchDate.getTime() > new Date().getTime()){
                    res.status(400);
                    return res.json({
                        message: "Kuponunuzdaki maçlardan biri başlamış"
                    });
                }
            }
            req.db.driver.execQuery("select * from matchOdd inner join odd on matchOdd.OddId = odd.OddId where "+queries,function (err, odds) {
                console.log(err);
                console.log(odds);
                var totalOdd = 1;
                for (var key2 in odds) {
                    var odd = odds[key2];
                    console.log(odd);
                    totalOdd *= odd.value;
                    if(odd.mbs > odds.count){
                        res.status(400);
                        return res.json({
                            message: "Mbs oranından daha düşük maç oynadınız"
                        });
                    }
                }
                req.db.driver.execQuery("update user set balance = balance -  "+(totalOdd* req.body.couponValue)+" where userId  = "+req.user.userId,function(){

                });
                req.models.coupon.create({
                    userId : req.user.userId,
                    couponValue : req.body.couponValue,
                    createdDate : moment().toDate(),
                    earnings : totalOdd* req.body.couponValue,
                    totalOdd : totalOdd,
                    comment : req.body.comment
                },function (error,result) {
                    console.log(error);
                    console.log(result);
                    for (var key2 in odds){
                        var odd  = odds[key2];
                        console.log(odd);
                        req.models.couponItem.create({
                            couponId : result.couponId,
                            matchId : odd.matchId,
                            oddId : odd.oddId,
                            odd : odd.value
                        },function (error,result) {
                            console.log(error);
                        });
                    }
                    res.status(200);
                    return res.json({
                        couponId: result.couponId
                    });
                });
            });






        });

    },

    getCoupons:function (req,res,next) {

        var getCouponsWithFilter = function (filter) {
            console.log(filter);
            var filterStr = " 1 = 1 ";

            if(filter.status != -1){
                filterStr += " and `status` = '"+filter.status+"'";
            }
            if(filter.userId!= undefined && Array.isArray(filter.userId)){
                filterStr += " and user.userId in ("+filter.userId.join(",")+")";
            }else if(filter.userId != undefined){
                filterStr += " and user.userId = "+filter.userId+"";
            }
            req.db.driver.execQuery(" SELECT coupon.*,user.username from coupon " +
                "inner join user on coupon.userId = user.UserID " +
                "WHERE "+filterStr+" order by coupon.couponId desc",function (errr,couponArr) {
                console.log(errr);
                var couponIds = [];
                var coupons = {};
                if(couponArr.length == 0){
                    return res.json([]);
                }
                couponArr.forEach(function (coupon) {
                    couponIds.push(coupon.couponId);
                    coupons[coupon.couponId] = coupon;
                    coupons[coupon.couponId].items = [];
                });

                req.db.driver.execQuery("select couponItem.*,match.matchCode,matchDate,homeTeam,awayTeam,odd.*,oddGroup.* from couponItem " +
                    "inner join `match` on couponItem.matchId =  match.matchId " +
                    "inner join odd on couponItem.oddId = odd.oddId " +
                    "inner join oddGroup on oddGroup.groupId = odd.groupId "+
                    "where couponId in ("+couponIds.join(",")+")",function (errr2,couponItems) {
                    console.log(errr2);
                    couponItems.forEach(function (item) {
                        coupons[item.couponId].items.push(item);
                    })
                    var couponsArr = Object.keys(coupons).map(function(key) {
                        return coupons[key];
                    }).sort(function(a, b){return a.couponId<b.couponId});;
                    return res.json(couponsArr);
                });
            });
        };

        var type = req.query.type;

        var filter = {};
        filter.status = req.query.status;
        if(type == 0){
            /*Benim Kuponlarım*/
            filter.userId = req.user.userId;
            return  getCouponsWithFilter(filter);
        }else if(type == 1){
            /*Bu Üyenin Duvarı*/
            filter.userId = req.query.userId;
            return getCouponsWithFilter(filter);
        }else if(type == 2){
            /*Duvarın*/
            req.models.follow.find({ userId : req.user.userId},function (errr,users) {
                var ids = [];
                users.forEach(function (user) {
                    ids.push(user.followId);
                });
                console.log(ids);
                filter.userId = ids;

                return getCouponsWithFilter(filter);
            });

        }else if(type == 4){
            /*sıcak kuponlar*/
            return getCouponsWithFilter(filter);
        }

    },



};
