module.exports = {
    badRequest: {
        message: 'Email already exists',
        code: 400
    },

    notValidBody: {
        message: 'Wrong email or password',
        code: 400
    },

    FORBIDDEN: {
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
    },

    ok: {
        message: 'Ok',
        code: 200
    },

    create: {
        message: 'Create user',
        code: 201
    },

    accepted: {
        message: 'accepted for user',
        code: 200
    },
};
