const {OAuth, Action, User} = require('../dataBase');
const {statusEnum, messagesEnum} = require('../errors');
const {jwtService: {generateToken}, emailService, jwtService, passwordService} = require('../services');
const {userNormalizator} = require('../util/user.util');
const {FORGOT_PASSWORD} = require('../configs/action-token-type');
const {emailActionEnum} = require('../configs');

module.exports = {
    login: async (req, res) => {
        try {
            const {user} = req;

            const tokenPair = jwtService.generateToken();

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

            const tokenRefreshPair = jwtService.generateToken();

            const newUser = userNormalizator(user);

            await OAuth.findOneAndUpdate({user_id: newUser._id}, {...tokenRefreshPair});

            res.json({user: newUser, ...tokenRefreshPair}).status(statusEnum.CREATED);
        } catch (e) {
            res.json(e.message);
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const {body: user} = req;

            const actionToken = jwtService.createActionToken();

            const newUser = userNormalizator(user);

            await Action.create({
                action_token: actionToken,
                type: FORGOT_PASSWORD,
                user_id: newUser._id
            });

            await emailService(user.email, emailActionEnum.FORGOT_PASSWORD, {
                userName: newUser.name,
                actionToken
            });

            res.json({user: newUser, actionToken}).status(statusEnum.CREATED);
        } catch (e) {
            res.json(e.message);
        }
    },

    setPassword: async (req, res) => {
        try {
            const {user, body: {password}} = req;

            const hashPas = await passwordService.hash(password);

            await User.findByIdAndUpdate({_id: user._id}, {password: hashPas});

            await OAuth.deleteMany({user_id: user._id});

            res.json(messagesEnum.PASSWORD_CHANGED);
        } catch (e) {
            res.json(e.message);
        }
    },

    activate: async (req, res) => {
        try {
            const {_id} = req.user;

            await User.updateOne({_id}, {is_active: true});

            res.status(200).json('User is active');
        } catch (e) {
            res.json(e.message);
        }

    }
};
