var moment = require('moment');

module.exports = function (orm, db) {
    db.define('match', {
        matchId        : { type: 'integer' ,key : true },
        matchDate     : { type: 'date', required: true },
        matchCode  : { type: 'text', required: false },
        homeTeam : {type:'text',required : false},
        awayTeam : {type:'text',required : false},
        homeTeamId : {type:'integer',required : false},
        awayTeamId : {type:'integer',required : false},
        mbs : {type:'integer',required : false},
        leagueId : {type:'integer',required : false},
        leagueName : {type:'text',required : false},
        eventToken : {type:'text',required : false},
        matchToken : {type:'text',required : false},
        countryId : {type:'integer',required : false},
        country : {type:'text',required : false},
        score : {type:'text',required : false},
        halfScore : {type:'text',required : false},
        redCards : {type:'text',required : false},
        status : {type:'text',required : false}
    });
};
