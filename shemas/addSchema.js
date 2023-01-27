const Joi = require('joi');

const addSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  phone: Joi.number().positive().required(),
  email: Joi.string().email().required(),
  favorite: Joi.boolean(),
}).messages({
  'string.base': `"" should be a type of string`,
  'string.empty': `"" must contain value`,
  'string.email': '{{#label}} must be a valid email',
  'any.required': `missing required name field`,
});

module.exports = addSchema;