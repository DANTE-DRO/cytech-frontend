/* ============ CyTech Platform Patch — layers onto original design without changing it ============ */
(function () {
  "use strict";
  /* >>> SET YOUR RENDER BACKEND URL HERE <<< */
  const API = window.CYTECH_API || "https://cytechbackend.onrender.com";
  const NOTES = [
    {
      id: "cybersecurity-foundations",
      t: "Cybersecurity Foundations",
      d: "CIA triad, threats, malware, defenses, careers",
    },
    {
      id: "ethical-hacking",
      t: "Ethical Hacking & Pentesting",
      d: "Recon, scanning, exploitation, post-exploitation, reports",
    },
    {
      id: "reverse-engineering",
      t: "Reverse Engineering",
      d: "Assembly, disassemblers, debuggers, malware analysis",
    },
    {
      id: "network-security",
      t: "Network Security",
      d: "TCP/IP, firewalls, IDS/IPS, Wireshark, VPNs",
    },
    {
      id: "linux-security-tools",
      t: "Linux & Security Tools",
      d: "Kali, Nmap, Burp, Metasploit, Hydra, John, Ghidra",
    },
    {
      id: "dfir",
      t: "Digital Forensics & IR",
      d: "Evidence, disk/memory forensics, incident response",
    },
  ];
  const FREE_APPS = [
    "terminal",
    "cybot",
    "sysmon",
    "monitor",
    "notepad",
    "files",
    "settings",
  ];
  const S = {
    get tok() {
      return localStorage.cyt_token || "";
    },
    set tok(v) {
      localStorage.cyt_token = v || "";
    },
    get user() {
      try {
        return JSON.parse(localStorage.cyt_user || "null");
      } catch (e) {
        return null;
      }
    },
    set user(v) {
      localStorage.cyt_user = JSON.stringify(v);
    },
    get ent() {
      try {
        return JSON.parse(localStorage.cyt_ent || "[]");
      } catch (e) {
        return [];
      }
    },
    set ent(v) {
      localStorage.cyt_ent = JSON.stringify(v);
    },
  };
  /* ---------- CSS ---------- */
  const css = `
.cyt-btn{position:relative;display:inline-block;padding:10px 22px;background:linear-gradient(135deg,#021a12,#033);border:1px solid #00ff9c;color:#00ffe1!important;font-family:inherit;font-weight:bold;letter-spacing:1px;border-radius:6px;cursor:pointer;text-transform:uppercase;box-shadow:0 0 8px #00ff9c55,inset 0 0 8px #00ff9c22;transition:all .18s;animation:cytpulse 2.2s infinite;user-select:none;text-align:center}
.cyt-btn:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 0 22px #00ff9c,inset 0 0 14px #00ff9c44;color:#fff!important}
.cyt-btn:active{transform:scale(.96)}
@keyframes cytpulse{0%,100%{box-shadow:0 0 8px #00ff9c55}50%{box-shadow:0 0 20px #00ff9c99}}
.cyt-overlay{position:fixed;inset:0;background:rgba(0,8,4,.82);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px)}
.cyt-modal{background:#050f0a;border:1px solid #00ff9c;border-radius:10px;box-shadow:0 0 40px #00ff9c44;width:min(560px,94vw);max-height:88vh;display:flex;flex-direction:column;font-family:'Share Tech Mono',monospace;color:#00ff9c;overflow:hidden}
.cyt-mhead{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:linear-gradient(90deg,#032,#011);border-bottom:1px solid #0f6;cursor:move;user-select:none}
.cyt-mhead b{color:#00ffe1;letter-spacing:2px}.cyt-x{background:#300;border:1px solid #f55;color:#f88;border-radius:4px;padding:2px 10px;cursor:pointer;font-family:inherit}
.cyt-x:hover{background:#f55;color:#000}
.cyt-mbody{padding:14px;overflow-y:auto}
.cyt-in{width:100%;box-sizing:border-box;background:#000;border:1px solid #0a5;color:#00ff9c;padding:10px;margin:6px 0;border-radius:5px;font-family:inherit}
.cyt-in:focus{outline:none;border-color:#00ffe1;box-shadow:0 0 10px #00ffe166}
.cyt-err{color:#f66;font-size:12px;min-height:14px}.cyt-ok{color:#0f6;font-size:13px}
.cyt-tabs{display:flex;gap:6px;margin-bottom:10px}.cyt-tab{flex:1;text-align:center;padding:7px;border:1px solid #084;border-radius:5px;cursor:pointer;color:#0a8}
.cyt-tab.on{background:#032;color:#00ffe1;box-shadow:0 0 10px #00ff9c55}
.cyt-card{border:1px solid #0a4;border-radius:8px;padding:12px;margin:8px 0;background:#071510;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;transition:all .2s}
.cyt-card:hover{border-color:#00ffe1;box-shadow:0 0 14px #00ff9c33;transform:translateX(3px)}
.cyt-badge{background:#013;border:1px solid #0f6;color:#0fc;border-radius:20px;padding:2px 12px;font-size:11px}
.cyt-step{border-left:3px solid #0f6;padding:6px 12px;margin:6px 0;background:#07151080}
.cyt-step b{color:#00ffe1}
.cyt-link{color:#00ffe1;cursor:pointer;text-decoration:underline}
#cyt-apppop{position:fixed;right:16px;bottom:70px;z-index:9998;width:min(340px,90vw)}
.cyt-toast{position:fixed;top:14px;left:50%;transform:translateX(-50%);background:#021a12;border:1px solid #00ff9c;color:#00ffe1;padding:10px 22px;border-radius:30px;z-index:10001;box-shadow:0 0 20px #00ff9c66;animation:cytpulse 1.5s infinite}
/* Reserve a separate monitor lane; icons remain scrollable on every viewport. */
#icons{right:328px!important;overflow-y:auto;overflow-x:hidden;padding-bottom:10px;grid-auto-rows:104px}
#desktop.cyt-monitor-hidden #icons{right:14px!important}
.icon{opacity:1!important;filter:none!important;isolation:isolate}
.icon .ic-img{flex-shrink:0;opacity:1!important;filter:brightness(1.25) saturate(1.2) drop-shadow(0 0 6px #00ff9c)!important;background:linear-gradient(135deg,#073728cc,#042b25cc);box-shadow:0 0 14px #00ff9c66,inset 0 0 10px #00ff9c33}
.icon .ic-label{color:#d6ffe7!important;opacity:1;text-shadow:0 0 6px #001a0d,1px 1px #000}
#sysmon-close{float:right;background:#300;border:1px solid #f55;border-radius:4px;color:#f88;cursor:pointer;padding:2px 7px;position:sticky;top:0;z-index:1}
#topbar .left{min-width:0}
#taskbar-windows{min-width:0}
#tray,#start-btn{flex-shrink:0}
#tray{white-space:nowrap}
.cyt-modal:focus{outline:none}
@media(max-width:820px){
 #icons{position:absolute!important;top:46px!important;left:8px!important;right:8px!important;bottom:62px!important;display:grid!important;grid-template-columns:repeat(auto-fit,minmax(64px,1fr))!important;grid-auto-rows:100px!important;gap:8px!important;padding:6px!important;align-content:start}
 .icon{width:100%!important;height:100px!important;box-sizing:border-box}
 .window,.win{max-width:96vw!important;max-height:80vh!important}
 #sysmon{display:none!important}
 #topbar{height:38px;padding:0 6px;font-size:11px}
 #topbar .left{gap:4px;width:100%;justify-content:space-between}
 #topbar .right{display:none}
 #topbar .brand{font-size:11px;letter-spacing:1px;white-space:nowrap}
 #topbar .menu{padding:2px 3px}
 body{font-size:14px}
 #cyt-apppop{right:8px;bottom:64px}
}
@media(prefers-reduced-motion:reduce){#scanline,.cyt-btn,.cyt-toast{animation:none!important}*{scroll-behavior:auto!important}}`;
  const st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);
  /* ---------- helpers ---------- */
  function toast(m) {
    const t = document.createElement("div");
    t.className = "cyt-toast";
    t.textContent = m;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }
  async function api(p, method, body) {
    const controller = new AbortController(),
      timer = setTimeout(() => controller.abort(), 45000);
    try {
      const r = await fetch(API + p, {
        method: method || "GET",
        headers: {
          ...(body ? { "Content-Type": "application/json" } : {}),
          ...(S.tok ? { Authorization: "Bearer " + S.tok } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        cache: "no-store",
      });
      const data = await r
        .json()
        .catch(() => ({ error: "The server returned an invalid response." }));
      if (r.status === 401 && !p.includes("/auth/")) {
        S.tok = "";
        S.user = null;
        S.ent = [];
      }
      if (!r.ok && !data.error)
        data.error = "Request failed (" + r.status + "). Please retry.";
      return data;
    } catch (e) {
      return {
        error:
          e.name === "AbortError"
            ? "The server is taking too long. It may be waking up; please retry."
            : "Cannot reach CyTech API. Check your connection and retry.",
      };
    } finally {
      clearTimeout(timer);
    }
  }
  function esc(v) {
    return String(v == null ? "" : v).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }
  function dragify(el, handle) {
    let x,
      y,
      dx,
      dy,
      on = false;
    handle = handle || el;
    handle.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button,input,a")) return;
      on = true;
      x = e.clientX;
      y = e.clientY;
      const r = el.getBoundingClientRect();
      dx = r.left;
      dy = r.top;
      el.style.position = "fixed";
      el.style.left = dx + "px";
      el.style.top = dy + "px";
      el.style.right = "auto";
      el.style.bottom = "auto";
      el.style.margin = "0";
      e.preventDefault();
    });
    addEventListener("pointermove", (e) => {
      if (!on) return;
      el.style.left = dx + e.clientX - x + "px";
      el.style.top = dy + e.clientY - y + "px";
    });
    addEventListener("pointerup", () => (on = false));
  }
  function modal(title, html, drag) {
    const o = document.createElement("div");
    o.className = "cyt-overlay";
    o.innerHTML =
      '<div class="cyt-modal"><div class="cyt-mhead"><b>' +
      title +
      '</b><button class="cyt-x">X</button></div><div class="cyt-mbody">' +
      html +
      "</div></div>";
    document.body.appendChild(o);
    o.querySelector(".cyt-x").onclick = () => o.remove();
    o.addEventListener("click", (e) => {
      if (e.target === o) o.remove();
    });
    o.querySelector(".cyt-modal").setAttribute("role", "dialog");
    o.querySelector(".cyt-modal").setAttribute("aria-modal", "true");
    o.querySelector(".cyt-modal").setAttribute("aria-label", title);
    o.querySelector(".cyt-x").setAttribute("aria-label", "Close");
    if (drag)
      dragify(o.querySelector(".cyt-modal"), o.querySelector(".cyt-mhead"));
    return o;
  }
  /* ---------- auth ---------- */
  function authModal() {
    if (document.getElementById("cyt-auth-modal")) return;
    const o = modal(
      "CYTECH LOGIN",
      '<div class="cyt-tabs"><button type="button" class="cyt-tab on" data-t="login">LOGIN</button><button type="button" class="cyt-tab" data-t="signup">SIGN UP</button><button type="button" class="cyt-tab" data-t="forgot">FORGOT</button></div><div id="cyt-abody"></div><div class="cyt-err" id="cyt-aerr" role="alert"></div>',
    );
    o.id = "cyt-auth-modal";
    const body = o.querySelector("#cyt-abody"),
      err = o.querySelector("#cyt-aerr");
    function render(t) {
      o.querySelectorAll(".cyt-tab").forEach((x) =>
        x.classList.toggle("on", x.dataset.t === t),
      );
      err.textContent = "";
      body.innerHTML =
        '<form id="cyt-auth-form">' +
        (t === "signup"
          ? '<label>Full name<input class="cyt-in" name="name" required maxlength="60" autocomplete="name"></label>'
          : "") +
        '<label>Email<input class="cyt-in" name="email" type="email" required maxlength="254" autocomplete="email"></label>' +
        (t !== "forgot"
          ? '<label>Password<input class="cyt-in" name="password" type="password" required minlength="6" maxlength="128" autocomplete="' +
            (t === "signup" ? "new-password" : "current-password") +
            '"></label>'
          : "") +
        '<button class="cyt-btn" type="submit" style="width:100%">' +
        (t === "signup"
          ? "CREATE ACCOUNT"
          : t === "forgot"
            ? "REQUEST RESET"
            : "ENTER SYSTEM") +
        "</button></form>";
      const form = body.querySelector("form");
      form.onsubmit = async (e) => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        const btn = form.querySelector("button");
        btn.disabled = true;
        err.textContent = "Connecting…";
        const payload = Object.fromEntries(new FormData(form));
        if (payload.email) payload.email = payload.email.trim();
        const r = await api("/api/auth/" + t, "POST", payload);
        btn.disabled = false;
        if (r.token && r.user) {
          S.tok = r.token;
          S.user = r.user;
          S.ent = [];
          const me = await refreshEnt();
          o.remove();
          toast("Welcome, " + r.user.name);
          if (me.error) toast(me.error);
        } else err.textContent = r.error || r.message || "Please retry.";
      };
      body.querySelector("input").focus();
    }
    o.querySelectorAll(".cyt-tab").forEach(
      (x) => (x.onclick = () => render(x.dataset.t)),
    );
    render("login");
  }
  function requireAuth() {
    if (S.tok) return true;
    authModal();
    return false;
  }
  async function refreshEnt() {
    const r = await api("/api/me");
    if (r.entitlements) {
      S.ent = r.entitlements;
      S.user = r.user;
    }
    return r;
  }
  /* ---------- payments ---------- */
  async function pay(purpose, onOk, noteId) {
    if (!requireAuth()) return;
    const amount = { notes: 30, practicals: 100, course: 2000 }[purpose];
    const o = modal(
      "SECURE CHECKOUT — KES " + amount,
      "<p>" +
        (purpose === "notes"
          ? "KES 30 unlocks only the selected PDF."
          : "Confirm this purchase before continuing.") +
        '</p><form id="pp-form"><label>M-PESA phone number<input class="cyt-in" id="pp-phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="07xxxxxxxx or 01xxxxxxxx" required></label><button type="submit" class="cyt-btn">SEND M-PESA REQUEST — KES ' +
        amount +
        '</button></form><button class="cyt-btn" id="pp-card" style="margin-top:10px">USE SECURE CARD / M-PESA CHECKOUT</button><p id="pp-st" role="status"></p><div class="cyt-err" id="pp-err" role="alert"></div><div id="pp-actions"></div>',
    );
    let timer = null,
      reference = "",
      checking = false,
      done = false;
    const observer = new MutationObserver(() => {
      if (!o.isConnected) {
        clearTimeout(timer);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true });
    async function check() {
      if (checking || done || !o.isConnected) return;
      checking = true;
      const v = await api("/api/pay/verify/" + encodeURIComponent(reference));
      checking = false;
      if (v.status === "success") {
        done = true;
        clearTimeout(timer);
        localStorage.removeItem("cyt_pending_payment");
        await refreshEnt();
        o.remove();
        toast("Payment confirmed");
        if (onOk) onOk();
      } else if (v.status === "failed") {
        done = true;
        clearTimeout(timer);
        localStorage.removeItem("cyt_pending_payment");
        o.querySelector("#pp-err").textContent =
          "Payment failed or was cancelled. No access was granted. Close checkout to retry.";
      } else
        o.querySelector("#pp-err").textContent =
          v.error ||
          "Payment is still pending. Approve on your phone, then verify.";
    }
    function watch() {
      const until = Date.now() + 240000;
      async function tick() {
        if (done || !o.isConnected) return;
        await check();
        if (!done && Date.now() < until) timer = setTimeout(tick, 8000);
        else if (!done && o.isConnected)
          o.querySelector("#pp-st").textContent =
            "Automatic checks paused. Use CHECK PAYMENT; do not pay again until verified.";
      }
      timer = setTimeout(tick, 8000);
    }
    async function begin(method) {
      const buttons = o.querySelectorAll("#pp-form button,#pp-card");
      buttons.forEach((b) => (b.disabled = true));
      o.querySelector("#pp-err").textContent = "";
      o.querySelector("#pp-st").textContent = "Contacting payment gateway…";
      const r = await api("/api/pay/init", "POST", {
        purpose,
        noteId,
        method,
        phone: o.querySelector("#pp-phone").value,
      });
      if (r.error && !r.reference) {
        o.querySelector("#pp-err").textContent = r.error;
        o.querySelector("#pp-st").textContent = "No access granted.";
        buttons.forEach((b) => (b.disabled = false));
        return;
      }
      reference = r.reference;
      localStorage.cyt_pending_payment = JSON.stringify({
        reference,
        purpose,
        noteId,
      });
      o.querySelector("#pp-err").textContent = r.error || "";
      o.querySelector("#pp-st").textContent =
        r.message || "Payment pending. Verify before retrying.";
      o.querySelector("#pp-actions").innerHTML =
        '<button class="cyt-btn" id="pp-check">CHECK PAYMENT</button>' +
        (r.authorization_url
          ? '<p><a class="cyt-link" id="pp-checkout" target="_blank" rel="noopener noreferrer">OPEN SECURE CHECKOUT</a></p>'
          : "");
      const link = o.querySelector("#pp-checkout");
      if (link) link.href = r.authorization_url;
      o.querySelector("#pp-check").onclick = check;
      if (r.status === "success") await check();
      else watch();
    }
    o.querySelector("#pp-form").onsubmit = (e) => {
      e.preventDefault();
      begin("mpesa");
    };
    o.querySelector("#pp-card").onclick = () => begin("checkout");
  }
  async function downloadNote(id, button) {
    button.disabled = true;
    const ctrl = new AbortController(),
      timer = setTimeout(() => ctrl.abort(), 45000);
    try {
      const r = await fetch(
        API + "/api/notes/" + encodeURIComponent(id) + "/download",
        {
          headers: { Authorization: "Bearer " + S.tok },
          signal: ctrl.signal,
          cache: "no-store",
        },
      );
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.error || "Download failed");
      }
      if (!(r.headers.get("content-type") || "").includes("pdf"))
        throw new Error("Invalid PDF response");
      const blob = await r.blob(),
        url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = id + ".pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      toast(
        e.name === "AbortError"
          ? "Download timed out; please retry."
          : e.message,
      );
    } finally {
      clearTimeout(timer);
      button.disabled = false;
    }
  }
  async function openNotes() {
    if (!requireAuth()) return;
    const me = await refreshEnt();
    if (me.error) {
      toast(me.error);
      return;
    }
    const rows = NOTES.map(
      (n) =>
        '<div class="cyt-card"><div><b style="color:#00ffe1">' +
        n.t +
        "</b><br><small>" +
        n.d +
        "</small></div>" +
        (S.ent.includes("notes:" + n.id)
          ? '<button class="cyt-btn" data-dl="' +
            n.id +
            '">DOWNLOAD PDF</button>'
          : '<button class="cyt-btn" data-buy="' +
            n.id +
            '">UNLOCK THIS PDF — KES 30</button>') +
        "</div>",
    ).join("");
    const o = modal(
      "CYTECH NOTES VAULT",
      "<p><b>KES 30 = one selected PDF.</b> Each PDF is purchased separately. Purchased PDFs can be downloaded again from this account.</p>" +
        rows,
      true,
    );
    o.querySelectorAll("[data-buy]").forEach(
      (b) =>
        (b.onclick = () =>
          pay(
            "notes",
            () => {
              o.remove();
              openNotes();
            },
            b.dataset.buy,
          )),
    );
    o.querySelectorAll("[data-dl]").forEach(
      (b) => (b.onclick = () => downloadNote(b.dataset.dl, b)),
    );
  }
  async function openPracticals() {
    if (!requireAuth()) return;
    const live = await refreshEnt();
    if (live.error) {
      toast(live.error);
      return;
    }
    const owned = S.ent.includes("practicals");
    if (!owned) {
      const o = modal(
        "CYBER PRACTICALS — LOCKED",
        '<p>Get hands-on: attack a live, legal practice target with guided step-by-step labs.</p><p>One-time <b style="color:#ff0">KES 100</b>.</p><button class="cyt-btn" style="width:100%" id="pr-pay">UNLOCK PRACTICALS — KES 100</button>',
        true,
      );
      o.querySelector("#pr-pay").onclick = () =>
        pay("practicals", () => {
          o.remove();
          openPracticals();
        });
      return;
    }
    api("/api/me").then((me) => {
      if (me.error) {
        toast(me.error);
        return;
      }
      const target = me.practicalUrl;
      if (!target) {
        toast("Lab access not available");
        return;
      }
      const url = esc(target);
      modal(
        "CYBER PRACTICALS LAB",
        '<p>Target (authorized practice site): <a class="cyt-link" href="' +
          url +
          '" target="_blank">' +
          url +
          "</a></p>" +
          '<div class="cyt-step"><b>Step 1 — Recon:</b> visit the target, note technologies. Run <code>nmap -sV ' +
          url.replace(/^https?:\/\//, "") +
          "</code> (use the online Kali tools panel or your own VM).</div>" +
          '<div class="cyt-step"><b>Step 2 — Map:</b> browse every page, list input fields and URL parameters like <code>?id=1</code>.</div>' +
          "<div class=\"cyt-step\"><b>Step 3 — SQLi test:</b> append <code>'</code> to a parameter and watch for SQL errors; try <code>' OR '1'='1</code> in the login form.</div>" +
          '<div class="cyt-step"><b>Step 4 — XSS test:</b> submit <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> in the search box.</div>' +
          '<div class="cyt-step"><b>Step 5 — Scan:</b> run <code>nikto -h ' +
          url +
          "</code> or OWASP ZAP/Burp passive scan; record findings.</div>" +
          '<div class="cyt-step"><b>Step 6 — Report:</b> write severity, impact and remediation for each finding — that is what a real pentest delivers.</div>' +
          '<p style="color:#fa0">Only attack targets you are authorized to test. This lab target is intentionally vulnerable and legal to practice on.</p>',
        true,
      );
    });
  }
  async function openCourse() {
    if (!requireAuth()) return;
    const live = await refreshEnt();
    if (live.error) {
      toast(live.error);
      return;
    }
    const owned = S.ent.includes("course");
    if (!owned) {
      const o = modal(
        "APPLY — CYBERSECURITY COURSE",
        '<p>Full CyTech bootcamp: ethical hacking, reverse engineering, forensics &amp; career mentorship.</p><p>Application fee: <b style="color:#ff0">KES 2,000</b></p><button class="cyt-btn" style="width:100%" id="co-pay">PAY & APPLY — KES 2,000</button>',
        true,
      );
      o.querySelector("#co-pay").onclick = () =>
        pay("course", () => {
          o.remove();
          openCourse();
        });
      return;
    }
    api("/api/me").then(async (me) => {
      if (me.error) {
        toast(me.error);
        return;
      }
      const messages = await api("/api/messages");
      const a = (me && me.application) || {};
      const note = (me && me.adminNote) || "";
      modal(
        "MY STUDENT PORTAL",
        '<div class="cyt-card"><div><b style="color:#0f0">&#10003; REGISTERED</b><br>Applicant: ' +
          esc(S.user ? S.user.email : "") +
          "<br>Status: " +
          esc(a.status || "registered") +
          "<br>Since: " +
          (a.createdAt ? new Date(a.createdAt).toLocaleString() : "") +
          '</div><span class="cyt-badge">STUDENT</span></div>' +
          (note
            ? '<div class="cyt-step"><b>Message from CyTech (venue & class times):</b><br>' +
              note.replace(/</g, "&lt;").replace(/\n/g, "<br>") +
              "</div>"
            : "<p>No announcements yet — check back soon.</p>") +
          (Array.isArray(messages)
            ? messages
                .map(
                  (m) =>
                    '<div class="cyt-step"><b>Announcement</b><br>' +
                    esc(m.message) +
                    "</div>",
                )
                .join("")
            : "") +
          '<button class="cyt-btn" onclick="window.print()">PRINT ADMISSION SLIP</button>',
        true,
      );
    });
  }
  function openTools() {
    modal(
      "LINUX / CYBERSECURITY TOOLKIT",
      [
        ["Kali Linux", "Full pentest distro", "https://www.kali.org/get-kali/"],
        ["Nmap", "Network scanner", "https://nmap.org/download.html"],
        [
          "Wireshark",
          "Packet analyzer",
          "https://www.wireshark.org/download.html",
        ],
        [
          "Burp Suite CE",
          "Web proxy/scanner",
          "https://portswigger.net/burp/communitydownload",
        ],
        [
          "Metasploit",
          "Exploitation framework",
          "https://docs.metasploit.com/docs/using-metasploit/getting-started/nightly-installers.html",
        ],
        ["Ghidra", "Reverse engineering (NSA)", "https://ghidra-sre.org/"],
        [
          "John the Ripper",
          "Password cracker",
          "https://www.openwall.com/john/",
        ],
        ["Hashcat", "GPU hash cracking", "https://hashcat.net/hashcat/"],
        ["OWASP ZAP", "Web app scanner", "https://www.zaproxy.org/download/"],
        [
          "Hydra",
          "Login brute-forcer",
          "https://github.com/vanhauser-thc/thc-hydra",
        ],
        [
          "Aircrack-ng",
          "Wi-Fi auditing",
          "https://www.aircrack-ng.org/downloads.html",
        ],
        ["Autopsy", "Disk forensics", "https://www.autopsy.com/download/"],
        [
          "VirtualBox",
          "Run lab VMs",
          "https://www.virtualbox.org/wiki/Downloads",
        ],
        ["Proton VPN", "Free VPN tier", "https://protonvpn.com/download"],
        [
          "Tor Browser",
          "Anonymous browsing",
          "https://www.torproject.org/download/",
        ],
      ]
        .map(
          (t) =>
            '<div class="cyt-card"><div><b style="color:#00ffe1">' +
            t[0] +
            "</b><br><small>" +
            t[1] +
            '</small></div><button class="cyt-btn" onclick="window.open(\'' +
            t[2] +
            "','_blank')\">GET TOOL</button></div>",
        )
        .join(""),
      true,
    );
  }
  /* ---------- desktop icons ---------- */
  function addIcon(label, glyph, fn) {
    const c = document.getElementById("icons");
    if (!c) return;
    const d = document.createElement("div");
    d.className = "icon";
    d.dataset.cyt = label;
    d.tabIndex = 0;
    d.setAttribute("role", "button");
    d.setAttribute("aria-label", label);
    d.innerHTML =
      '<div class="ic-img">' +
      glyph +
      '</div><div class="ic-label">' +
      label +
      "</div>";
    const run = () => {
      if (requireAuth()) fn();
    };
    d.onclick = run;
    d.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        run();
      }
    };
    c.appendChild(d);
  }
  /* Installable web app, not falsely labelled as a native binary. */
  let installPrompt = null;
  addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installPrompt = e;
  });
  addEventListener("appinstalled", () => {
    localStorage.cyt_app_done = "1";
    document.getElementById("cyt-apppop")?.remove();
  });
  if (
    "serviceWorker" in navigator &&
    (location.protocol === "https:" ||
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1")
  )
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  async function showInstall(platform) {
    const config = await api("/api/downloads");
    const native = config.native && config.native[platform];
    if (native) {
      const o = modal(
        "CYTECH APP",
        '<p>A published native build is available.</p><a class="cyt-btn" id="cyt-native" target="_blank" rel="noopener noreferrer">OPEN OFFICIAL DOWNLOAD</a>',
      );
      o.querySelector("#cyt-native").href = native;
      return;
    }
    const instructions = {
      ios: "On iPhone or iPad: open CyTech in Safari, tap Share, then Add to Home Screen, then Add.",
      android:
        "On Android: open CyTech in Chrome, use Install below if available, or browser menu → Add to Home screen / Install app.",
      windows:
        "On PC: open CyTech in Chrome or Edge, use the install icon in the address bar or browser menu → Install CyTech.",
      mac: "On Mac: use Chrome / Edge install, or Safari → File → Add to Dock if supported.",
    };
    const o = modal(
      "INSTALL CYTECH — " + platform.toUpperCase(),
      "<p>" +
        instructions[platform] +
        "</p><p>This is the installable web app. No APK, EXE, DMG or App Store build was included in this project. Account and payments require internet.</p>" +
        (installPrompt
          ? '<button class="cyt-btn" id="cyt-install">INSTALL CYTECH</button>'
          : ""),
    );
    const btn = o.querySelector("#cyt-install");
    if (btn)
      btn.onclick = async () => {
        const prompt = installPrompt;
        if (!prompt) return;
        btn.disabled = true;
        await prompt.prompt();
        const choice = await prompt.userChoice;
        installPrompt = null;
        if (choice.outcome === "accepted") {
          o.remove();
          document.getElementById("cyt-apppop")?.remove();
          toast("Install accepted by your browser");
        } else btn.disabled = false;
      };
  }
  let appPopupSeen = false;
  function appPopup(force = false) {
    if (!force && (appPopupSeen || document.querySelector(".cyt-overlay")))
      return;
    if (
      !force &&
      (localStorage.cyt_app_done ||
        matchMedia("(display-mode: standalone)").matches ||
        navigator.standalone)
    )
      return;
    if (document.getElementById("cyt-apppop")) return;
    appPopupSeen = true;
    const o = document.createElement("div");
    o.id = "cyt-apppop";
    o.innerHTML =
      '<div class="cyt-modal"><div class="cyt-mhead"><b>GET THE CYTECH APP</b><button class="cyt-x" aria-label="Close app installation panel">X</button></div><div class="cyt-mbody"><p>Install CyTech on your device:</p><button class="cyt-btn" style="width:100%;margin:4px 0" data-p="windows">PC / WINDOWS</button><button class="cyt-btn" style="width:100%;margin:4px 0" data-p="android">ANDROID</button><button class="cyt-btn" style="width:100%;margin:4px 0" data-p="mac">MAC</button><button class="cyt-btn" style="width:100%;margin:4px 0" data-p="ios">iPHONE / iPAD</button><small>Web app installation. Native downloads appear only when a real build URL is configured.</small></div></div>';
    document.body.appendChild(o);
    dragify(o.querySelector(".cyt-modal"), o.querySelector(".cyt-mhead"));
    o.querySelector(".cyt-x").onclick = () => o.remove();
    o.querySelectorAll("[data-p]").forEach(
      (b) => (b.onclick = () => showInstall(b.dataset.p)),
    );
  }
  /* ---------- gate original apps behind signup & make buttons clickable ---------- */
  if (typeof window.openApp === "function") {
    const orig = window.openApp;
    window.openApp = function (id) {
      if (!S.tok && !FREE_APPS.includes(String(id).toLowerCase())) {
        authModal();
        return;
      }
      return orig.apply(this, arguments);
    };
  }
  /* Keep original app/taskbar button classes intact; avoid click-time layout shifts. */
  /* ---------- boot ---------- */
  function init() {
    addIcon("Notes Vault", "&#x1F4DA;", openNotes);
    addIcon("Practicals", "&#x1F3AF;", openPracticals);
    addIcon("Apply Course", "&#x1F393;", openCourse);
    addIcon("Sec Tools", "&#x1F6E0;", openTools);
    const monitor = document.getElementById("sysmon");
    if (monitor) {
      const close = document.createElement("button");
      close.id = "sysmon-close";
      close.textContent = "X";
      close.setAttribute("aria-label", "Close system monitor");
      close.onclick = () => {
        monitor.style.display = "none";
        document.getElementById("desktop").classList.add("cyt-monitor-hidden");
      };
      monitor.prepend(close);
    }
    addIcon("Install App", "&#x1F4F2;", () => appPopup(true));
    setTimeout(() => appPopup(), 4000);
    if (S.tok) refreshEnt();
    addIcon("Account", "&#x1F464;", () => {
      if (S.tok) {
        const u = S.user || {};
        const o = modal(
          "MY ACCOUNT",
          "<p>" +
            esc(u.name || "") +
            "<br>" +
            esc(u.email || "") +
            "</p><p>Entitlements: " +
            esc(S.ent.join(", ") || "none") +
            '</p><button class="cyt-btn" id="cyt-check-pending">CHECK LAST PAYMENT</button><p id="cyt-pending-status" role="status"></p><button class="cyt-btn" id="lo">LOGOUT</button>',
          true,
        );
        o.querySelector("#cyt-check-pending").onclick = async () => {
          let pending;
          try {
            pending = JSON.parse(localStorage.cyt_pending_payment || "null");
          } catch {}
          if (!pending) {
            o.querySelector("#cyt-pending-status").textContent =
              "No pending payment on this device.";
            return;
          }
          const v = await api(
            "/api/pay/verify/" + encodeURIComponent(pending.reference),
          );
          o.querySelector("#cyt-pending-status").textContent =
            v.error || "Payment: " + v.status;
          if (v.status === "success") {
            localStorage.removeItem("cyt_pending_payment");
            await refreshEnt();
          }
        };
        o.querySelector("#lo").onclick = () => {
          S.tok = "";
          S.user = null;
          S.ent = [];
          localStorage.removeItem("cyt_pending_payment");
          o.remove();
          toast("Logged out");
        };
      } else authModal();
    });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 1500));
  else setTimeout(init, 1500);
})();
