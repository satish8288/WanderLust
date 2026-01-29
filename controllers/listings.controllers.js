const Listing = require("../models/listing");
const cloudinary = require("../config/cloudinary.js");
//index route
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

//new route
module.exports.renderNewForm = (req, res) => {
  // console. log(req.user);
  res.render("listings/new.ejs");
};

//show route
module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    });
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    const { location } = req.body.listing;

    const encodedLocation = encodeURIComponent(location);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}`
    );

    const data = await response.json();

    if (!data || data.length === 0) {
      req.flash("error", "Invalid address");
      return res.redirect("/listings/new");
    }

    newListing.geometry = {
      lat: Number(data[0].lat),
      lng: Number(data[0].lon),
    };

    newListing.image = req.image;

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/listings/new");
  }
};

//edit route
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
};

//update route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  console.log(listing.image);
  if (typeof req.image !== "undefined") {
    await cloudinary.uploader.destroy(listing.image.filename);
    listing.image = req.image;
    console.log(listing.image);

    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

//dalete route
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
