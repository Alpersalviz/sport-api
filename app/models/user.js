var moment = require('moment');

module.exports = function (orm, db) {
   db.define('user', {
    userId        : { type: 'integer' , key: true },
    email     : { type: 'text', required: true },
    username  : { type: 'text', required: true },
    password  : { type: 'text', required: true },
    balance :    { type: 'integer', required: true },
    countryId   : { type: 'integer', required: true },
    teamId      : { type: 'integer', required: true },
    createdAt : { type: 'date', required: true, time: true },
    token     : {type: 'text', required: false}
  },
  {
    hooks: {
      beforeValidation: function () {
        this.createdAt = new Date();
      }
    },
    methods: {
      serialize: function () {
        return {
          body      : this.body,
          createdAt : moment(this.createdAt).fromNow()
        }
      }
    }
  });
};
