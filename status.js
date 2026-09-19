// Status page data. Product statuses come from products.js (status.label / status.type).
// Status types: "ok" (working), "updating", "soon" (coming soon), "down".
const STATUS_UPDATED = "2026-09-17 12:00 UTC"; // change whenever you update statuses

const SERVICES = [
  { name: "Website", status: { label: "Operational", type: "ok" } },
  { name: "Checkout & Payments", status: { label: "Operational", type: "ok" } },
  { name: "Product Delivery", status: { label: "Operational", type: "ok" } },
  { name: "Loader", status: { label: "Operational", type: "ok" } },
  { name: "Discord Support", status: { label: "Operational", type: "ok" } }
];
