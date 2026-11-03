/* Analytics + consent. GA4 Measurement ID below. No cookies are set until the visitor clicks "accept". */
(function () {
  "use strict";
  var GA_ID = "G-XQ845ZPQ9B";        
  var KEY = "pt_consent";
  var LANG = document.documentElement.getAttribute("data-page-lang") || "sr";

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function gaReady() { return GA_ID && GA_ID.indexOf("XXXX") === -1; }

  // The Google tag itself is in <head> (Consent Mode, storage denied by default).
  // Accepting only switches analytics storage on; events are sent only after acceptance.
  var granted = false;
  function loadGA() {
    if (!gaReady() || !window.gtag) return;
    granted = true;
    window.gtag("consent", "update", { analytics_storage: "granted" });
  }

  // Events are only sent after the visitor has accepted.
  function track(name, params) {
    params = params || {}; params.page_language = LANG;
    if (granted && window.gtag) window.gtag("event", name, params);
  }

  // Consent banner
  var box = document.getElementById("consent");
  var choice = read();
  if (choice === "yes") loadGA();
  else if (choice === null && box) box.hidden = false;
  var yes = document.getElementById("consent-yes"), no = document.getElementById("consent-no");
  if (yes) yes.addEventListener("click", function () { write("yes"); if (box) box.hidden = true; loadGA(); });
  if (no) no.addEventListener("click", function () { write("no"); if (box) box.hidden = true; });

  // Click events: file download (with button location) and language switch
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest ? ev.target.closest("[data-track]") : null;
    if (!a) return;
    var type = a.getAttribute("data-track");
    if (type === "file_download") {
      track("file_download", { file_name: "pausal_evidencija.xlsx", link_location: a.getAttribute("data-location") || "" });
    } else if (type === "language_switch") {
      track("language_switch", { to_language: a.getAttribute("data-to") || "" });
    }
  });

  // Section views (scroll depth by content block), once per section
  if ("IntersectionObserver" in window) {
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.getAttribute("data-section");
        if (id && !seen[id]) { seen[id] = true; track("view_section", { section: id }); }
      });
    }, { threshold: 0.4 });
    Array.prototype.forEach.call(document.querySelectorAll("[data-section]"), function (n) { io.observe(n); });
  }
})();
