var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');
var md5  = require('md5');
var moment = require('moment');
var https = require('https');
var http = require('http');

module.exports = {
    teams: function (req, res, next) {
        var id = req.params.id;
        if(id == 0){
            req.models.team.find({},function (errr,teams) {
                res.json(teams);
            });
        }else{
            req.models.team.find({ countryId : id},function (errr,teams) {
                res.json(teams);
            });
        }
    },
    list: function (req, res, next) {
        req.models.country.find({},function (errr,countries) {
            res.json(countries);
        });
    }
};
