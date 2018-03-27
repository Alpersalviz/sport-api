var moment = require('moment');

module.exports = function (orm, db) {
    db.define('team', {
        teamId        : { type: 'integer' ,key : true },
        name     : { type: 'text', required: true },
        countryId  : { type: 'integer', required: false },
        token : {type:'text',required : false}
    });
};
