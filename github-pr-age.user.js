// ==UserScript==
// @name         GitHub PR Age Highlighter (Business Days, subtle)
// @namespace    https://github.com/guenth39/userscripts
// @version      1.0.0
// @description  Highlight old PRs in GitHub pull list by business days
// @match        https://github.com/*/*/pulls*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/guenth39/userscripts/main/github-pr-age.user.js
// @updateURL    https://raw.githubusercontent.com/guenth39/userscripts/main/github-pr-age.user.js
// @homepageURL  https://github.com/guenth39/userscripts
// @supportURL   https://github.com/guenth39/userscripts/issues
// @run-at       document-idle
// ==/UserScript==

(() => {
  "use strict";

  const WARN_BUSINESS_DAYS = 3;
  const DANGER_BUSINESS_DAYS = 7;

  const STYLE_ID = "tm-pr-age-style";
  const BADGE_CLASS = "tm-pr-age-badge";

  const css = `
    .tm-pr-age-warn {
      box-shadow: inset 3px 0 0 #d29922 !important;
      background: rgba(210, 153, 34, 0.06) !important;
    }

    .tm-pr-age-danger {
      box-shadow: inset 3px 0 0 #cf222e !important;
      background: rgba(207, 34, 46, 0.07) !important;
    }

    .${BADGE_CLASS} {
      display: inline-block;
      margin-left: 6px;
      padding: 0 6px;
      height: 18px;
      line-height: 18px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      vertical-align: text-bottom;
      border: 1px solid #d0d7de;
      background: #f6f8fa;
      color: #57606a;
      white-space: nowrap;
    }

    .${BADGE_CLASS}.warn {
      border-color: #d29922;
      background: #fff8c5;
      color: #8a6500;
    }

    .${BADGE_CLASS}.danger {
      border-color: #cf222e;
      background: #ffebe9;
      color: #a40e26;
    }
  `;

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function toStartOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function businessDaysOpenSince(isoDate) {
    const created = new Date(isoDate);
    if (Number.isNaN(created.getTime())) {
      return null;
    }

    const start = toStartOfDay(created);
    const end = toStartOfDay(new Date());

    if (start > end) {
      return 0;
    }

    let count = 0;
    const current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        count += 1;
      }
      current.setDate(current.getDate() + 1);
    }

    return Math.max(0, count - 1);
  }

  function getOrCreateBadge(timeEl) {
    const parent = timeEl.parentElement;
    if (!parent) {
      return null;
    }

    let badge = parent.querySelector(`.${BADGE_CLASS}`);
    if (!badge) {
      badge = document.createElement("span");
      badge.className = BADGE_CLASS;
      timeEl.insertAdjacentElement("afterend", badge);
    }

    return badge;
  }

  function removeBadge(timeEl) {
    const parent = timeEl.parentElement;
    if (!parent) {
      return;
    }
    const badge = parent.querySelector(`.${BADGE_CLASS}`);
    if (badge) {
      badge.remove();
    }
  }

  function processPRList() {
    const rows = document.querySelectorAll("div.js-issue-row");

    for (const row of rows) {
      row.classList.remove("tm-pr-age-warn", "tm-pr-age-danger");

      const timeEl = row.querySelector("relative-time");
      if (!timeEl) {
        continue;
      }

      const iso = timeEl.getAttribute("datetime");
      if (!iso) {
        continue;
      }

      const businessDays = businessDaysOpenSince(iso);
      if (businessDays === null) {
        continue;
      }

      if (businessDays > DANGER_BUSINESS_DAYS) {
        row.classList.add("tm-pr-age-danger");
        const badge = getOrCreateBadge(timeEl);
        if (badge) {
          badge.textContent = `${businessDays}bd`;
          badge.classList.remove("warn");
          badge.classList.add("danger");
        }
      } else if (businessDays > WARN_BUSINESS_DAYS) {
        row.classList.add("tm-pr-age-warn");
        const badge = getOrCreateBadge(timeEl);
        if (badge) {
          badge.textContent = `${businessDays}bd`;
          badge.classList.remove("danger");
          badge.classList.add("warn");
        }
      } else {
        removeBadge(timeEl);
      }
    }
  }

  let scheduled = false;
  let processing = false;

  function scheduleProcess() {
    if (scheduled) {
      return;
    }
    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      if (processing) {
        return;
      }
      processing = true;
      try {
        processPRList();
      } finally {
        processing = false;
      }
    });
  }

  function init() {
    injectStyle();
    scheduleProcess();

    const observer = new MutationObserver(() => {
      if (!processing) {
        scheduleProcess();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  init();
})();
