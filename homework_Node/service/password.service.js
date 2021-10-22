const bcrypt = require('bcrypt');

const {ErrorHandler, errorMessages, errorStatuses} = require('../errors');


module.exports = {
    hash: (password) => bcrypt.hash(password, 10),

    compare: async (password, hashPassword) => {
        const isPasswordMatched = await bcrypt.compare(password, hashPassword);

        if (!isPasswordMatched) {
            throw new ErrorHandler(
                errorMessages.WRONG_EMAIL_OR_PASSWORD,
                errorStatuses.status_400);
        }
    }
};
