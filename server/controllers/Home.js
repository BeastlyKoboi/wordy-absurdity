
const homePage = (req, res) => res.render('app');

const gamePage = (req, res) => res.render('game');

module.exports = {
    homePage,
    gamePage,
};
