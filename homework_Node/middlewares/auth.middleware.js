const {login} = require('../validators/auth.validator');
const {findByEmail} = require('../service/userService');
const {ErrorHandler} = require('../errors');
const {notValidBody, badRequest} = require('../errors/dev-errors');
const {AUTHORIZATION} = require('../configs/constants');
const O_Auth = require('../dataBase/O_Auth');
const tokenTypeEnum = require('../configs/token-type.enum');
const {jwtService, passwordService} = require('../service');

module.exports = {
    userValidate: (req, res, next) => {
        try {
            const {error} = login.validate(req.body);

            if (error) {
                throw new ErrorHandler(notValidBody.message, notValidBody.code);
            }

            next();
        } catch (e) {
            res.json(e.message);
        }
    },

    emailExist: async (req, res, next) => {
        try {
            const {email} = req.body;

            const userEmail = await findByEmail(email);

            if (!userEmail) {
                throw new ErrorHandler(badRequest.message, badRequest.code);
            }

            req.user = userEmail;
            next();
        } catch (e) {
            res.json(e.message);
        }
    },

    isPasswordsMatched: async (req, res, next) => {
        try {
            const { password } = req.body;
            const { password: hashPassword } = req.user;

            await passwordService.compare(password, hashPassword);

            next();
        } catch (e) {
            next(e);
        }
    },

    checkAccessToken: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            if (!token) {
                throw new ErrorHandler('No token', 401);
            }

            await jwtService.verifyToken(token);

            const tokenResponse = await O_Auth
                .findOne({ access_token: token })
                .populate('user_id');

            if (!tokenResponse) {
                throw new ErrorHandler('Invalid token', 401);
            }

            req.user = tokenResponse.user_id;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkRefreshToken: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            if (!token) {
                throw new ErrorHandler('No token', 401);
            }

            await jwtService.verifyToken(token, tokenTypeEnum.REFRESH);

            const tokenResponse = await O_Auth
                .findOne({refresh_token: token})
                .populate('user_id');

            if (!tokenResponse) {
                throw new ErrorHandler('Invalid token', 401);
            }

            await O_Auth.remove({refresh_token: token});

            req.user = tokenResponse.user_id;

            next();
        } catch (e) {
            next(e);
        }
    },
};
