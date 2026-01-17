const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const router = express.Router({ mergeParams: true });

router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({
        email: email,
        username: username,
      });
      let newUserRegister = await User.register(newUser, password);
      console.log(newUserRegister);
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/listings");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Wanderlust.");
    res.redirect("/listings");
  }
);
module.exports = router;
