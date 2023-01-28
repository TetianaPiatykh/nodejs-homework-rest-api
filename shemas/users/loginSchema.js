const Joi = require('joi');

const loginSchema = Joi.object({
  password: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
}).messages({
  'string.base': `"" should be a type of string`,
  'string.empty': `"" must contain value`,
  'string.email': '{{#label}} must be a valid email',
  'any.required': `missing required name field`,
});

module.exports = loginSchema;