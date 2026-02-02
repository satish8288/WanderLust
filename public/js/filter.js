// filter

const slider = document.querySelector(".slider");
const leftBtn = document.querySelector(".left");
const rightBtn = document.querySelector(".right");

leftBtn.addEventListener("click", () => {
  slider.scrollBy({ left: -120, behavior: "smooth" });
});

rightBtn.addEventListener("click", () => {
  slider.scrollBy({ left: 120, behavior: "smooth" });
});

// switch
const switchBtn = document.querySelector("#switchCheckDefault");
const gstInfo = document.querySelector("#gstInfo");
console.dir(gstInfo);

switchBtn.addEventListener("click", () => {
  gstInfo.style.display =
    gstInfo.style.display === "none" || gstInfo.style.display === ""
      ? "inline"
      : "none";
});
