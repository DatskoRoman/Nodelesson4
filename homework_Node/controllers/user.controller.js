const User = require('../dataBase/User');
const passwordService = require('../service/password.service');
const userUtil = require('../util/user.util');
const {emailService} = require('../service');
const {WELCOME} = require('../configs/email-action.enum');


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
            const user = req.user;
            const utilUser = userUtil.userNormalizator(user);

            res.json(utilUser);
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
            const newUser = req.body;

            const hashedPassword = await passwordService.hash(newUser.password);

            const user = await User.create({ ...newUser, password: hashedPassword });

            const utilUser = userUtil.userNormalizator(user.toObject());

            await emailService.sendMail(newUser.email, WELCOME, utilUser);

            res.end(`User ${utilUser} is added`);
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
