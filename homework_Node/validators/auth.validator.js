const Joi = require('joi');

const {constants} = require('../configs');

const authValidator = Joi.object({
    email: Joi.string()
        .trim()
        .regex(constants.EMAIL_REGEXP)
        .required(),

    password: Joi.string()
        .min(5)
        .max(10)
        .trim()
        .required(),
});

module.exports = {authValidator};
