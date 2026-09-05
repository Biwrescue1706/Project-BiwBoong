document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const drawer = document.getElementById("navDrawer");
  const closeBtn = document.getElementById("drawerClose");
  const backdrop = document.getElementById("backdrop");

  if (!toggle || !drawer || !backdrop) return;

  const FOCUSABLE =
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  let lastFocused = null;

  // =========================
  // Focus Helpers
  // =========================

  function firstFocusable() {
    const list = drawer.querySelectorAll(FOCUSABLE);
    return list.length ? list[0] : null;
  }

  function focusables() {
    return Array.from(drawer.querySelectorAll(FOCUSABLE)).filter(
      (el) =>
        !el.hasAttribute("disabled") &&
        el.tabIndex !== -1 &&
        isVisible(el)
    );
  }

  function isVisible(el) {
    const rects = el.getClientRects();

    return (
      !!rects.length &&
      window.getComputedStyle(el).visibility !== "hidden"
    );
  }

  // =========================
  // Open Drawer
  // =========================

  function openDrawer() {
    lastFocused = document.activeElement;

    // Drawer: เลื่อนเข้ามา
    drawer.classList.remove("-translate-x-full");
    drawer.classList.add("translate-x-0");

    drawer.setAttribute("aria-hidden", "false");

    // Logo
    toggle.setAttribute("aria-expanded", "true");

    // Backdrop
    backdrop.classList.remove("hidden");

    // ให้ browser render ก่อนเริ่ม fade
    requestAnimationFrame(() => {
      backdrop.classList.remove("opacity-0");
      backdrop.classList.add("opacity-100");
    });

    // ป้องกัน body scroll
    document.body.classList.add("overflow-hidden");

    // Focus เมนูแรก
    const first = firstFocusable();
    first?.focus();

    // Keyboard events
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("focus", trapFocus, true);
  }

  // =========================
  // Close Drawer
  // =========================

  function closeDrawer() {
    // Drawer: เลื่อนออก
    drawer.classList.remove("translate-x-0");
    drawer.classList.add("-translate-x-full");

    drawer.setAttribute("aria-hidden", "true");

    // Logo
    toggle.setAttribute("aria-expanded", "false");

    // Backdrop fade out
    backdrop.classList.remove("opacity-100");
    backdrop.classList.add("opacity-0");

    // รอ transition แล้วค่อย hidden
    const onFadeOut = () => {
      backdrop.classList.add("hidden");
      backdrop.removeEventListener("transitionend", onFadeOut);
    };

    backdrop.addEventListener("transitionend", onFadeOut);

    // เปิด scroll กลับ
    document.body.classList.remove("overflow-hidden");

    // Remove events
    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("focus", trapFocus, true);

    // คืน focus ให้โลโก้
    lastFocused?.focus();
  }

  // =========================
  // Keyboard
  // =========================

  function onKeydown(e) {
    // ESC = ปิด
    if (e.key === "Escape") {
      e.preventDefault();
      closeDrawer();
      return;
    }

    // TAB = Focus Trap
    if (e.key === "Tab" && drawer.classList.contains("translate-x-0")) {
      const nodes = focusables();

      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      // Shift + Tab จากตัวแรก
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }

      // Tab จากตัวสุดท้าย
      else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // =========================
  // Focus Trap
  // =========================

  function trapFocus(e) {
    if (!drawer.classList.contains("translate-x-0")) return;

    if (!drawer.contains(e.target)) {
      e.stopPropagation();
      firstFocusable()?.focus();
    }
  }

  // =========================
  // Logo Click
  // =========================

  toggle.addEventListener("click", openDrawer);

  // Enter / Space
  toggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDrawer();
    }
  });

  // =========================
  // Close Button
  // =========================

  closeBtn?.addEventListener("click", closeDrawer);

  // =========================
  // Click Backdrop
  // =========================

  backdrop.addEventListener("click", closeDrawer);
});
