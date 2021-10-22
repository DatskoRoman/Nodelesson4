const {errorMessages, errorStatuses} = require('../errors/index');
const {User} = require('../dataBase/index');
const {userValidator} = require('../validators');
const ErrorHandler = require('../errors/ErrorHandler');

module.exports = {
    isUserExist: async (req, res, next) => {
        try {
            const {params: {userId}} = req;

            const userById = await User.findById(userId);

            if (!userById) {
                return next({
                    message: errorMessages.USER_ID_DOESNT_EXIST,
                    status: errorStatuses.status_404
                });
            }

            req.userById = userById;

            next();
        } catch (e) {
            next(e);
        }
    },

    isUserEmailExist: async (req, res, next) => {
        try {
            const {body: {email}} = req;

            const userEmail = await User.findOne({email});

            if (userEmail) {
                return next({
                    message: errorMessages.USER_EMAIL_ALREADY_EXISTS,
                    status: errorStatuses.status_409
                });
            }

            next();
        } catch (e) {
            next(e);
        }
    },
    isUserRolesChecked: (roles = []) => (req, res, next) => {
        try {
            const {userById: {role}} = req;

            if (!roles.includes(role)) {
                return next({
                    message: errorMessages.ACCESS_DENIED,
                    status: errorStatuses.status_403
                });
            }

            next();
        } catch (e) {
            next(e);
        }
    },
    isBodyValid: (validator, authKey = 0) => (req, res, next) => {
        try {
            const {body} = req;

            const {error} = validator.validate(body);

            if (authKey && error) {
                return next({
                    message: errorMessages.WRONG_EMAIL_OR_PASSWORD,
                    status: errorStatuses.status_400
                });
            }

            if (error) {
                return next({
                    message: error.details[0].message,
                    status: errorStatuses.status_400
                });
            }

            next();
        } catch (err) {
            next(err);
        }
    }
};
