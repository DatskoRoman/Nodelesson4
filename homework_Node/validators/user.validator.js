const Joi = require('joi');

const {constants, userRole: {ADMIN, MANAGER, USER}} = require('../configs');

const createUserValidator = Joi.object({
    name: Joi
        .string()
        .alphanum()
        .min(2)
        .max(30)
        .trim()
        .required(),

    email: Joi
        .string()
        .trim()
        .regex(constants.EMAIL_REGEXP)
        .required(),

    password: Joi
        .string()
        .min(5)
        .max(10)
        .trim()
        .required(),

    role: Joi
        .string()
        .trim()
        .required()
        .allow(ADMIN, MANAGER, USER)
});

const updateUserValidator = Joi.object({
    name: Joi
        .string()
        .alphanum()
        .min(2)
        .max(30)
        .trim()
        .required()
});

module.exports = {createUserValidator, updateUserValidator};
