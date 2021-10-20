const User = require('../dataBase/User');
const passwordService = require('../service/password.service');
const userUtil = require('../util/user.util');


module.exports = {
    getUsers: async (req, res, next) => {
        try {
            const users = await User.find().lean();
            const usersNormalize = users.map((user) => userUtil.userNormalizator(user));

            res.json(usersNormalize);
        } catch (e) {
            next(e);
        }
    },

    getUserById: (req, res, next) => {
        try {
            let user = req.user;
            user = userUtil.userNormalizator(user);

            res.json({user});
        } catch (e) {
            next(e);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const {user_id} = req.params;
            let deletedUser = await User.findByIdAndDelete(user_id).lean();
            deletedUser = userUtil.userNormalizator(deletedUser);

            res.json(deletedUser);
        } catch (e) {
            next(e);
        }
    },

    createUser: async (req, res, next) => {
        try {
            const hashPassword = await passwordService.hash(req.body.password);

            await emailService.sendMail(req.body.email, WELCOME, { userName: req.body.name });

            const newUser =await User.create({...req.body, password: hashPassword});

            res.end(`User ${newUser} is added`);
        } catch (e) {
            next(e);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const {user_id} = req.params;
            let user = await User.findByIdAndUpdate(user_id, req.body);
            user = userUtil.userNormalizator(user);

            res.json(user);
        } catch (e) {
            next(e);
        }
    },
};
