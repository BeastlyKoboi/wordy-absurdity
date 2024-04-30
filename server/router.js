const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/home', mid.requiresLogin, controllers.Home.homePage);
  // app.post('/home', mid.requiresLogin, controllers.Domo.makeDomo);

  app.get('/changePassword', mid.requiresLogin, controllers.Account.changePasswordPage);
  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);

  app.get('/accountSettings', mid.requiresLogin, controllers.Account.accountSettingsPage);
  app.get('/getAvatars', mid.requiresSecure, mid.requiresLogin, controllers.Account.getAvatars);
  app.post('/addAvatar', mid.requiresSecure, mid.requiresLogin, controllers.Account.addAvatar);
  app.post('/setAvatar', mid.requiresSecure, mid.requiresLogin, controllers.Account.setAvatar);
  app.get('/getTileStyles', mid.requiresSecure, mid.requiresLogin, controllers.Account.getTileStyles);
  app.post('/addTileStyle', mid.requiresSecure, mid.requiresLogin, controllers.Account.addTileStyle);
  app.post('/setTileStyle', mid.requiresSecure, mid.requiresLogin, controllers.Account.setTileStyle);

  app.get('/admin', mid.requiresLogin, mid.requiresAdmin, controllers.Account.adminPage);
  app.post('/toggleAdmin', mid.requiresSecure, mid.requiresLogin, controllers.Account.toggleAdmin);
  app.get('/getLeaderboard', mid.requiresSecure, mid.requiresLogin, mid.requiresAdmin, controllers.Account.getLeaderboard);
  app.post('/incrementWins', mid.requiresSecure, mid.requiresLogin, controllers.Account.incrementWins);

  app.get('/game', mid.requiresLogin, controllers.Home.gamePage);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.get('*', controllers.Account.notFoundPage);
};

module.exports = router;
