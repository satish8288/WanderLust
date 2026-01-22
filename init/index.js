const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URI = "mongodb://localhost:27017/wanderlust"; // Replace with your MongoDB URI

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

//initializing data
const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => {
    return { ...obj, owner: "696de1a305e5ace04df32257" };
  });
  await Listing.insertMany(initData.data);
  console.log("data was initialize.");
};

initDB();
