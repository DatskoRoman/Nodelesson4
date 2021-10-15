const {findUser, findUserById, findByEmail} = require('../service/userService');
const {createUserValidator, updateUserValidator} = require('../validators/user.validator');
const {ErrorHandler} = require("../errors");
const {badRequest, Forbidden, notValidBody, notFoundById} = require("../errors/dev-errors");

module.exports = {
    allUser: async (req, res, next) => {
        try {
            const user = await findUser().lean();

            req.user = user;

            next();
        } catch (e) {
            res.json(e.message);
        }
    },
    userById: async (req, res, next) => {
        try {
            const {user_id} = req.params;

            const user = await findUserById(user_id).lean();

            if (!user) {
                throw new ErrorHandler(notFoundById.message, notFoundById.code);
            }

            req.user = user;

            next();
        } catch (e) {
            res.json(e.message);
        }
    },

    checkUniqueEmail: async (req, res, next) => {
        try {
            const {email} = req.body;

            const userEmail = await findByEmail(email);

            if (userEmail) {
                throw new ErrorHandler(badRequest.message, badRequest.code);
            }

            next();
        } catch (e) {
            res.json(e.message);
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
            res.json(e.message);
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
            res.json(e.message);
        }
    },

    checkUserRole: (roleArr = []) => (req, res, next) => {
        try {
            const {role} = req.user;

            if (!roleArr.includes(role)) {
                throw new ErrorHandler(Forbidden.message, Forbidden.code);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
};
