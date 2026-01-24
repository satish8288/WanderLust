const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const router = express.Router({ mergeParams: true });
const userController = require("../controllers/userControllers.js");

//Signup
router
  .route("/signup")
  .get((req, res) => {
    res.render("user/signup.ejs");
  })
  .post(wrapAsync(userController.renderSignupForm));

//Login
router
  .route("/login")
  .get((req, res) => {
    res.render("user/login.ejs");
  })
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.renderLoginForm
  );

//Logout
router.get("/logout", userController.logoutController);

module.exports = router;
