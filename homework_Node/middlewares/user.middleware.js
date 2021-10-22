const {Types} = require('mongoose');

const {User} = require('../dataBase');
const {ErrorHandler: {ErrorHandler}, messagesEnum, statusEnum} = require('../errors');

module.exports = {
    createUserMiddleware: async (req, res, next) => {
        try {
            const {email} = req.body;
            const user = await User.findOne({email});

            if (user) {
                throw new ErrorHandler(messagesEnum.USER_EXIST, statusEnum.CONFLICT);

            }
            next();
        } catch (e) {
            next(e);
        }
    },

    isBodyValid: (validator) => (req, res, next) => {
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

    checkExistUser: async (req, res, next) => {
        try {
            const {id} = req.params;
            const user = await User.findOne({_id: Types.ObjectId(id)}).lean();

            if (!user) {
                throw new ErrorHandler(messagesEnum.NOT_FOUND_USER, statusEnum.NO_FOUND);
            }
            req.body = user;
            next();
        } catch (e) {
            next(e);
        }
    },

    isUserIdValid: (req, res, next) => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new ErrorHandler(messagesEnum.USER_ID_VALID, statusEnum.NO_FOUND);
            }
            next();
        } catch (e) {
            next(e);
        }
    },
};
