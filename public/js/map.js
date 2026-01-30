console.log("map file loaded");

if (!window.listingData) {
  console.error("listingData missing");
}

const { lat, lng, address } = window.listingData;

const map = new maplibregl.Map({
  container: "map",
  style: "https://tiles.openfreemap.org/styles/liberty",
  center: [lng, lat],
  zoom: 7,
});

map.addControl(new maplibregl.NavigationControl());

map.on("load", () => {
  // Popup
  const popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 25,
  });

  // Marker element
  const el = document.createElement("div");
  el.className = "marker";
  el.style.backgroundColor = "red";
  el.style.width = "20px";
  el.style.height = "20px";
  el.style.borderRadius = "50%";
  el.style.cursor = "pointer";
  el.style.pointerEvents = "auto"; // 🔥 THIS FIXES IT

  el.addEventListener("mouseenter", () => {
    popup.setLngLat([lng, lat]).setHTML(`<b>${address}</b>`).addTo(map);
  });

  el.addEventListener("mouseleave", () => {
    popup.remove();
  });

  new maplibregl.Marker(el).setLngLat([lng, lat]).addTo(map);
});
