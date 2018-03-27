var moment = require('moment');

module.exports = function (orm, db) {
    db.define('matchOdd', {
        matchOddId        : { type: 'integer' ,key : true },
        type    : { type: 'text', required: true },
        oddId  : { type: 'integer', required: true },
        matchId  : { type: 'integer', required: true },
        value  : { type: 'number', required: true },
        mbs  : { type: 'integer', required: true },
        bank  : { type: 'boolean', required: false },
        status  : { type: 'text', required: false },
    });
};
