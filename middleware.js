const { listingValidateSchema } = require("./schema.js");
const { reviewValidateSchema } = require("./schema.js");
const ExpressErr = require("./utils/ExpressErr.js");
const Listing = require("./models/listing");
const Review = require("./models/reviews.js");
const cloudinary = require("./config/cloudinary.js");
// listing validate middleware
module.exports.validateListings = (req, res, next) => {
  let { error } = listingValidateSchema.validate(req.body);
  if (error) {
    let errMessage = error.details.map((val) => val.message);
    throw new ExpressErr(400, errMessage);
  } else {
    next();
  }
};

// review validate middleware
module.exports.validateReviews = (req, res, next) => {
  let { error } = reviewValidateSchema.validate(req.body);
  if (error) {
    let errMessage = error.details.map((val) => val.message);
    throw new ExpressErr(400, errMessage);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // console.log(req);
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in create listing.");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isListingOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not owner of this listing.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not author of this review.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//
module.exports.handleImageUpload = async (req, res, next) => {
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "wanderlust_DEV" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(req.file.buffer);
  });
  // res.send(req.file);
  req.image = {
    imageUrl: result.secure_url,
    filename: result.public_id,
  };
  next();
};
