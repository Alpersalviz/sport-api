var moment = require('moment');

module.exports = function (orm, db) {
    db.define('notification', {
        id: { type: 'integer' ,key : true },
        notificationType    : { type: 'text', required: true },
        keyId  : { type: 'integer', required: true },
        userId  : { type: 'integer', required: true },
        date  : { type: 'date', required: true },
        title  : { type: 'text', required: true },
    });
};
