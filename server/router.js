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

  app.get('/admin', mid.requiresLogin, controllers.Account.adminPage);

  app.get('/game', mid.requiresLogin, controllers.Home.gamePage);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.get('*', controllers.Account.notFoundPage);
};

module.exports = router;
