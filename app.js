const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressErr = require("./utils/ExpressErr.js");
const allListings = require("./routes/listings");
const allReviews = require("./routes/reviews");
const session = require("express-session");
const flash = require("connect-flash");
const MONGO_URI = "mongodb://localhost:27017/wanderlust"; // Replace with your MongoDB URI
// Connect to MongoDB
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URI);
}

//setting path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

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

//root route
app.get("/", (req, res) => {
  res.send("Hello from root route");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});

//all listings route
app.use("/listings", allListings);
app.use("/listings/:id/reviews", allReviews);

app.use((req, res, next) => {
  next(new ExpressErr(404, "Page Not Found."));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong." } = err;
  res.status(statusCode).render("error.ejs", { message, statusCode });
});

app.listen(8080, () => {
  console.log(`Server is running on http://localhost:8080/listings`);
});
