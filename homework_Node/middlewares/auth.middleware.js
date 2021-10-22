const {User, Oauth, ActionToken} = require('../dataBase/index');
const {errorMessages, errorStatuses} = require('../errors');
const {passwordService, jwtService} = require('../service');
const {AUTHORIZATION} = require('../configs/constants');
const {tokenTypeEnum} = require('../configs');


module.exports = {
    isEmailExist: async (req, res, next) => {
        try {
            const {body: {email}} = req;

            const userById = await User.findOne({email})
                .select('+password')
                .lean();

            if (!userById) {
                next({
                    message: errorMessages.WRONG_EMAIL_OR_PASSWORD,
                    status: errorStatuses.status_400
                });

                return;
            }

            req.userById = userById;

            next();
        } catch (e) {
            next(e);
        }
    },

    isPasswordMatched: async (req, res, next) => {
        try {
            const {body, userById} = req;

            await passwordService.compare(body.password, userById.password);

            next();
        } catch (e) {
            next(e);
        }
    },

    checkAccessToken: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            if (!token) {
                return next({
                    message: errorMessages.INVALID_TOKEN,
                    status: errorStatuses.status_401
                });
            }

            jwtService.verifyToken(token, tokenTypeEnum.ACCESS);

            const foundO_Auth = await Oauth
                .findOne({token_access: token})
                .populate('user');

            if (!foundO_Auth) {
                return next({
                    message: errorMessages.INVALID_TOKEN,
                    status: errorStatuses.status_401
                });
            }

            req.userById = foundO_Auth.user;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkRefreshToken: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            if (!token) {
                return next({
                    message: errorMessages.INVALID_TOKEN,
                    status: errorStatuses.status_401
                });
            }

            jwtService.verifyToken(token, tokenTypeEnum.REFRESH);

            const foundO_Auth = await Oauth
                .findOne({token_refresh: token})
                .populate('user');

            if (!foundO_Auth) {
                return next({
                    message: errorMessages.INVALID_TOKEN,
                    status: errorStatuses.status_401
                });
            }

            await Oauth.deleteOne({token_refresh: token});

            req.userById = foundO_Auth.user;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkActionToken: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            if (!token) {
                return next({
                    message: errorMessages.INVALID_TOKEN,
                    status: errorStatuses.status_401
                });
            }

            jwtService.verifyToken(token, tokenTypeEnum.ACTION);

            const foundActionToken = await ActionToken
                .findOne({token_action: token})
                .populate('user');

            if (!foundActionToken) {
                return next({
                    message: errorMessages.INVALID_TOKEN,
                    status: errorStatuses.status_401
                });
            }

            await ActionToken.deleteOne({token_action: token});

            req.userById = foundActionToken.user;

            next();
        } catch (e) {
            next(e);
        }
    }
};
