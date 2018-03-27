var moment = require('moment');

module.exports = function (orm, db) {
    db.define('league', {
        leagueId        : { type: 'integer' ,key : true },
        title     : { type: 'text', required: true },
        countryId  : { type: 'integer', required: false },
        token : {type:'text',required : false}
    });
};
