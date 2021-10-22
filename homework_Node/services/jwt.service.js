const jwt = require('jsonwebtoken');

const {typeTokenEnum: {ACCESS, REFRESH, ACTION}} = require('../configs');
const {ErrorHandler: {ErrorHandler}, messagesEnum, statusEnum} = require('../errors');
const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACTION_SECRET} = require('../configs/config');

module.exports = {
    generateToken: () => {
        const access_token = jwt.sign({}, JWT_ACCESS_SECRET, {expiresIn: '15m'});
        const refresh_token = jwt.sign({}, JWT_REFRESH_SECRET, {expiresIn: '30d'});

        return {
            access_token,
            refresh_token
        };
    },

    verifyToken(token, type = ACCESS) {
        let secretWord = '';
        try {
            switch (type) {
                case ACCESS:
                    secretWord = JWT_ACCESS_SECRET;
                    break;
                case REFRESH:
                    secretWord = JWT_REFRESH_SECRET;
                    break;
                case ACTION:
                    secretWord = JWT_ACTION_SECRET;
            }
            jwt.verify(token, secretWord);
        } catch (e) {
            throw new ErrorHandler(messagesEnum.INVALID_TOKEN, statusEnum.UNAUTHORIZED);
        }
    },

    createActionToken: () => jwt.sign({}, JWT_ACTION_SECRET, {expiresIn: '1d'})
};
