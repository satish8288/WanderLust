console.log("map file loaded");
(() => {
  if (typeof listingData === "undefined") {
    console.error("listingData not found");
    return;
  }
  const { lat, lng, location } = listingData;
  // map code
  const map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  L.marker([lat, lng]).addTo(map).bindPopup(location).openPopup();
})();
