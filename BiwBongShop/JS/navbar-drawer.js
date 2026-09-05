document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navDrawer = document.getElementById("navDrawer");
  const drawerClose = document.getElementById("drawerClose");
  const backdrop = document.getElementById("backdrop");

  const links = document.querySelectorAll(".nav-link");

  const logoutTop = document.getElementById("logoutBtnTop");
  const logoutDrawer = document.getElementById("logoutBtnDrawer");

  const welcome = document.getElementById("welcome");
  const drawerWelcome = document.getElementById("drawerWelcome");

  if (!navToggle || !navDrawer || !backdrop) {
    console.warn("Navbar elements not found");
    return;
  }

  function openDrawer() {
    navDrawer.classList.remove("-translate-x-full");
    navDrawer.classList.add("translate-x-0");

    navDrawer.setAttribute("aria-hidden", "false");
    navToggle.setAttribute("aria-expanded", "true");

    backdrop.hidden = false;

    requestAnimationFrame(() => {
      backdrop.classList.remove(
        "hidden",
        "opacity-0"
      );

      backdrop.classList.add(
        "opacity-100"
      );
    });

    document.documentElement.classList.add("overflow-hidden");
    document.body.classList.add("overflow-hidden");

    drawerClose?.focus();
  }

  function closeDrawer() {
    navDrawer.classList.remove("translate-x-0");
    navDrawer.classList.add("-translate-x-full");

    navDrawer.setAttribute("aria-hidden", "true");
    navToggle.setAttribute("aria-expanded", "false");

    backdrop.classList.remove("opacity-100");
    backdrop.classList.add("opacity-0");

    setTimeout(() => {
      if (!navDrawer.classList.contains("translate-x-0")) {
        backdrop.classList.add("hidden");
        backdrop.hidden = true;
      }
    }, 300);

    document.documentElement.classList.remove("overflow-hidden");
    document.body.classList.remove("overflow-hidden");

    navToggle.focus();
  }

  function toggleDrawer() {
    if (navDrawer.classList.contains("translate-x-0")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  navToggle.addEventListener("click", toggleDrawer);

  navToggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleDrawer();
    }
  });

  drawerClose?.addEventListener("click", closeDrawer);

  backdrop.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      navDrawer.classList.contains("translate-x-0")
    ) {
      closeDrawer();
    }
  });

  links.forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  function setActiveLink() {
    const currentPath =
      (window.location.pathname || "/")
        .replace(/\/+$/, "") || "/";

    links.forEach((link) => {
      const href =
        (link.getAttribute("href") || "/")
          .replace(/\/+$/, "") || "/";

      link.classList.remove(
        "bg-emerald-500",
        "text-white",
        "font-semibold",
        "shadow-md"
      );

      if (href === currentPath) {
        link.classList.add(
          "bg-emerald-500",
          "text-white",
          "font-semibold",
          "shadow-md"
        );
      }
    });
  }

  setActiveLink();

  const userName =
    localStorage.getItem("userName");

  if (userName) {
    if (welcome) {
      welcome.textContent =
        `สวัสดี, ${userName}`;
    }

    if (drawerWelcome) {
      drawerWelcome.textContent =
        userName;
    }
  }

  async function logout() {
    try {
      if (window.Auth?.logout) {
        await window.Auth.logout();
      }
    } catch (error) {
      console.warn("Logout API failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");

      window.location.href = "/index";
    }
  }

  logoutTop?.addEventListener(
    "click",
    logout
  );

  logoutDrawer?.addEventListener(
    "click",
    logout
  );

  navDrawer.addEventListener("keydown", (e) => {
    if (
      e.key !== "Tab" ||
      !navDrawer.classList.contains("translate-x-0")
    ) {
      return;
    }

    const focusable = navDrawer.querySelectorAll(`
      a[href],
      button:not([disabled]),
      [tabindex]:not([tabindex="-1"])
    `);

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (
      !e.shiftKey &&
      document.activeElement === last
    ) {
      e.preventDefault();
      first.focus();
    }

    if (
      e.shiftKey &&
      document.activeElement === first
    ) {
      e.preventDefault();
      last.focus();
    }
  });
});