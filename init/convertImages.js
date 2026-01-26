const { data: sampleListings } = require("./data");

const updatedListings = sampleListings.map((listing) => {
  if (typeof listing.image === "string") {
    return {
      ...listing,
      image: {
        url: listing.image,
        filename: "listingImage",
      },
    };
  }
  return listing;
});

console.log(updatedListings);
