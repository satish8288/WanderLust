const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const listingControllers = require("../controllers/listings.controllers.js");
const {
  validateListings,
  isLoggedIn,
  isListingOwner,
  handleImageUpload,
} = require("../middleware.js");

const upload = require("../config/multer.js");

// Index route and Create Route
router
  .route("/")
  .get(wrapAsync(listingControllers.index))
  .post(
    isLoggedIn,
    validateListings,
    upload.single("listing[image]"),
    wrapAsync(handleImageUpload),
    wrapAsync(listingControllers.createListing)
  );

//New Route
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

//Show Route, Edit Route, Update route
router
  .route("/:id")
  .get(wrapAsync(listingControllers.showListings))
  .put(
    isLoggedIn,
    isListingOwner,
    upload.single("listing[image]"),
    wrapAsync(handleImageUpload),
    validateListings,
    wrapAsync(listingControllers.updateListing)
  )
  .delete(
    isLoggedIn,
    isListingOwner,
    wrapAsync(listingControllers.deleteListing)
  );

//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingControllers.editListing));

module.exports = router;
