const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {
  validateReviews,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewConrollers = require("../controllers/reviewControllers.js");

//Review route
router.post(
  "/",
  validateReviews,
  isLoggedIn,
  wrapAsync(reviewConrollers.createReview)
);

//Review delete route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewConrollers.deleteReview)
);

module.exports = router;
