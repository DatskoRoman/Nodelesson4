module.exports = {
    badRequest: {
        message: 'Email already exists',
        code: 400
    },

    notValidBody: {
        message: 'Wrong email or password',
        code: 400
    },

    Forbidden: {
        message: 'Access denied',
        code: 403
    },

    notFound: {
        message: 'Wrong email or password',
        code: 404
    },

    notFoundById: {
        message: 'User with this id does not exist',
        code: 404
    }
};
