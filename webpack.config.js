const path = require('path');

module.exports = {
    entry: {
        accountSettings: './client/accountSettings.jsx',
        admin: './client/admin.jsx',
        game: './client/game.jsx',
        app: './client/home.jsx',
        login: './client/login.jsx',
        changePassword: './client/changePassword.jsx',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            }
        ],
    },
    mode: 'production',
    watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js',
    },
};