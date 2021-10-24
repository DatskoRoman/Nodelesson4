const Joi = require('joi');
const {EMAIL_REGEXP} = require('../configs/constants');

const mailValidator = Joi.object({
    email: Joi
        .string()
        .trim()
        .regex(EMAIL_REGEXP)
        .required(),
});

module.exports = {mailValidator};
