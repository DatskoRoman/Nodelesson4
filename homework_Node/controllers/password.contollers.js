const {userNormalizator} = require('../util/user.util');
const {emailService, jwtService, passwordService} = require('../services');
const {User, OAuth, Action} = require('../dataBase');
const {statusEnum, messagesEnum} = require('../errors');
const {typeTokenEnum, emailActionEnum} = require('../configs');

module.exports = {
    forgot: async (req, res) => {
        try {
            const {body: user} = req;

            const actionToken = jwtService.createActionToken();

            const newUser = userNormalizator(user);

            await Action.create({
                action_token: actionToken,
                type_action_token: typeTokenEnum.ACTION,
                user_id: newUser._id
            });

            await emailService(user.email, emailActionEnum.FORGOT_PASSWORD, {userName: newUser.name});

            res.json({user: newUser, actionToken}).status(statusEnum.CREATED);
        } catch (e) {
            res.json(e.message);
        }
    },

    setPassword: async (req, res) => {
        try {
            const {user, body: {password}} = req;

            const hashPas = await passwordService.hash(password);

            await User.findByIdAndUpdate({_id: user._id}, {password: hashPas});

            await OAuth.deleteMany({user_id: user._id});

            res.json(messagesEnum.PASSWORD_CHANGED);
        } catch (e) {
            res.json(e.message);
        }
    }
};
