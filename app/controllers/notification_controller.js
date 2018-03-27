var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');
var md5  = require('md5');
var moment = require('moment');
var https = require('https');
var http = require('http');

module.exports = {
    get: function (req, res, next) {
        var now = moment().toDate();
        var results  = {};
        var matchIds = [];
        req.models.notification.find({ userId : req.user.userId},function (errr,notifications) {
            res.json(notifications);
        });
    }
};
