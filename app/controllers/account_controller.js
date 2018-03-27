var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');
var md5  = require('md5');
var moment = require('moment');
module.exports = {
    register: function (req, res, next) {
        var params = {
            email : req.body.email,
            username: req.body.username,
            password: req.body.password,
            countryId: req.body.country,
            balance:0,
            token: "",
            teamId: req.body.team
        };
        req.models.user.existsAsync({ email: params.email })
            .then(function(isExists) {
                if (isExists) {
                    res.status(400);
                    return res.json({
                        message: "Email adresi kullanılıyor."
                    });
                } else {
                    req.models.user.existsAsync({username: params.username})
                        .then(function (isExists) {
                            if (isExists) {
                                res.status(400);
                                return res.json({
                                    message: "Kullanıcı adınız kullanılıyor"
                                });
                            } else {
                                req.models.user.create(params, function (err, message) {
                                    if (err) {
                                        console.log(err);
                                        res.status(400);
                                        return res.json({
                                            message: "Zorunlu alanları doldurunuz"
                                        });
                                    }
                                    req.models.user.findAsync({username:params.username}).then(function(user){
                                        user[0].token =  md5(user[0].email + user[0].password + moment().unix());
                                        user[0].save();
                                        user[0].password = undefined;
                                        return res.json(user[0]);
                                    })
                                });

                            }
                        });
                }
            });

    },
    login: function (req, res, next) {
        var params = {
            username : req.body.username,
            password: req.body.password
        };
        req.models.user.findAsync(params).then(function(user){
            if (user.length == 0 ){
                res.statusCode = 400;
                res.json({message : "Kullanıcı adı ve ya şifre yanlış"});
                return;
            }
            user[0].token =  md5(user[0].email + user[0].password + moment().unix());
            user[0].save();
            user[0].password = undefined;
            return res.json(user[0]);
        });
    },
    getInfo:function (req,res,next) {
        return res.json(req.user);
    },
    users:function (req,res,next) {
        req.db.driver.execQuery("select userId,username,balance from user where deleted = 0 order by balance desc limit 100",function (err,users) {
            if(err){
                res.json(err);
            }
            res.json(users);
        })
    },
    user:function (req,res,next) {
        req.db.driver.execQuery("select userId,username,countryId,teamId,winrate,wincount,lostcount,followerscount,followingcount from user where userId = '"+(req.params.id*1)+"'",function (err,user) {
            if(err){
                res.json(err);
            }
            req.db.driver.execQuery("select * from follow where userId = '"+req.user.userId+"' and followId = '"+user[0].userId+"'",function (err,rtn) {
                if(rtn.length > 0 ) {
                    user[0].isFollow = true;
                }
                res.json(user[0]);
            });
        })
    },
    userFollow:function (req,res,next) {
        var column = (req.params.type == "1" ? "userId" : "followId");
        var column1 = (req.params.type != "1" ? "userId" : "followId");

        req.db.driver.execQuery("select u.userId,username from follow " +
            "inner join user u on u.userId = follow."+column1+" " +
            " where follow."+column+" = "+(req.params.id),function (err,follow) {
            if(err){
                res.json(err);
            }
            res.json(follow);
        })
    },
    follow:function (req,res,next) {
        req.db.driver.execQuery("select * from follow where userId = '"+req.user.userId+"' and followId = '"+req.body.userId+"'",function (err,rtn) {
            if(rtn.length == 0){
                req.db.driver.execQuery("insert into follow(userId,followId)VALUES("+req.user.userId+",'"+req.body.userId+"');",function () {

                });
            }else{
                req.db.driver.execQuery("delete from follow where userId = '"+req.user.userId+"' and followId = '"+req.body.userId+"'",function () {

                });
            }
        });

    }

};
