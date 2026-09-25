// Homepage hero slideshow. One slide per product (its first image), with a timer bar under the picture.
// Images come from each product's "images" list in products.js; the hero logo is shown instead
// when there is nothing to show.
const SLIDE_MS = 7000;   // how long each image stays
const SLIDE_ANIM = 550;  // image slide, matches .hs-slide in style.css
const TEXT_FADE = 260;   // title/tagline fade, runs while the image slides

(async () => {
  const hs = document.getElementById("hero-slider");
  if (!hs || typeof getProducts !== "function") return;

  const catalog = await getProducts();
  // Fixed lead slides (showcase screenshots), then one slide per product (its first image).
  const lead = ["menu.png", "xx.png", "4444.png"].map(src => ({
    src,
    title: "kodeine.wtf",
    tagline: "Undetected software, delivered instantly.",
    href: "products.html",
    available: true,
  }));
  const productSlides = catalog
    .map(p => ({
      // Skip the product's cover/logo (first image); use the first real screenshot.
      src: (p.images || [])[1],
      title: p.name,
      tagline: p.short,
      href: `product.html?id=${encodeURIComponent(p.id)}`,
      available: p.status.type === "ok",
      soonLabel: p.status.label,
    }))
    .filter(s => s.src);
  const slides = [...lead, ...productSlides];
  if (!slides.length) return;

  const logo = document.getElementById("hero-logo");
  if (logo) logo.hidden = true;
  hs.hidden = false;
  document.querySelector(".hero").classList.add("hero-showcase");

  const headEl = hs.querySelector(".hs-head");
  const titleEl = hs.querySelector(".hs-title");
  const tagEl = hs.querySelector(".hs-tagline");
  const stageEl = hs.querySelector(".hs-stage");
  const barEl = hs.querySelector(".hs-progress span");
  const dotsEl = hs.querySelector(".hs-dots");
  const buyEl = hs.querySelector(".hs-buy");

  stageEl.insertAdjacentHTML("afterbegin", slides.map((s, i) =>
    `<div class="hs-slide off-right" data-i="${i}"><img src="${esc(s.src)}" alt="${esc(s.title)} screenshot"></div>`
  ).join(""));
  const slideEls = [...stageEl.querySelectorAll(".hs-slide")];

  dotsEl.innerHTML = slides.map((s, i) =>
    `<button class="hs-dot" type="button" role="tab" data-i="${i}" aria-label="${esc(s.title)}, slide ${i + 1}"></button>`
  ).join("");
  const dots = [...dotsEl.querySelectorAll(".hs-dot")];

  const stillMode = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = -1;
  let timer = null;
  let textTimer = null;

  // Jump an element to a position with no animation, so only the intended move is seen.
  const place = (el, cls) => {
    el.className = `hs-slide no-anim ${cls}`;
    void el.offsetWidth; // flush the jump before the transition is allowed again
  };

  const setText = i => {
    const s = slides[i];
    titleEl.textContent = s.title;
    tagEl.textContent = s.tagline;
    buyEl.href = s.href;
    buyEl.classList.toggle("hs-buy-soon", !s.available);
    buyEl.innerHTML = s.available
      ? `<i class="fa-solid fa-cart-shopping"></i> ${s.href === "products.html" ? "Browse Products" : "Purchase"}`
      : `<i class="fa-solid fa-clock"></i> ${esc(s.soonLabel || "Coming Soon")}`;
  };

  const show = (i, dir = 1) => {
    if (i === current) return;
    const previous = current;
    current = i;

    // Images: the old one slides out, the new one follows it in from the other side.
    slideEls.forEach((el, n) => {
      if (n === i || n === previous) return;
      place(el, dir > 0 ? "off-right" : "off-left");
    });
    if (previous > -1) {
      slideEls[previous].className = `hs-slide ${dir > 0 ? "off-left" : "off-right"}`;
      place(slideEls[i], dir > 0 ? "off-right" : "off-left");
    } else {
      place(slideEls[i], "off-right");
    }
    slideEls[i].className = "hs-slide active";

    // Text: fades out and back in while that happens.
    clearTimeout(textTimer);
    if (previous === -1 || stillMode) {
      setText(i);
    } else {
      headEl.classList.add("hs-fading");
      textTimer = setTimeout(() => {
        setText(i);
        headEl.classList.remove("hs-fading");
      }, TEXT_FADE);
    }

    dots.forEach((d, n) => {
      d.classList.toggle("active", n === i);
      d.setAttribute("aria-selected", n === i);
    });

    // Restart the timer bar from zero.
    barEl.style.animation = "none";
    void barEl.offsetWidth;
    barEl.style.animation = stillMode ? "none" : `hs-fill ${SLIDE_MS}ms linear forwards`;
  };

  const next = () => show((current + 1) % slides.length, 1);
  const stop = () => { clearInterval(timer); timer = null; };
  const start = () => {
    stop();
    if (!stillMode && slides.length > 1) timer = setInterval(next, SLIDE_MS);
  };

  dotsEl.addEventListener("click", e => {
    const dot = e.target.closest(".hs-dot");
    if (!dot) return;
    const i = +dot.dataset.i;
    show(i, i > current ? 1 : -1);
    start();
  });

  // Hovering holds the current slide, so a screenshot can be looked at properly.
  hs.addEventListener("mouseenter", () => { stop(); barEl.style.animationPlayState = "paused"; });
  hs.addEventListener("mouseleave", () => {
    if (!stillMode) { barEl.style.animationPlayState = "running"; start(); }
  });
  // Don't let slides pile up while the tab is in the background.
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());

  show(0);
  start();
})();
