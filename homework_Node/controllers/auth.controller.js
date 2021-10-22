const {OAuth} = require('../dataBase');
const {statusEnum} = require('../errors');
const {jwtService: {generateToken}} = require('../services');
const {userNormalizator} = require('../util/user.util');

module.exports = {
    login: async (req, res) => {
        try {
            const {user} = req;

            const tokenPair = generateToken();

            const newUser = userNormalizator(user);

            await OAuth.create({...tokenPair, user_id: newUser._id});

            res.json({user: newUser, ...tokenPair}).status(statusEnum.CREATED);
        } catch (e) {
            res.json(e.message);
        }
    },

    logout: async (req, res) => {
        try {
            const {user} = req;

            await OAuth.deleteOne({user_id: user._id});

            res.end();
        } catch (e) {
            res.json(e.message);
        }
    },

    refresh: async (req, res) => {
        try {
            const {user} = req;

            const tokenRefreshPair = generateToken();

            const newUser = userNormalizator(user);

            await OAuth.findByIdAndUpdate({user_id: newUser._id}, {...tokenRefreshPair});

            res.json({user: newUser, ...tokenRefreshPair}).status(statusEnum.CREATED);
        } catch (e) {
            res.json(e.message);
        }
    }
};
