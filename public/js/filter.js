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
switchBtn.addEventListener("click", () => {
  const gstInfo = document.querySelectorAll(".gstInfo");
  for (const info of gstInfo) {
    if (info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
});
