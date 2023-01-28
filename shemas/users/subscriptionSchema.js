const Joi = require('joi');

const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required(),
}).messages({
  'string.base': `"" should be a type of string`,
  'string.empty': `"" must contain value`,
  'any.required': `missing required name field`,
});

module.exports = subscriptionSchema;