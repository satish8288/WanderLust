const Joi = require("joi");

//Validation schema for lintings
module.exports.listingValidateSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
  }).required(),
});

//Validation for Reviews
module.exports.reviewValidateSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(0).max(5).required(),
    comment: Joi.string().required(),
  }).required(),
});
