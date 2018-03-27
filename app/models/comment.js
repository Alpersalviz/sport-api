var moment = require('moment');

module.exports = function (orm, db) {
    db.define('comment', {
        commentId        : { type: 'integer' , key: true },
        comments     : { type: 'text', required: true },
        userId  : { type: 'integer', required: false },
        matchId: {type:'integer',required : false},
        createdAt     : { type: 'date', required: true },

    });
};
