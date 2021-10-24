const {User, OAuth, Action} = require('../dataBase');
const {passwordService: {comparing}} = require('../services');
const {messagesEnum, statusEnum, ErrorHandler: {ErrorHandler}} = require('../errors');
const {jwtService} = require('../services');
const {AUTHORIZATION} = require('../configs/constants');
const {typeTokenEnum} = require('../configs');

module.exports = {
    isAuthValid: (validator) =>(req, res, next) => {
        try {
            const {error, value} = validator.validate(req.body);

            if (error) {
                throw new ErrorHandler(error.details[0].message, 400);
            }

            req.body = value;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkLogin: async (req, res, next) => {
        try {
            const {email, password} = req.body;

            const user = await User.findOne({email}).lean();

            if (!user) {
                throw new ErrorHandler(messagesEnum.WRONG_LOGIN_OR_PASS, statusEnum.BAD_REQUEST);
            }

            await comparing(password, user.password);

            req.user = user;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkingRole: (roleArr = []) => (req, res, next) => {
        try {
            if (!roleArr.includes(req.role)) {
                throw new ErrorHandler(messagesEnum.ACCESS_DENIED, statusEnum.FORBIDDEN);
            }

            next();
        } catch (e) {
            next(e);
        }
    },
    checkAccessToken: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            if (!token) {
                throw new ErrorHandler(messagesEnum.ACCESS_DENIED, statusEnum.FORBIDDEN);
            }

            jwtService.verifyToken(token);

            const tokenResponse = await OAuth.findOne({access_token: token}).populate('user_id');

            if (!tokenResponse) {
                throw new ErrorHandler(messagesEnum.INVALID_TOKEN, statusEnum.UNAUTHORIZED);
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
                throw new ErrorHandler(messagesEnum.INVALID_TOKEN, statusEnum.UNAUTHORIZED);
            }

            jwtService.verifyToken(token, 'refresh');

            const tokenResponse = await OAuth.findOne({refresh_token: token}).populate('user_id');

            if (!tokenResponse) {
                throw new ErrorHandler(messagesEnum.INVALID_TOKEN, statusEnum.UNAUTHORIZED);
            }

            await OAuth.deleteOne({refresh_token: token});

            req.user = tokenResponse.user_id;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkActionToken: (type) => async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            if (!token) {
                throw new ErrorHandler(messagesEnum.ACCESS_DENIED, statusEnum.FORBIDDEN);
            }

            jwtService.verifyToken(token, typeTokenEnum.ACTION);

            const tokenResponse = await Action.findOne({action_token: token, type}).populate('user_id');

            if (!tokenResponse) {
                throw new ErrorHandler(messagesEnum.INVALID_TOKEN, statusEnum.UNAUTHORIZED);
            }

            await Action.deleteOne({action_token: token, type});

            req.user = tokenResponse.user_id;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkExistUserByEmail: async (req, res, next) => {
        try {
            const {email} = req.body;

            const user = await User.findOne({email});

            if (!user) {
                throw new ErrorHandler(messagesEnum.NOT_FOUND_USER, statusEnum.NO_FOUND);
            }

            req.body = user;

            next();
        } catch (e) {
            next(e);
        }
    },
};

