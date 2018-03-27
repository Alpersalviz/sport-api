var moment = require('moment');

module.exports = function (orm, db) {
    db.define('follow', {
        id        : { type: 'integer' , key: true },
        userId        : { type: 'integer' , key: false },
        followId     : { type: 'integer', required: true },
    });
};
