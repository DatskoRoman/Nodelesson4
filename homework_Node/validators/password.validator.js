const Joi = require('joi');

const passwordValidator = Joi.object({
    password: Joi.string()
        .min(5)
        .max(10)
        .trim()
        .required(),
});

module.exports = {passwordValidator};
