const User = require('../dataBase/User');
const passwordService = require('../service/password.service');
const userUtil = require('../util/user.util');
const {emailService} = require('../service');
const {emailActionEnum} = require('../configs');
const {errorStatuses} = require('../errors');
const {Oauth} = require('../dataBase');


module.exports = {
    getUsers: async (req, res, next) => {
        try {
            const userById = await User.find().lean();

            res.json(userById);
        } catch (e) {
            next(e);
        }
    },

    getUserById: (req, res, next) => {
        try {
            const {userById} = req;

            res.json(userById);
        } catch (e) {
            next(e);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const {params: {userId}, body} = req;

            const updatedUser = await User.findByIdAndUpdate(userId, body,
                {new: true, runValidators: true}
            );

            res
                .status(errorStatuses.status_201)
                .json(updatedUser);
        } catch (e) {
            next(e);
        }
    },
    deleteUser: async (req, res, next) => {
        try {
            const {params: {userId}, userById: {name, email}} = req;

            await User.deleteOne({user: userId});
            Oauth.deleteOne({user: userId});

            await emailService.sendMail(
                email,
                emailActionEnum.USER_WAS_DELETED,
                {userName: name}
            );

            res.sendStatus(errorStatuses.status_204);
        } catch (e) {
            next(e);
        }
    },

    createUser: async (req, res, next) => {
        try {
            const {body, body: {name, email, password}} = req;

            const hashedPassword = await passwordService.hash(password);

            const createdUser = await User.create({ ...body, password: hashedPassword });

            const utilUser = userUtil.userNormalizator(createdUser.toObject());

            await emailService.sendMail(email, emailActionEnum.USER_WAS_REGISTERED, {userName: name});

            res.status(errorStatuses.status_201).json(utilUser);
        } catch (e) {
            next(e);
        }
    },
};
