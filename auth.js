// Sign In / Create Account popup. UI only: accounts are not functional yet.
// Any element with data-auth="login" or data-auth="register" opens it.
(() => {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay auth-overlay";
  overlay.innerHTML = `
    <div class="modal auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button class="modal-close" type="button" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-head">
        <img class="auth-logo" src="afnfsa.png" alt="">
        <h2 id="auth-title">Welcome back</h2>
      </div>
      <div class="modal-divider"><span></span></div>

      <div class="auth-tabs" role="tablist">
        <button class="auth-tab active" type="button" data-view="login">Sign In</button>
        <button class="auth-tab" type="button" data-view="register">Create Account</button>
      </div>

      <div class="modal-body auth-body">
        <form class="auth-form active" data-form="login" novalidate>
          <label class="field">
            <span>Username or Email</span>
            <input class="input" name="identity" type="text" autocomplete="username" required>
          </label>
          <label class="field">
            <span>Password</span>
            <div class="pw-wrap">
              <input class="input" name="password" type="password" autocomplete="current-password" required>
              <button class="pw-toggle" type="button" aria-label="Show password"><i class="fa-solid fa-eye"></i></button>
            </div>
          </label>
          <div class="auth-row">
            <label class="check"><input type="checkbox" name="remember"> Remember me</label>
            <a href="#" class="auth-link" data-soon>Forgot password?</a>
          </div>
          <button class="btn btn-buy" type="submit">Sign In</button>
          <p class="auth-msg" role="alert"></p>
        </form>

        <form class="auth-form" data-form="register" novalidate>
          <label class="field">
            <span>Username</span>
            <input class="input" name="username" type="text" autocomplete="username" minlength="3" maxlength="20" required>
          </label>
          <label class="field">
            <span>Email</span>
            <input class="input" name="email" type="email" autocomplete="email" required>
          </label>
          <label class="field">
            <span>Password</span>
            <div class="pw-wrap">
              <input class="input" name="password" type="password" autocomplete="new-password" minlength="8" required>
              <button class="pw-toggle" type="button" aria-label="Show password"><i class="fa-solid fa-eye"></i></button>
            </div>
          </label>
          <label class="field">
            <span>Confirm Password</span>
            <input class="input" name="confirm" type="password" autocomplete="new-password" required>
          </label>
          <label class="check">
            <input type="checkbox" name="terms">
            <span>I agree to the <a href="#" class="auth-link" data-policy="refund">Refund Policy</a> and <a href="#" class="auth-link" data-policy="privacy">Privacy Policy</a></span>
          </label>
          <button class="btn btn-buy" type="submit">Create Account</button>
          <p class="auth-msg" role="alert"></p>
        </form>

        <div class="auth-or"><span>or</span></div>
        <button class="btn auth-discord" type="button" data-soon><i class="fa-brands fa-discord"></i> Continue with Discord</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const $ = s => overlay.querySelector(s);
  const titles = { login: "Welcome back", register: "Create your account" };
  const SOON = "Accounts are coming soon. You can still buy products without an account.";

  const show = view => {
    overlay.querySelectorAll(".auth-tab").forEach(t => t.classList.toggle("active", t.dataset.view === view));
    overlay.querySelectorAll(".auth-form").forEach(f => f.classList.toggle("active", f.dataset.form === view));
    overlay.querySelectorAll(".auth-msg").forEach(m => { m.textContent = ""; m.className = "auth-msg"; });
    $("#auth-title").textContent = titles[view];
  };
  const open = view => {
    show(view);
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => overlay.querySelector(".auth-form.active .input").focus(), 50);
  };
  const close = () => {
    overlay.classList.remove("open");
    if (!document.querySelector(".modal-overlay.open")) document.body.style.overflow = "";
  };

  document.addEventListener("click", e => {
    const t = e.target.closest("[data-auth]");
    if (t) { e.preventDefault(); open(t.dataset.auth); }
  });
  overlay.querySelectorAll(".auth-tab").forEach(t => t.addEventListener("click", () => show(t.dataset.view)));
  $(".modal-close").addEventListener("click", close);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", e => {
    // Let an open policy popup close first.
    if (e.key === "Escape" && !document.querySelector(".modal-overlay.policy-overlay.open")) close();
  });

  overlay.querySelectorAll(".pw-toggle").forEach(b => b.addEventListener("click", () => {
    const input = b.previousElementSibling;
    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    b.innerHTML = `<i class="fa-solid fa-eye${showing ? "" : "-slash"}"></i>`;
    b.setAttribute("aria-label", showing ? "Show password" : "Hide password");
  }));

  const message = (form, text, type) => {
    const m = form.querySelector(".auth-msg");
    m.textContent = text;
    m.className = "auth-msg " + type;
  };
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  overlay.querySelectorAll("[data-soon]").forEach(el => el.addEventListener("click", e => {
    e.preventDefault();
    message(overlay.querySelector(".auth-form.active"), SOON, "info");
  }));

  overlay.querySelectorAll(".auth-form").forEach(form => form.addEventListener("submit", e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(form));

    let error = "";
    if (form.dataset.form === "login") {
      if (!f.identity.trim() || !f.password) error = "Please enter your username or email and password.";
    } else {
      if (!/^[A-Za-z0-9_]{3,20}$/.test(f.username)) error = "Username must be 3–20 letters, numbers or underscores.";
      else if (!emailOk(f.email.trim())) error = "Please enter a valid email address.";
      else if (f.password.length < 8) error = "Password must be at least 8 characters.";
      else if (f.password !== f.confirm) error = "Passwords don't match.";
      else if (!f.terms) error = "Please accept the policies to continue.";
    }

    if (error) return message(form, error, "error");
    // TODO: send to the account backend once it exists.
    message(form, SOON, "info");
  }));
})();
