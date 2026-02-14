const Joi = require("joi");
const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("", null),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});
const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Rating must be a number.",
    "number.min": "Rating must be at least 1.",
    "number.max": "Rating cannot be more than 5.",
    "any.required": "Rating is required.",
  }),
  comment: Joi.string().min(5).max(500).required().messages({
    "string.base": "Comment must be a string.",
    "string.empty": "Comment cannot be empty.",
    "string.min": "Comment must be at least 5 characters long.",
    "string.max": "Comment cannot exceed 500 characters.",
    "any.required": "Comment is required.",
  }),
});

const userSignupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

module.exports = { listingSchema, reviewSchema, userSignupSchema };
