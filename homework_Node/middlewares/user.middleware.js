const {findUserById, findByEmail} = require('../service/userService');
const {createUserValidator, updateUserValidator} = require('../validators/user.validator');
const {ErrorHandler} = require('../errors');
const {FORBIDDEN, notValidBody, notFoundById} = require('../errors/dev-errors');

module.exports = {
    userById: async (req, res, next) => {
        try {
            const {user_id} = req.params;

            const user = await findUserById(user_id).lean();

            if (!user) {
                throw new ErrorHandler(notFoundById.message, notFoundById.code);
            }

            req.userById() = user;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkUniqueEmail: async (req, res, next) => {
        try {

            const userEmail = await findByEmail({ email: req.body.email })
                .select('+password')
                .lean();

            if (!userEmail) {
                throw new ErrorHandler(notValidBody.message, notValidBody.code);
            }

            req.user = userEmail;

            next();
        } catch (e) {
            next(e);
        }
    },

    validateUser: (req, res, next) => {
        try {
            const {error} = createUserValidator.validate(req.body);

            if (error) {
                throw new ErrorHandler(notValidBody.message, notValidBody.code);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    validateUserToUpdate: (req, res, next) => {
        try {
            const {error} = updateUserValidator.validate(req.body);

            if (error) {
                throw new ErrorHandler(notValidBody.message, notValidBody.code);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkUserRole: (roleArr = []) => (req, res, next) => {
        try {
            const {role} = req.user;

            if (!roleArr.includes(role)) {
                throw new ErrorHandler(FORBIDDEN.message, FORBIDDEN.code);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
};
