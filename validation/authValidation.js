const Joi = require("@hapi/joi");

const registerValidation = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.ref('password') // TODO: Improve message
});

const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
