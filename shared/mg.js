/* =========================================================================
   mini-games shared UI layer
   -------------------------------------------------------------------------
   Provides:
     MG.lang                 -> "zh" | "en"  (persisted in localStorage)
     MG.t(zh, en)            -> current-language string
     MG.setLang("zh"|"en")
     MG.onChange(fn)         -> fires after every language switch
     MG.help({zh:{...}, en:{...}})
     MG.openHelp() / MG.closeHelp()
     MG.init({id, dock, mount, autoHelp, help})

   Static markup translation: put data-t-zh / data-t-en on any element whose
   whole text should switch (leaf elements only). data-ph-zh / data-ph-en for
   placeholders, data-title-zh / data-title-en for title attributes.
   ========================================================================= */

(function () {
  "use strict";
  if (window.MG) return;

  var LANG_KEY = "mg.lang";
  var SEEN_KEY = "mg.seen.";

  var lang = "zh";
  try {
    var saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "zh") lang = saved;
  } catch (e) {}

  var opts = {
    id: "",
    dock: true,
    mount: null,
    autoHelp: true,
    help: null
  };
  var listeners = [];
  var modal = null;
  var lastFocus = null;
  var built = false;

  /* ------------------------------------------------------------- helpers -- */

  function each(selector, fn) {
    var list = document.querySelectorAll(selector);
    for (var i = 0; i < list.length; i++) fn(list[i]);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function t(zh, en) {
    return lang === "en" ? (en == null ? zh : en) : zh;
  }

  function readSeen(id) {
    try {
      return localStorage.getItem(SEEN_KEY + id) === "1";
    } catch (e) {
      return false;
    }
  }

  function markSeen(id) {
    try {
      localStorage.setItem(SEEN_KEY + id, "1");
    } catch (e) {}
  }

  /* -------------------------------------------------------- static text -- */

  function applyStatic(root) {
    var scope = root || document;
    var pick = function (node, attr) {
      var v = lang === "en" ? node.getAttribute("data-" + attr + "-en") : node.getAttribute("data-" + attr + "-zh");
      return v == null ? null : v;
    };

    var nodes = scope.querySelectorAll("[data-t-zh]");
    for (var i = 0; i < nodes.length; i++) {
      var v = pick(nodes[i], "t");
      if (v != null) nodes[i].textContent = v;
    }

    nodes = scope.querySelectorAll("[data-ph-zh]");
    for (var j = 0; j < nodes.length; j++) {
      var pv = pick(nodes[j], "ph");
      if (pv != null) nodes[j].setAttribute("placeholder", pv);
    }

    nodes = scope.querySelectorAll("[data-title-zh]");
    for (var k = 0; k < nodes.length; k++) {
      var tv = pick(nodes[k], "title");
      if (tv != null) nodes[k].setAttribute("title", tv);
    }

    if (scope === document) {
      document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    }
  }

  /* ------------------------------------------------------------- toggle -- */

  function langGroup(inline) {
    var group = el("div", "mg-lang" + (inline ? " mg-lang-inline" : ""));
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", "Language / 语言");

    [["zh", "中文"], ["en", "EN"]].forEach(function (pair) {
      var btn = el("button", null, pair[1]);
      btn.type = "button";
      btn.setAttribute("data-l", pair[0]);
      btn.setAttribute("aria-pressed", String(lang === pair[0]));
      btn.addEventListener("click", function () {
        setLang(pair[0]);
      });
      group.appendChild(btn);
    });

    return group;
  }

  function syncToggles() {
    each(".mg-lang button[data-l]", function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-l") === lang));
    });
  }

  function buildDock() {
    if (built) return;
    built = true;

    if (opts.mount) {
      var slot = document.querySelector(opts.mount);
      if (slot) {
        slot.appendChild(langGroup(true));
        return;
      }
    }

    if (!opts.dock) return;

    var dock = el("div", "mg-dock");
    dock.id = "mgDock";
    dock.appendChild(langGroup(false));

    if (opts.help) {
      var helpBtn = el("button", "mg-help-btn", "?");
      helpBtn.type = "button";
      helpBtn.setAttribute("aria-label", t("操作说明", "How to play"));
      helpBtn.title = t("操作说明", "How to play");
      helpBtn.addEventListener("click", openHelp);
      dock.appendChild(helpBtn);
    }

    document.body.appendChild(dock);
  }

  /* --------------------------------------------------------------- help -- */

  function ensureModal() {
    if (modal) return modal;

    modal = el("div", "mg-modal");
    modal.hidden = true;
    modal.appendChild(el("div", "mg-card"));
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeHelp();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeHelp();
    });

    document.body.appendChild(modal);
    return modal;
  }

  function renderHelp() {
    if (!opts.help) return;
    var card = ensureModal().firstChild;
    var data = opts.help[lang] || opts.help.zh;
    card.textContent = "";

    /* Body scrolls, footer stays put so the close button is always reachable. */
    var box = el("div", "mg-body");
    card.appendChild(box);

    box.appendChild(el("div", "mg-eyebrow", t("怎么玩 / HOW TO PLAY", "HOW TO PLAY / 怎么玩")));
    box.appendChild(el("h2", "mg-title", data.title || ""));
    if (data.lead) box.appendChild(el("p", "mg-lead", data.lead));

    if (data.keys && data.keys.length) {
      box.appendChild(el("h3", "mg-h3", data.keysTitle || t("操作", "CONTROLS")));
      var dl = el("dl", "mg-keys");
      data.keys.forEach(function (pair) {
        var dt = el("dt");
        var kbd = el("span", "mg-kbd", pair[0]);
        dt.appendChild(kbd);
        dl.appendChild(dt);
        dl.appendChild(el("dd", null, pair[1]));
      });
      box.appendChild(dl);
    }

    if (data.sections && data.sections.length) {
      box.appendChild(el("h3", "mg-h3", data.sectionsTitle || t("规则与目标", "RULES & GOAL")));
      data.sections.forEach(function (sec) {
        if (sec.h) box.appendChild(el("div", "mg-p", sec.h));
        if (sec.p) box.appendChild(el("p", "mg-p", sec.p));
      });
    }

    if (data.tips && data.tips.length) {
      box.appendChild(el("h3", "mg-h3", data.tipsTitle || t("要点", "TIPS")));
      var ul = el("ul", "mg-tips");
      data.tips.forEach(function (tip) {
        ul.appendChild(el("li", null, tip));
      });
      box.appendChild(ul);
    }

    var foot = el("div", "mg-foot");
    var back = el("a", "mg-back", t("← 返回小游戏", "← Back to mini games"));
    back.href = "../index.html";
    foot.appendChild(back);

    var go = el("button", "mg-go", t("开始玩", "Got it"));
    go.type = "button";
    go.addEventListener("click", closeHelp);
    foot.appendChild(go);
    card.appendChild(foot);

    box.scrollTop = 0;
  }

  function openHelp() {
    if (!opts.help) return;
    renderHelp();
    ensureModal().hidden = false;
    lastFocus = document.activeElement;
    var go = modal.querySelector(".mg-go");
    /* keep the card scrolled to the top: focusing a button would scroll it */
    if (go) go.focus({ preventScroll: true });
  }

  function closeHelp() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    if (opts.id) markSeen(opts.id);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------------------------------------------------------- public API -- */

  function setLang(next) {
    if (next !== "zh" && next !== "en") return;
    if (next === lang) return;
    lang = next;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {}
    applyStatic(document);
    syncToggles();
    if (opts.help) renderHelp();
    listeners.forEach(function (fn) {
      try {
        fn(lang);
      } catch (e) {
        if (window.console) console.error(e);
      }
    });
  }

  function onChange(fn) {
    if (typeof fn === "function") listeners.push(fn);
  }

  function init(config) {
    config = config || {};
    if (config.id) opts.id = config.id;
    if (config.dock != null) opts.dock = !!config.dock;
    if (config.mount) opts.mount = config.mount;
    if (config.autoHelp != null) opts.autoHelp = !!config.autoHelp;
    if (config.help) opts.help = config.help;
    boot();
  }

  function boot() {
    applyStatic(document);
    buildDock();

    if (opts.help && opts.autoHelp && opts.id && !readSeen(opts.id)) {
      openHelp();
      /* only auto-open once per session even if the flag cannot persist */
      markSeen(opts.id);
    }
  }

  window.MG = {
    get lang() {
      return lang;
    },
    t: t,
    setLang: setLang,
    onChange: onChange,
    init: init,
    help: function (config) {
      opts.help = config;
    },
    openHelp: openHelp,
    closeHelp: closeHelp,
    open: openHelp
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
