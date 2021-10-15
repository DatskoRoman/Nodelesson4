const Joi = require('joi');

const {PASSWORD_REGEXP, EMAIL_REGEXP} = require('../configs/constants');

const login = Joi.object({
    password: Joi
        .string()
        .regex(PASSWORD_REGEXP)
        .trim()
        .required(),

    email: Joi
        .string()
        .regex(EMAIL_REGEXP)
        .trim()
        .required(),
});

module.exports = {login};
