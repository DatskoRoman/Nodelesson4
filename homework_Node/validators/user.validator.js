const Joi = require('joi');

const { EMAIL_REGEXP, PASSWORD_REGEXP } = require('../configs/constants');
const userRoles = require('../configs/users-role');
const CV = require('./common.validators');


const userLangugeValidator = {
    fr: Joi.string(),
    sp: Joi.string(),
    gs: Joi.string(),
    gsada: Joi.string(),
};

const createUserValidator = Joi.object({
    name: CV.nameValidator.required(),

    email: Joi
        .string()
        .trim()
        .regex(EMAIL_REGEXP)
        .required(),

    password: Joi
        .string()
        .min(5)
        .max(10)
        .regex(PASSWORD_REGEXP)
        .trim()
        .required(),

    role: Joi.string().allow(...Object.values(userRoles)),

    language: CV.languageValidator,
    ...userLangugeValidator
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
