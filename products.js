// Edit your products here. The products grid and every product page read from this list.
// sellauthProductId / sellauthVariantId: copy these numbers from your SellAuth dashboard (Products page).
// Leave a sellauthVariantId as null to let the buyer pick the variant inside the SellAuth checkout.
// images: screenshots for this product. The first one is its slide in the homepage hero;
// all of them show in the gallery on the product page.
const DISCORD = "https://discord.gg/scrYgMHvKe";

// The reseller/user panel (the separate Next.js backend). Sign In and the reseller
// buttons send people here. Locally it's the dev server; in production set PANEL.prod
// to wherever the panel is hosted, e.g. "https://panel.kodeine.wtf".
const PANEL = {
  local: "http://localhost:3000",
  prod: "https://panel.cathack.club"
};
const PANEL_URL = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? PANEL.local : PANEL.prod;

// Your SellAuth shop. Both are public values, safe to have in the site:
//   shopId:  the number shown as Shop ID at dash.sellauth.com/api
//   shopUrl: your store address, e.g. "https://cathack.mysellauth.com"
// Payment methods (Stripe, crypto, ...) are connected in the SellAuth dashboard, not here.
const SELLAUTH = {
  shopId: 245465,
  shopUrl: "https://cathack.mysellauth.com"
};

const PRODUCTS = [
  {
    id: "product-one",
    name: "Product One",
    sellauthProductId: null,
    images: [
      "df4412c254ee524b174ff4dd81f9d499.jpg",
      "df4412c254ee524b174ff4dd81f9d499.jpg",
      "df4412c254ee524b174ff4dd81f9d499.jpg",
      "df4412c254ee524b174ff4dd81f9d499.jpg"
    ],
    short: "Short description of this product goes here.",
    status: { label: "Undetected", type: "ok" },
    variants: [
      { name: "1 Day", price: 4.99, sellauthVariantId: null },
      { name: "1 Week", price: 9.99, sellauthVariantId: null },
      { name: "1 Month", price: 24.99, sellauthVariantId: null },
      { name: "Lifetime", price: 79.99, sellauthVariantId: null }
    ],
    description: "Full description of Product One. Explain what it is, what makes it good and who it is for.",
    features: ["Feature one", "Feature two", "Feature three", "Feature four"],
    requirements: ["Windows 10 / 11 (64-bit)", "Requirement two", "Requirement three"]
  },
  {
    id: "product-two",
    name: "Product Two",
    sellauthProductId: null,
    images: [
      "df4412c254ee524b174ff4dd81f9d499.jpg",
      "df4412c254ee524b174ff4dd81f9d499.jpg",
      "df4412c254ee524b174ff4dd81f9d499.jpg",
      "df4412c254ee524b174ff4dd81f9d499.jpg"
    ],
    short: "Short description of this product goes here.",
    status: { label: "Undetected", type: "ok" },
    variants: [
      { name: "1 Week", price: 14.99, sellauthVariantId: null },
      { name: "1 Month", price: 34.99, sellauthVariantId: null },
      { name: "Lifetime", price: 99.99, sellauthVariantId: null }
    ],
    description: "Full description of Product Two. Explain what it is, what makes it good and who it is for.",
    features: ["Feature one", "Feature two", "Feature three"],
    requirements: ["Windows 10 / 11 (64-bit)", "Requirement two"]
  },
  {
    id: "product-three",
    name: "Product Three",
    sellauthProductId: null,
    images: [
      "df4412c254ee524b174ff4dd81f9d499.jpg",
      "df4412c254ee524b174ff4dd81f9d499.jpg",
      "df4412c254ee524b174ff4dd81f9d499.jpg",
      "df4412c254ee524b174ff4dd81f9d499.jpg"
    ],
    short: "Short description of this product goes here.",
    status: { label: "Coming Soon", type: "soon" },
    variants: [
      { name: "1 Month", price: 29.99, sellauthVariantId: null },
      { name: "Lifetime", price: 119.99, sellauthVariantId: null }
    ],
    description: "Full description of Product Three. Explain what it is, what makes it good and who it is for.",
    features: ["Feature one", "Feature two"],
    requirements: ["Windows 10 / 11 (64-bit)"]
  }
];

const money = n => "$" + n.toFixed(2);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Product card used on the homepage and products page.
const productCard = p => {
  const from = Math.min(...p.variants.map(v => v.price));
  return `
    <a class="product" href="product.html?id=${p.id}">
      <div class="product-top"><img src="logo.png" alt=""></div>
      <div class="product-body">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.short)}</p>
        <div class="product-meta"><span class="price"><small>from</small> ${money(from)}</span><span class="status ${p.status.type}">${esc(p.status.label)}</span></div>
        <span class="btn">View Product</span>
      </div>
    </a>`;
};

// Live catalog: fetch products from the panel's storefront feed (which pulls them
// from SellAuth server-side). Falls back to the PRODUCTS list above if the panel
// is unreachable or hasn't been configured with a SellAuth key yet.
async function getProducts() {
  try {
    const r = await fetch(`${PANEL_URL}/api/v1/storefront/products`, { cache: "no-store" });
    if (r.ok) {
      const data = await r.json();
      if (Array.isArray(data.products) && data.products.length) return data.products;
    }
  } catch (_) { /* offline / not configured → fall back */ }
  return PRODUCTS;
}

if (typeof module !== "undefined") module.exports = { PRODUCTS };
