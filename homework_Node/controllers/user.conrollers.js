const {OAuth, User, Action} = require('../dataBase/index');
const {emailActionEnum}=require('../configs');
const {messagesEnum, statusEnum} = require('../errors');
const {emailService,passwordService, jwtService} = require('../services');
const {ACTIVATE_USER} = require('../configs/action-token-type');
const {getAllUsers} = require('../services/user.service');

module.exports = {
    getUsers: async (req, res) => {
        try {
            const users = await getAllUsers(req.query)
                .lean()
                .select('-password');

            res.json(users);
        } catch (e) {
            res.json(e.message);
        }
    },

    getUser: async (req, res, next) => {
        try {
            const user = await User.find({_id: req.params.id}).select('-password');

            res.json(user);
        } catch (e) {
            next(e);
        }
    },

    postUser: async (req, res) => {
        try {
            const hashPas = await passwordService.hash(req.body.password);

            const {user} = await User.create({...req.body, password: hashPas});

            const actionToken = jwtService.createActionToken();

            await Action.create({action_token: actionToken, type: ACTIVATE_USER, user_id: user._id});

            await emailService(user.email, emailActionEnum.WELCOME, {userName: user.name, token: actionToken});

            res.status(statusEnum.CREATED).json({user,actionToken});
        } catch (e) {
            res.json(e.message);
        }
    },

    deleteUser: async (req, res) => {
        try {
            const {user} = req;

            await User.deleteOne({_id: user._id});
            
            await OAuth.deleteMany({user_id: user._id});

            await emailService(user.email, emailActionEnum.DELETE, {userName: user.name});

            res.sendStatus(statusEnum.NO_CONTENT);
        } catch (e) {
            res.json(e.message);
        }
    },

    updateUser: async (req, res) => {
        try {
            const newUser = await User.findOneAndUpdate({_id: req.params.id}, {$set: {name: req.body.name}});

            await emailService(newUser.email, emailActionEnum.UPDATE, {userName: newUser.name});

            res.status(statusEnum.CREATED).json(messagesEnum.UPDATE_USER);
        } catch (e) {
            res.json(e.message);
        }
    }
};
