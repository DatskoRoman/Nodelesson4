const {jwtService} = require('../services');
const {Action, User} = require('../dataBase');
const {typeTokenEnum} = require('../configs');
const {passwordValidator: {passwordValidator}} = require('../validators');
const {statusEnum, messagesEnum, ErrorHandler: {ErrorHandler}} = require('../errors');
const {AUTHORIZATION} = require('../configs/constants');


module.exports = {
    isPasswordValid: (req, res, next) => {
        try {
            const {error, value} = passwordValidator.validate(req.body);

            if (error) {
                throw new ErrorHandler(error.details[0].message, 400);
            }

            req.body = value;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkExistUserByEmail: async (req, res, next) => {
        try {
            const {email}=req.body;

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

    checkActionToken: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            if (!token) {
                throw new ErrorHandler(messagesEnum.ACCESS_DENIED, statusEnum.FORBIDDEN);
            }

            jwtService.verifyToken(token, typeTokenEnum.ACTION);

            const tokenResponse = await Action.findOne({action_token: token}).populate('user_id');

            if (!tokenResponse) {
                throw new ErrorHandler(messagesEnum.INVALID_TOKEN, statusEnum.UNAUTHORIZED);
            }

            req.user = tokenResponse.user_id;

            next();
        } catch (e) {
            next(e);
        }
    }
};

