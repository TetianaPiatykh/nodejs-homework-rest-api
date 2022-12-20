const Joi = require('joi');

const updateSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  phone: Joi.number().positive(),
  email: Joi.string().email().message('{{#label}} must be a valid email'),
})
  .min(1)
  .message('missing fields');

  module.exports = updateSchema;