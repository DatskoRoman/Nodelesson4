const O_Auth = require('../dataBase/O_Auth');
const { userNormalizator } = require('../util/user.util');
const { jwtService, emailService} = require('../service');
const {LOGIN, LOGOUT} = require('../configs/email-action.enum');

module.exports = {
    login: async (req, res, next) => {
        try {
            const { user } = req;

            const tokenPair = jwtService.generateTokenPair();

            const userNormalized = userNormalizator(user);

            await O_Auth.create({
                ...tokenPair,
                user_id: userNormalized._id
            });

            await emailService.sendMail(user.email, LOGIN, user);

            res.json({
                user: userNormalized,
                ...tokenPair
            });
        } catch (e) {
            next(e);
        }
    },

    logout: async ( req, res, next ) => {
        try {
            const user = req.user;
            const token = req.token;

            await O_Auth.deleteOne({ access_token: token });

            await emailService.sendMail(user.email, LOGOUT, user);

            res.json('Logout successfully');
        } catch (e) {
            next(e);
        }
    },

    logoutAllDevices: async ( req, res, next ) => {
        try {
            const userSingIn = req.user;

            await O_Auth.deleteMany({ user_id: userSingIn._id });

            res.json('Logout All Devices success');
        } catch (e) {
            next(e);
        }
    },
};
