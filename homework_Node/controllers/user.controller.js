const User = require('../dataBase/User');
const passwordService = require('../service/password.service');
const userUtil = require('../util/user.util');


module.exports = {
    getUsers: async (req, res) => {
        try {
            const users = await User.find().lean();
            const usersNormalize = users.map((user) => userUtil.userNormalizator(user));

            res.json(usersNormalize);
        } catch (e) {
            res.json(e.message);
        }
    },

    getUserById: (req, res) => {
        try {
            let user = req.user;
            user = userUtil.userNormalizator(user);

            res.json({user});
        } catch (e) {
            res.json(e.message);
        }
    },

    deleteUser: async (req, res) => {
        try {
            const {user_id} = req.params;
            let deletedUser = await User.findByIdAndDelete(user_id).lean();
            deletedUser = userUtil.userNormalizator(deletedUser);

            res.json(deletedUser);
        } catch (e) {
            res.json(e.message);
        }
    },

    createUser: async (req, res) => {
        try {
            const {name} = req.body;
            const hashPassword = await passwordService.hash(req.body.password);

            await User.create({...req.body, password: hashPassword});

            res.end(`User ${name} is added`);
        } catch (e) {
            res.json(e.message);
        }
    },

    updateUser: async (req, res) => {
        try {
            const {user_id} = req.params;
            let user = await User.findByIdAndUpdate(user_id, req.body);
            user = userUtil.userNormalizator(user);

            res.json(user);
        } catch (e) {
            res.json(e.message);
        }
    },
};
