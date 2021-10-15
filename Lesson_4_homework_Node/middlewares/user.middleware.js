const {findUser, findUserById, findByEmail} = require('../service/userService');
const {createUserValidator, updateUserValidator} = require('../validators/user.validator');

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
    user: async (req, res, next) => {
        try {
            const {user_id} = req.params;

            const user = await findUserById(user_id).lean();

            if (!user) {
                throw new Error('No user');
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
                throw new Error('Email already exist');
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
                throw new Error('Can not validate');
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
                throw new Error('Can not validate');
            }

            next();
        } catch (e) {
            res.json(e.message);
        }
    },
};
