(function () {
  const drawer = document.getElementById("navDrawer");
  const backdrop = document.getElementById("backdrop");
  const toggleEl = document.getElementById("navToggle");
  const closeBtn = document.getElementById("drawerClose");
  const installBtn = document.getElementById("installAppBtn");

  if (!drawer || !backdrop || !toggleEl) return;

  let lastFocused = null;
  let deferredPrompt = null;

  const hiddenClasses = [
    "-translate-x-full",
    "opacity-0",
    "pointer-events-none",
  ];

  const showClasses = [
    "translate-x-0",
    "opacity-100",
    "pointer-events-auto",
  ];

  function setAriaExpanded(isOpen) {
    toggleEl.setAttribute("aria-expanded", String(isOpen));
    drawer.setAttribute("aria-hidden", String(!isOpen));
  }

  function openDrawer() {
    if (drawer.classList.contains("translate-x-0")) return;

    lastFocused = document.activeElement;

    drawer.classList.remove(...hiddenClasses);
    drawer.classList.add(...showClasses);

    backdrop.hidden = false;
    backdrop.classList.remove("hidden");
    backdrop.classList.add("opacity-100");

    document.body.classList.add("overflow-hidden");

    setAriaExpanded(true);

    const firstFocusable = drawer.querySelector(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );

    firstFocusable?.focus();

    document.addEventListener("keydown", trapFocus);
  }

  function closeDrawer() {
    if (drawer.classList.contains("-translate-x-full")) return;

    drawer.classList.remove(...showClasses);
    drawer.classList.add(...hiddenClasses);

    backdrop.classList.remove("opacity-100");
    backdrop.classList.add("hidden");
    backdrop.hidden = true;

    document.body.classList.remove("overflow-hidden");

    setAriaExpanded(false);

    document.removeEventListener("keydown", trapFocus);

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function trapFocus(e) {
    if (drawer.classList.contains("-translate-x-full")) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closeDrawer();
      return;
    }

    if (e.key !== "Tab") return;

    const focusables = drawer.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function handleToggleActivate(e) {
    if (e.type === "keydown") {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
    }

    if (drawer.classList.contains("translate-x-0")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  toggleEl.addEventListener("click", handleToggleActivate);
  toggleEl.addEventListener("keydown", handleToggleActivate);

  closeBtn?.addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;

    if (installBtn) {
      installBtn.classList.remove("hidden");
      installBtn.classList.add("flex");
    }
  });

  installBtn?.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    deferredPrompt = null;

    installBtn.classList.add("hidden");
    installBtn.classList.remove("flex");

    closeDrawer();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;

    if (installBtn) {
      installBtn.classList.add("hidden");
      installBtn.classList.remove("flex");
    }
  });

  let startX = 0;
  let startY = 0;
  let touching = false;

  drawer.addEventListener(
    "touchstart",
    (e) => {
      if (drawer.classList.contains("-translate-x-full")) return;

      const touch = e.touches[0];

      startX = touch.clientX;
      startY = touch.clientY;
      touching = true;
    },
    { passive: true }
  );

  drawer.addEventListener(
    "touchmove",
    (e) => {
      if (!touching) return;

      const touch = e.touches[0];

      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (dx < -60 && Math.abs(dy) < 40) {
        touching = false;
        closeDrawer();
      }
    },
    { passive: true }
  );

  drawer.addEventListener("touchend", () => {
    touching = false;
  });

  drawer.classList.remove(...showClasses);
  drawer.classList.add(...hiddenClasses);

  backdrop.classList.add("hidden");
  backdrop.hidden = true;

  setAriaExpanded(false);
})();