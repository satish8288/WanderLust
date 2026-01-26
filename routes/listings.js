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
const cloudinary = require("../config/cloudinary.js");

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
// .post(
//   upload.single("listing[image]"),
//   wrapAsync(async (req, res) => {
//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream({ folder: "wanderlust_DEV" }, (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         })
//         .end(req.file.buffer);
//     });
//     // res.send(req.file);
//     res.json({
//       imageUrl: result.secure_url,
//       public_id: result.public_id,
//     });

// console.log(req.body);
// res.send(req.file);
//   })
// );

//New Route
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

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

//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingControllers.editListing));

module.exports = router;
