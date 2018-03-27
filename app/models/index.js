var settings = require('../../config/settings');

var connection = null;
var orm     = require('orm');

function setup(db, cb) {
    require('./user')(orm, db);
    require('./country')(orm, db);
    require('./league')(orm, db);
    require('./leagueTeam')(orm, db);
    require('./team')(orm, db);
    require('./match')(orm, db);
    require('./matchOdd')(orm, db);
    require('./odd')(orm, db);
    require('./oddGroup')(orm, db);

    require('./comment')(orm, db);
    require('./coupon')(orm, db);
    require('./couponItem')(orm, db);
    require('./follow')(orm, db);

    return cb(null, db);
}

module.exports = function (cb) {
  if (connection) return cb(null, connection);

  orm. connect(settings.database, function (err, db) {
    if (err) return cb(err);

    connection = db;
    db.settings.set('instance.returnAllErrors', true);
    setup(db, cb);
  });
};
