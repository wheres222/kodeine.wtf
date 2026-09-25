// Sign In / Create Account now live on the Kodeine panel (the separate backend).
// Any element with data-auth="login" or data-auth="register" sends people there.
// PANEL_URL is defined in products.js, which every page loads before this file.
(() => {
  const base = (typeof PANEL_URL === "string" && PANEL_URL) ? PANEL_URL.replace(/\/+$/, "") : "";

  document.addEventListener("click", e => {
    const t = e.target.closest("[data-auth]");
    if (!t) return;
    e.preventDefault();
    const path = t.dataset.auth === "register" ? "/register" : "/login";
    window.location.href = base + path;
  });
})();
