const models = require('../models');

const { Account } = models;

const avatarNames = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png'];
const tileStyleNames = ['white', 'red-200', 'orange-200', 'yellow-200', 'lime-200', 'green-200', 'cyan-200', 'indigo-200', 'purple-200', 'pink-200'];

const notFoundPage = (req, res) => res.render('notFound');

const accountSettingsPage = (req, res) => res.render('accountSettings');

const adminPage = (req, res) => res.render('admin');

const loginPage = (req, res) => res.render('login');

const changePasswordPage = (req, res) => res.render('changePassword');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/home' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/home' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

const changePassword = async (req, res) => {
  const username = `${req.session.account.username}`;
  const oldPass = `${req.body.oldPass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  if (!username || !oldPass || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(newPass);

    return Account.authenticate(username, oldPass, async (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'Wrong username or password!' });
      }

      account.set({ password: hash });
      await account.save();

      return res.json({ redirect: '/home' });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

const getAvatars = async (req, res) => res.json({
  unlocked: req.session.account.avatars,
  all: avatarNames,
});

const addAvatar = async (req, res) => {
  const { avatarName } = req.body;

  if (!avatarName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!avatarNames.includes(avatarName)) {
    return res.status(400).json({ error: 'Must be a valid avatar name' });
  }

  const playerAvatars = req.session.account.avatars;
  if (!playerAvatars.includes(avatarName)) playerAvatars.push(avatarName);

  try {
    const account = await Account.findById(req.session.account._id).exec();

    account.set({ avatars: playerAvatars });
    await account.save();
    req.session.account = Account.toAPI(account);

    return res.json({
      unlocked: req.session.account.avatars,
      all: avatarNames,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

const setAvatar = async (req, res) => {
  const { avatarName } = req.body;

  console.log(avatarName);

  if (!avatarName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!req.session.account.avatars.includes(avatarName)) {
    return res.status(400).json({ error: 'Must be an unlocked avatar' });
  }

  let newAvatarsArr = req.session.account.avatars.filter((avatar) => avatar !== avatarName);
  newAvatarsArr = [avatarName, ...newAvatarsArr];

  try {
    const account = await Account.findById(req.session.account._id).exec();

    account.set({ avatars: newAvatarsArr });
    await account.save();
    req.session.account = Account.toAPI(account);

    console.log(req.session.account);

    return res.json({
      unlocked: req.session.account.avatars,
      all: avatarNames,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

const getTileStyles = async (req, res) => res.json({
  unlocked: req.session.account.tileColor,
  all: tileStyleNames,
});

const addTileStyle = async (req, res) => {
  const { tileStyleName } = req.body;

  if (!tileStyleName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!tileStyleNames.includes(tileStyleName)) {
    return res.status(400).json({ error: 'Must be a valid tile style name' });
  }

  const playerTileStyles = req.session.account.tileColor;
  if (!playerTileStyles.includes(tileStyleName)) playerTileStyles.push(tileStyleName);

  try {
    const account = await Account.findById(req.session.account._id).exec();

    account.set({ tileColor: playerTileStyles });
    await account.save();
    req.session.account = Account.toAPI(account);

    return res.json({
      unlocked: req.session.account.tileColor,
      all: tileStyleNames,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

const setTileStyle = async (req, res) => {
  const { tileStyleName } = req.body;

  console.log(tileStyleName);

  if (!tileStyleName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!req.session.account.tileColor.includes(tileStyleName)) {
    return res.status(400).json({ error: 'Must be an unlocked tileStyle' });
  }

  let newtileColorArr = req.session.account.tileColor
    .filter((tileStyle) => tileStyle !== tileStyleName);
  newtileColorArr = [tileStyleName, ...newtileColorArr];

  try {
    const account = await Account.findById(req.session.account._id).exec();

    account.set({ tileColor: newtileColorArr });
    await account.save();
    req.session.account = Account.toAPI(account);

    console.log(req.session.account);

    return res.json({
      unlocked: req.session.account.tileColor,
      all: tileStyleNames,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

const toggleAdmin = async (req, res) => {
  try {
    const account = await Account.findById(req.session.account._id).exec();

    account.set({ admin: !req.session.account.admin });
    await account.save();
    req.session.account = Account.toAPI(account);

    console.log(req.session.account);

    return res.json({});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const topPlayers = await Account.find().sort({ gameWins: -1 }).limit(10);
    const topPlayersJSON = [];
    topPlayers.forEach(doc => {
      topPlayersJSON.push(Account.toAPI(doc));
    });
    return res.json(topPlayersJSON);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred!' });
  }

};

module.exports = {
  notFoundPage,
  accountSettingsPage,
  adminPage,
  loginPage,
  changePasswordPage,
  login,
  logout,
  signup,
  changePassword,
  getAvatars,
  addAvatar,
  setAvatar,
  getTileStyles,
  addTileStyle,
  setTileStyle,
  toggleAdmin,
  getLeaderboard,
};
