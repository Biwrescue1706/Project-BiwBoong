(function () {
  const drawer = document.getElementById("navDrawer");
  const backdrop = document.getElementById("backdrop");
  const toggle = document.getElementById("navToggle");
  const closeBtn = document.getElementById("drawerClose");

  const installDesktop = document.getElementById(
    "installAppBtnDesktop"
  );

  const installMobile = document.getElementById(
    "installAppBtnMobile"
  );

  if (!drawer || !backdrop || !toggle) return;

  let deferredPrompt = null;

  function openDrawer() {
    drawer.classList.remove("-translate-x-full", "opacity-0");
    drawer.classList.add("translate-x-0", "opacity-100");

    backdrop.classList.remove("hidden");

    document.body.classList.add("overflow-hidden");

    toggle.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    drawer.classList.remove("translate-x-0", "opacity-100");
    drawer.classList.add("-translate-x-full", "opacity-0");

    backdrop.classList.add("hidden");

    document.body.classList.remove("overflow-hidden");

    toggle.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
  }

  toggle.addEventListener("click", openDrawer);

  closeBtn?.addEventListener("click", closeDrawer);

  backdrop.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeDrawer();
    }
  });

  /* ==================== PWA INSTALL ==================== */

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();

    deferredPrompt = event;

    // Desktop
    if (installDesktop) {
      installDesktop.classList.remove("hidden");
      installDesktop.classList.add("flex");
    }

    // Mobile
    if (installMobile) {
      installMobile.classList.remove("hidden");
      installMobile.classList.add("flex");
    }
  });

  async function installApp() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;

    console.log("PWA install:", result.outcome);

    deferredPrompt = null;

    if (installDesktop) {
      installDesktop.classList.add("hidden");
      installDesktop.classList.remove("flex");
    }

    if (installMobile) {
      installMobile.classList.add("hidden");
      installMobile.classList.remove("flex");
    }
  }

  installDesktop?.addEventListener("click", installApp);

  installMobile?.addEventListener("click", installApp);

  window.addEventListener("appinstalled", function () {
    deferredPrompt = null;

    if (installDesktop) {
      installDesktop.classList.add("hidden");
      installDesktop.classList.remove("flex");
    }

    if (installMobile) {
      installMobile.classList.add("hidden");
      installMobile.classList.remove("flex");
    }
  });

  /* ==================== ACTIVE MENU ==================== */

  const currentPath = window.location.pathname;

  document.querySelectorAll(".mobile-nav-item").forEach(function (item) {
    const href = item.getAttribute("href");

    if (!href) return;

    if (
      (href === "/" && currentPath === "/") ||
      (href !== "/" && currentPath === href)
    ) {
      item.classList.remove("text-gray-500");
      item.classList.add(
        "bg-green-100",
        "text-green-700"
      );
    }
  });

  /* ==================== CLOSE DRAWER AFTER CLICK ==================== */

  drawer.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeDrawer);
  });
})();