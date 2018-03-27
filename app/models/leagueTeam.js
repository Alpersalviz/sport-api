var moment = require('moment');

module.exports = function (m, db) {
    db.define('leagueTeam', {
        id        : { type: 'integer' ,key : true },
        teamId    : { type: 'integer', required: true },
        leagueId  : { type: 'integer', required: false }
    });
};
