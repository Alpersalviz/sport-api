
var controllers = require('../app/controllers');
var passport = require("passport")
module.exports = function (app) {
  app.get('/'                           , controllers.home);
  app.post('/account/register'                      , controllers.account.register);
  app.post('/account/login', controllers.account.login);
  app.get('/account/getInfo',ensureAuthorized, controllers.account.getInfo);
  app.get('/users',  controllers.account.users);
  app.get('/user/:id', ensureAuthorized, controllers.account.user);
  app.get('/user/:id/follow/:type',ensureAuthorized,  controllers.account.userFollow);
  app.post('/user/:id/follow',ensureAuthorized,  controllers.account.follow);
  app.get('/job/league', controllers.job.league);
  app.get('/job/team', controllers.job.team);
  app.get('/job/match', controllers.job.match);
  app.get('/job/live', controllers.job.live);
  app.get('/match/future', controllers.match.future);
  app.get('/match/live', controllers.match.live);
  app.get('/match/result', controllers.match.result);
  app.get('/match/bankOfDay', controllers.match.bankOfDay);
  app.get('/match/:id/detail', controllers.match.detail);
  app.get('/country', controllers.country.list);
  app.get('/country/:id/teams', controllers.country.teams);
  app.post('/match/:matchId/comment',ensureAuthorized,  controllers.match.setComment);
  app.get('/match/:matchId/comment',   controllers.match.getComment);
  app.post('/coupon', ensureAuthorized,  controllers.coupon.submit);
  app.get('/coupon', ensureAuthorized, controllers.coupon.getCoupons);
  app.get('/notification', ensureAuthorized, controllers.notification.get);

  function ensureAuthorized(req, res, next) {
      var bearerToken;
      var bearerHeader = req.headers["authorization"];
      if (typeof bearerHeader !== 'undefined') {
          var bearer = bearerHeader.split(" ");
          bearerToken = bearer[1];
          console.log(bearerHeader);
          if(bearerToken == ""){
              res.status(403);
              res.json({
                  message:"Giriş yapınız"
              });
              return;
          }
          req.models.user.findAsync({token : bearerToken}).then(function(user) {
                req.user = user[0];
              next();

          });
      } else {
          res.send(403);
      }
  }

};
