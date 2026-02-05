require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressErr = require("./utils/ExpressErr.js");
const ListingsRouter = require("./routes/listings");
const ReviewsRouter = require("./routes/reviews");
const UserRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");
// const MONGO_URI = "mongodb://localhost:27017/wanderlust"; // Replace with your MongoDB URI
const dbUrl = process.env.ATLASDB_URL;
//MongoDB connection
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

//setting path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//session options
const sessionOptions = {
  secret: "mysecretCode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    exprires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// //root route
// app.get("/", (req, res) => {
//   res.send("Hello from root route");
// });

//session creation
app.use(session(sessionOptions));

//flash messages
app.use(flash());

//clear flash
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

//authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Storing flash messages to local
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  console.log();

  next();
});

// app.get("/demoUser", async (req, res) => {
//   let demoUser02 = new User({
//     email: "demoUser02@gmail.com",
//     username: "user02",
//   });
//   let registerUser = await User.register(demoUser02, "helloUser02"); //pbkdf2 Hashing algorithm used
//   res.send(registerUser);
// });
//all listings route
app.use("/listings", ListingsRouter);
app.use("/listings/:id/reviews", ReviewsRouter);
app.use("/", UserRouter);

//error middleware for routes
app.use((req, res, next) => {
  next(new ExpressErr(404, "Page Not Found."));
});

//Middleware all errors
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong." } = err;
  res.status(statusCode).render("error.ejs", { message, statusCode });
});

app.listen(8080, () => {
  console.log(`Server is running on http://localhost:8080/listings`);
});
