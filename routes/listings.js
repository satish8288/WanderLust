const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const listingControllers = require("../controllers/listings.controllers.js");
const {
  validateListings,
  isLoggedIn,
  isListingOwner,
} = require("../middleware.js");

// Index route and Create Route
router
  .route("/")
  .get(wrapAsync(listingControllers.index))
  .post(
    isLoggedIn,
    validateListings,
    wrapAsync(listingControllers.createListing)
  );

//Show Route, Edit Route, Update route
router
  .route("/:id")
  .get(wrapAsync(listingControllers.showListings))
  .put(
    isLoggedIn,
    isListingOwner,
    validateListings,
    wrapAsync(listingControllers.updateListing)
  )
  .delete(
    isLoggedIn,
    isListingOwner,
    wrapAsync(listingControllers.deleteListing)
  );

//New Route
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingControllers.editListing));

module.exports = router;
