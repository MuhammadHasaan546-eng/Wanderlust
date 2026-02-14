const express = require("express");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const {
  validateReview,
  isLoggedIn,
  isAuthorReview,
} = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/review.js");

const router = express.Router({ mergeParams: true });

// Reviews route
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));
// review delete route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthorReview,

  wrapAsync(destroyReview),
);

module.exports = router;
