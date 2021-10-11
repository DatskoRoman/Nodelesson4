const {compare} = require('../service/password.service');

module.exports = {
    login: async (req, res, next) => {
        try {
            const {body: {password}, user} = req;

            await compare(user.password, password);

            res.redirect('/users');
        } catch (e) {
            next(e);
        }
    },
};
