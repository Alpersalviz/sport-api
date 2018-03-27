var settings = require('../../config/settings');

module.exports = function (req, res, next) {
  res.json({
      message: "v1",
      date : new Date().getTime()
  })
};
