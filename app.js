const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressErr = require("./utils/ExpressErr.js");

const allListings = require("./routes/listings");
const allReviews = require("./routes/reviews");

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

//root route
app.get("/", (req, res) => {
  res.send("Hello from root route");
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
