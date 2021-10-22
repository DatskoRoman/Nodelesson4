module.exports = {
    userNormalizator: (userToNormalize = {}) => {
        const fieldsToRemove = ['password'];

        fieldsToRemove.forEach(value => delete userToNormalize[value]);

        return userToNormalize;
    }
};
