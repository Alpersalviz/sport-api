var moment = require('moment');

module.exports = function (orm, db) {
    db.define('oddGroup', {
        groupId        : { type: 'integer' ,key : true },
        name    : { type: 'text', required: true }
    });
};
