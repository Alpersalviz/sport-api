var moment = require('moment');

module.exports = function (orm, db) {
    db.define('country', {
            countryId        : { type: 'integer' , key: true },
            title     : { type: 'text', required: true },
            shortcode  : { type: 'text', required: false },
            token : {type:'text',required : false}
        });
};
