const { userNormalizator } = require('../util/user.util');
const { jwtService, emailService, passwordService} = require('../service');
const {errorStatuses} = require('../errors');
const {ActionToken, Oauth, User} = require('../dataBase');
const {emailActionEnum} = require('../configs');

module.exports = {
    login: async (req, res, next) => {
        try {
            const { userById } = req;

            const tokenPair = jwtService.generateTokenPair();

            const userNormalized = userNormalizator(userById);

            await Oauth.create({
                ...tokenPair,
                user: userById._id
            });

            res.json({
                user: userNormalized,
                ...tokenPair
            });
        } catch (e) {
            next(e);
        }
    },

    logout: async ( req, res, next ) => {
        try {
            const {userByID} = req;

            await Oauth.deleteOne({ user: userByID._id });

            res.sendStatus(errorStatuses.status_205);
        } catch (e) {
            next(e);
        }
    },

    refresh: async (req, res, next) => {
        try {
            const {userByID} = req;

            const tokenPair = jwtService.generateTokenPair();

            await Oauth.create({
                ...tokenPair,
                user: userByID._id
            });

            res.json({
                user: userByID,
                ...tokenPair
            });
        } catch (err) {
            next(err);
        }
    },

    forgotPassword: async (req, res, next) => {
        try {
            const {userByID: {_id, name, email}} = req;

            const actionToken = await jwtService.generateTokenAction();

            await ActionToken.create({
                actionToken,
                user: _id
            });

            const forgotPasswordLink= `http://localhost:5000/auth/forgot-password/${actionToken}`;

            await emailService.sendMail(
                email,
                emailActionEnum.FORGOT_PASSWORD,
                {
                    userName: name,
                    link: forgotPasswordLink
                }
            );

            res.sendStatus(errorStatuses.status_201);
        } catch (err) {
            next(err);
        }
    },

    changePassword: async (req, res, next) => {
        try {
            const {body: {password}, userByID: {_id, name, email}} = req;

            const hashedPassword = await passwordService.hash(password);

            await Oauth.deleteMany({user: _id});

            await User.updateOne(
                {_id},
                {password: hashedPassword}
            );

            await emailService.sendMail(
                email,
                emailActionEnum.CHANGE_PASSWORD,
                {userName: name}
            );

            res.sendStatus(errorStatuses.status_201);
        } catch (err) {
            next(err);
        }
    }
};
