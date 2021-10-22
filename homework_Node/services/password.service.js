const bcrypt = require('bcrypt');

const {messagesEnum, statusEnum, ErrorHandler: {ErrorHandler}} = require('../errors');

module.exports = {
    hash: (password) => bcrypt.hash(password, 10),

    comparing: async (password, hashPassword) => {
        const isPasswordMatched = await bcrypt.compare(password, hashPassword);

        if (!isPasswordMatched) {
            throw new ErrorHandler(messagesEnum.WRONG_LOGIN_OR_PASS, statusEnum.NO_FOUND);
        }
    }
};
