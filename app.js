const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MONGO_URI = "mongodb://localhost:27017/wanderlust"; // Replace with your MongoDB URI
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErr = require("./utils/ExpressErr.js");
const Schema = require("./schema.js");
//setting path
app.use(express.static(path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// Connect to MongoDB
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("err");
  });
async function main() {
  await mongoose.connect(MONGO_URI);
}

// Creating root route
app.get("/", (req, res) => {
  res.send("Hello from root route");
});

// Index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New Route for Adding new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Collect Id then Render Show Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

//Create Route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    let result = Schema.validate(req.body);
    console.log(result);

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    // console.log(newListing);
  })
);

//Edit Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// Update route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressErr(400, "Send valid data for listing.");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
  })
);

//Delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

//Creating testLi,sting Route
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My new Villa",
//     description: "By the Beach",
//     image:
//       "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG91c2V8ZW58MHx8MHx8fDA%3D",
//     price: 2999,
//     location: "Chandigarh",
//     country: "India",
//   });

//   sampleListing.save();
//   console.log("Sample was save");
//   res.send("successful testing");
// });

app.use((req, res, next) => {
  //res.status(404).send("Page not found.");
  next(new ExpressErr(404, "Page Not Found."));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong." } = err;
  res.status(statusCode).render("error.ejs", { message, statusCode });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
