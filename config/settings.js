var path       = require('path');

var settings = {
  path       : path.normalize(path.join(__dirname, '..')),
  port       : process.env.NODE_PORT || 3000,
  database   : {
    protocol : "mysql",
    query    : { pool: true,debug:true },
    host     : "localhost",
    port     : 8889,
    database : "sports",
    user     : "root",
    password : ""
  }
};

module.exports = settings;
