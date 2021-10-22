const Joi = require('joi');

const {PASSWORD_REGEXP, EMAIL_REGEXP} = require('../configs/constants');

const login = Joi.object({
    password: Joi
        .string()
        .regex(PASSWORD_REGEXP)
        .min(6)
        .required(),

    email: Joi
        .string()
        .regex(EMAIL_REGEXP)
        .lowercase()
        .trim()
        .required(),
});

module.exports = {login};
