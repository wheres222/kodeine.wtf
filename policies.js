// Refund & Privacy Policy popups. Any link with data-policy="refund" or "privacy" opens one.
const POLICIES = {
  refund: {
    title: "Refund Policy",
    icon: "fa-solid fa-ban",
    body: `
      <h3>All Sales Are Final</h3>
      <p>Every kodeine.wtf product is digital and delivered instantly. Once your order is complete it can't be refunded, whatever the reason.</p>

      <h3>Why We Can't Offer Refunds</h3>
      <p>Access to our software is granted the moment you pay. Digital access can't be handed back, and we have no reliable way to confirm whether a product was used after delivery.</p>

      <h3>Before You Buy</h3>
      <p>Please make sure a product is right for you first:</p>
      <ul>
        <li>Join our <a href="https://discord.gg/scrYgMHvKe" target="_blank" rel="noopener">Discord</a> and ask any questions you have</li>
        <li>Read the product's description and features</li>
        <li>Check the product's status to confirm it's currently working</li>
        <li>Confirm your system meets the listed requirements</li>
      </ul>

      <h3>Chargebacks</h3>
      <p>Opening a chargeback or payment dispute breaks our terms of service. Accounts involved in a chargeback are permanently banned from kodeine.wtf. If something is wrong, contact us on Discord first and we'll do our best to help.</p>`
  },
  privacy: {
    title: "Privacy Policy",
    icon: "fa-solid fa-lock",
    body: `
      <h3>1. What We Collect</h3>
      <p>We collect the details you give us when you make an account, buy something or contact support. This can include your email address, your Discord username and order details. Payments are handled by our payment provider, and we never see your full card details.</p>

      <h3>2. How We Use It</h3>
      <p>We use your information to deliver and support your products, process orders, send important service updates and answer your messages.</p>

      <h3>3. Sharing</h3>
      <p>We never sell or rent your personal information. We only share it with trusted services we need to run the site, such as payment processing and hosting, and they must keep it confidential.</p>

      <h3>4. Security</h3>
      <p>We take reasonable steps to protect your data, and payments go over encrypted connections. No online service can promise complete security, though.</p>

      <h3>5. Cookies</h3>
      <p>We use cookies to keep you signed in and to remember your preferences. You can turn cookies off in your browser, but some features may stop working.</p>

      <h3>6. Contact</h3>
      <p>Questions about your data? Reach us on our <a href="https://discord.gg/scrYgMHvKe" target="_blank" rel="noopener">Discord</a>.</p>`
  },
  rules: {
    title: "Rules",
    icon: "fa-solid fa-book",
    body: `
      <h3>1. No Account or Key Sharing</h3>
      <p>Your purchase is for you only. Sharing, reselling or giving away your key, download or account is not allowed and will get your access revoked without a refund.</p>

      <h3>2. No Cracking or Redistribution</h3>
      <p>Do not try to crack, reverse engineer, modify or re-upload any kodeine.wtf product. Leaking our software leads to a permanent ban.</p>

      <h3>3. Respect Everyone</h3>
      <p>Treat staff and other members with respect. Harassment, hate speech, threats and spam are not tolerated on the site or in our Discord.</p>

      <h3>4. Support Through Official Channels</h3>
      <p>Only ask for help in our <a href="https://discord.gg/scrYgMHvKe" target="_blank" rel="noopener">Discord</a>. Please don't DM staff members directly unless they ask you to.</p>
      <ul>
        <li>Describe your issue clearly and include any error messages</li>
        <li>Have your order email or invoice ID ready</li>
        <li>Be patient, as tickets are handled in order</li>
      </ul>

      <h3>5. No Scamming or Impersonation</h3>
      <p>Do not pretend to be staff or sell fake keys. Staff will never ask for your password. Report anyone doing this to us.</p>

      <h3>6. Chargebacks</h3>
      <p>Chargebacks and payment disputes break our <a href="#" data-policy="refund">Refund Policy</a> and result in a permanent ban.</p>

      <h3>7. Use at Your Own Risk</h3>
      <p>You are responsible for how you use our products. Always check a product's status before using it.</p>

      <h3>Enforcement</h3>
      <p>Breaking these rules can lead to a warning, a suspension or a permanent ban, depending on how serious it is. Staff decisions are final. These rules may change at any time.</p>`
  }
};

(() => {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay policy-overlay";
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head">
        <i class="modal-icon"></i>
        <h2 id="modal-title"></h2>
      </div>
      <div class="modal-divider"><span></span></div>
      <div class="modal-body"></div>
    </div>`;
  document.body.appendChild(overlay);

  const open = key => {
    const p = POLICIES[key];
    if (!p) return;
    overlay.querySelector(".modal-icon").className = "modal-icon " + p.icon;
    overlay.querySelector("#modal-title").textContent = p.title;
    const body = overlay.querySelector(".modal-body");
    body.innerHTML = p.body;
    body.scrollTop = 0;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    overlay.classList.remove("open");
    if (!document.querySelector(".modal-overlay.open")) document.body.style.overflow = "";
  };

  document.addEventListener("click", e => {
    const link = e.target.closest("[data-policy]");
    if (link) { e.preventDefault(); open(link.dataset.policy); }
  });
  overlay.querySelector(".modal-close").addEventListener("click", close);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape" || !overlay.classList.contains("open")) return;
    close();
    e.stopImmediatePropagation(); // don't also close a popup underneath
  });
})();
