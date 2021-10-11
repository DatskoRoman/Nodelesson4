const {login} = require('../validators/auth.validator');
const {findByEmail} = require('../service/userService');

module.exports = {
    userValidate: (req, res, next) => {
        try {
            const {error} = login.validate(req.body);

            if (error) {
                throw new Error('Error');
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
                throw new Error('Email already exist');
            }

            req.user = userEmail;
            next();
        } catch (e) {
            res.json(e.message);
        }
    },
};
