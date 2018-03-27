var moment = require('moment');

module.exports = function (orm, db) {
    db.define('coupon', {
        couponId        : { type: 'integer' , key: true },
        couponValue     : { type: 'number', required: true },
        totalOdd  : { type: 'number', required: false },
        earnings : {type:'number',required : false},
        createdDate : {type:'date',required : false},
        comment : {type:'text',required : false},
        userId : {type:'integer',required : false},
        status  : {type:'integer',required : false}

    });
};
