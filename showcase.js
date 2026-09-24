// Homepage showcase. To add an image:
//   1. Put the file in the "showcase" folder (e.g. showcase/menu.png)
//   2. Add an entry below. Images show as a 3-column grid, in this order.
// "title" and "caption" are optional and appear when an image is opened full size.
const SHOWCASE = [
  { src: "menu.png", title: "Menu", caption: "Clean, easy-to-use in-game menu." },
  { src: "scientist.png", title: "Rust", caption: "In-game view." },
  { src: "skeleton1.png", title: "Rust", caption: "ESP and visuals." },
  { src: "z.png", title: "Rust", caption: "See it in action." },
  { src: "213123.png", title: "In Game", caption: "Live gameplay." },
  { src: "744.png", title: "In Game", caption: "Full feature set." }
];

(() => {
  const grid = document.getElementById("showcase");
  if (!grid) return;
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  if (!SHOWCASE.length) {
    grid.closest("section").hidden = true;
    return;
  }

  grid.innerHTML = SHOWCASE.map((item, i) => `
    <button class="shot" type="button" data-i="${i}" aria-label="Open ${esc(item.title || "image " + (i + 1))}">
      <img src="${esc(item.src)}" alt="${esc(item.title)}" loading="lazy">
      <span class="shot-zoom"><i class="fa-solid fa-expand"></i></span>
    </button>`).join("");

  // Lightbox
  const box = document.createElement("div");
  box.className = "lightbox";
  box.innerHTML = `
    <button class="lb-btn lb-close" type="button" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
    <button class="lb-btn lb-prev" type="button" aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>
    <figure class="lb-figure">
      <img class="lb-img" alt="">
      <figcaption class="lb-caption"></figcaption>
    </figure>
    <button class="lb-btn lb-next" type="button" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>
    <span class="lb-count"></span>`;
  document.body.appendChild(box);

  let current = 0;
  const show = i => {
    current = (i + SHOWCASE.length) % SHOWCASE.length;
    const item = SHOWCASE[current];
    box.querySelector(".lb-img").src = item.src;
    box.querySelector(".lb-img").alt = item.title || "";
    box.querySelector(".lb-caption").innerHTML =
      (item.title ? `<strong>${esc(item.title)}</strong>` : "") + (item.caption ? `<span>${esc(item.caption)}</span>` : "");
    box.querySelector(".lb-count").textContent = `${current + 1} / ${SHOWCASE.length}`;
  };
  const open = i => { show(i); box.classList.add("open"); document.body.style.overflow = "hidden"; };
  const close = () => {
    box.classList.remove("open");
    if (!document.querySelector(".modal-overlay.open")) document.body.style.overflow = "";
  };

  const single = SHOWCASE.length === 1;
  box.querySelector(".lb-prev").hidden = single;
  box.querySelector(".lb-next").hidden = single;

  grid.addEventListener("click", e => {
    const shot = e.target.closest(".shot");
    if (shot) open(+shot.dataset.i);
  });
  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", () => show(current - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(current + 1));
  box.addEventListener("click", e => { if (e.target === box || e.target.classList.contains("lb-figure")) close(); });
  document.addEventListener("keydown", e => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft" && !single) show(current - 1);
    if (e.key === "ArrowRight" && !single) show(current + 1);
  });

  // Swipe on touch screens
  let startX = null;
  box.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", e => {
    if (startX === null || single) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
