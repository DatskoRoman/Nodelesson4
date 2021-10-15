const {login} = require('../validators/auth.validator');
const {findByEmail} = require('../service/userService');
const {ErrorHandler} = require("../errors");
const {notValidBody, badRequest} = require("../errors/dev-errors");

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
};
