const {compare} = require('../service/password.service');

module.exports = {
    login: async (req, res) => {
        try {
            const {body: {password, hashPassword}, user} = req;

            await compare(user.password, password, hashPassword);

            res.redirect('/users');
        } catch (e) {
            res.json(e.message);
        }
    },
};
