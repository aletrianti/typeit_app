const Joi = require("@hapi/joi");

const registerValidation = Joi.object({
    firstName: Joi.string().required().label('First name'),
    lastName: Joi.string().required().label('Last name'),
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().min(6).required().label('Password'),
    // confirmPassword: Joi.ref('password')
    confirmPassword: Joi.any().valid(Joi.ref('password')).label('Confirm field') // TODO: Work on the error message 
});

const loginValidation = Joi.object({
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().required().label('Password')
});

const noteValidation = Joi.object({
    title: Joi.string().required().label('Title'),
    category: Joi.any().required().label('Category'),
    body: Joi.string().label('Description')
});

const categoryValidation = Joi.object({
    name: Joi.string().required().label('Name')
});

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.noteValidation = noteValidation;
module.exports.categoryValidation = categoryValidation;
