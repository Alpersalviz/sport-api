var moment = require('moment');

module.exports = function (orm, db) {
    db.define('odd', {
        oddId        : { type: 'integer' ,key : true },
        oddType    : { type: 'text', required: true },
        name  : { type: 'text', required: true },
        groupId  : { type: 'integer', required: true }
    });
};
