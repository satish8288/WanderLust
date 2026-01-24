const User = require("../models/user.js");

//signup form
module.exports.renderSignupForm = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({
      email: email,
      username: username,
    });
    let newUserRegister = await User.register(newUser, password);
    console.log(newUserRegister);
    req.login(newUserRegister, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/listings");
  }
};

//login form
module.exports.renderLoginForm = (req, res) => {
  req.flash("success", `Welcome back ${req.user.username}`);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

//logout controller
module.exports.logoutController = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logout!");
    res.redirect("/listings");
  });
};
