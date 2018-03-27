var moment = require('moment');

module.exports = function (orm, db) {
    db.define('couponItem', {
        id        : { type: 'integer' , key: true },
        couponId        : { type: 'integer' , key: false },
        oddId     : { type: 'integer', required: true },
        matchId  : { type: 'integer', required: false },
        odd : {type:'number',required : false}
    });
};
