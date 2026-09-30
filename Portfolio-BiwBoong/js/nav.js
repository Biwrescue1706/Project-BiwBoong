document.addEventListener("DOMContentLoaded", async () => {
  const navContainer = document.getElementById("nav-container");

  if (!navContainer) {
    console.error("ไม่พบ #nav-container");
    return;
  }

  try {
    const response = await fetch("/nav.html");

    if (!response.ok) {
      throw new Error(
        `โหลด nav.html ไม่สำเร็จ: ${response.status}`
      );
    }

    const html = await response.text();

    navContainer.innerHTML = html;

    setupNavbar();

  } catch (error) {
    console.error("Navbar Error:", error);
  }
});


/* =========================================================
   SETUP NAVBAR
========================================================= */

function setupNavbar() {

  const navToggle =
    document.getElementById("navToggle");

  const navDrawer =
    document.getElementById("navDrawer");

  const drawerClose =
    document.getElementById("drawerClose");

  const backdrop =
    document.getElementById("backdrop");

  const mobileMenuButton =
    document.getElementById("mobileMenuButton");

  const mobileMenu =
    document.getElementById("mobileMenu");


  /* =========================================================
     DRAWER
  ========================================================= */

  function openDrawer() {

    if (!navDrawer || !backdrop) return;

    navDrawer.classList.remove("-translate-x-full");
    navDrawer.classList.add("translate-x-0");

    navDrawer.setAttribute(
      "aria-hidden",
      "false"
    );

    if (navToggle) {
      navToggle.setAttribute(
        "aria-expanded",
        "true"
      );
    }

    backdrop.classList.remove("hidden");

    setTimeout(() => {

      backdrop.classList.remove("opacity-0");
      backdrop.classList.add("opacity-100");

    }, 10);
  }


  function closeDrawer() {

    if (!navDrawer || !backdrop) return;

    navDrawer.classList.remove("translate-x-0");
    navDrawer.classList.add("-translate-x-full");

    navDrawer.setAttribute(
      "aria-hidden",
      "true"
    );

    if (navToggle) {

      navToggle.setAttribute(
        "aria-expanded",
        "false"
      );

    }

    backdrop.classList.remove("opacity-100");
    backdrop.classList.add("opacity-0");

    setTimeout(() => {

      backdrop.classList.add("hidden");

    }, 300);
  }


  /* =========================================================
     MOBILE MENU
  ========================================================= */

  function toggleMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.toggle("hidden");
  }


  /* =========================================================
     LOGO
  ========================================================= */

  if (navToggle) {

    navToggle.addEventListener(
      "click",
      openDrawer
    );


    navToggle.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          openDrawer();

        }

      }
    );

  }


  /* =========================================================
     CLOSE DRAWER
  ========================================================= */

  if (drawerClose) {

    drawerClose.addEventListener(
      "click",
      closeDrawer
    );

  }


  /* =========================================================
     BACKDROP
  ========================================================= */

  if (backdrop) {

    backdrop.addEventListener(
      "click",
      closeDrawer
    );

  }


  /* =========================================================
     MOBILE MENU BUTTON
  ========================================================= */

  if (mobileMenuButton) {

    mobileMenuButton.addEventListener(
      "click",
      toggleMobileMenu
    );

  }


  /* =========================================================
     ESC
  ========================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {

        closeDrawer();

        if (mobileMenu) {
          mobileMenu.classList.add("hidden");
        }

      }

    }
  );


  /* =========================================================
     NAVIGATION
  ========================================================= */

  const links =
    document.querySelectorAll(
      "#navDrawer a, #bottomNav a, #mobileMenu a"
    );


  links.forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const href =
          link.getAttribute("href");

        if (!href) return;

        /*
          ไม่ยุ่งกับ external link
        */

        if (
          href.startsWith("http://") ||
          href.startsWith("https://") ||
          href.startsWith("#")
        ) {
          return;
        }


        event.preventDefault();

        navigateToPage(href);


      }
    );

  });


  /* =========================================================
     ACTIVE MENU
  ========================================================= */

  setActivePage();

}



/* =========================================================
   NAVIGATE
========================================================= */

function navigateToPage(href) {

  const isLocalhost =
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1";


  /*
    เอา / ด้านหน้าออก
  */

  let page =
    href.replace(/^\/+/, "");


  /*
    หน้าแรก
  */

  if (
    page === "" ||
    page === "index" ||
    page === "index.html"
  ) {

    if (isLocalhost) {

      window.location.href =
        "/index.html";

    } else {

      window.location.href =
        "/";

    }

    return;
  }


  /*
    Localhost / Live Server

    /education
       ↓
    /education.html
  */

  if (isLocalhost) {

    if (!page.endsWith(".html")) {

      page += ".html";

    }

    window.location.href =
      "/" + page;

    return;
  }


  /*
    Netlify

    /education.html
       ↓
    /education
  */

  page =
    page.replace(/\.html$/, "");


  window.location.href =
    "/" + page;

}



/* =========================================================
   ACTIVE PAGE
========================================================= */

function setActivePage() {

  const links =
    document.querySelectorAll(
      "#navDrawer a, #bottomNav a, #mobileMenu a"
    );


  let currentPath =
    window.location.pathname;


  /*
    ลบ /
  */

  currentPath =
    currentPath.replace(/^\/+/, "");


  /*
    ลบ /
    ท้าย URL
  */

  currentPath =
    currentPath.replace(/\/+$/, "");


  /*
    ลบ .html
  */

  currentPath =
    currentPath.replace(/\.html$/, "");


  /*
    หน้าแรก
  */

  if (
    currentPath === "" ||
    currentPath === "index"
  ) {

    currentPath = "index";

  }


  links.forEach((link) => {

    const href =
      link.getAttribute("href");

    if (!href) return;


    let page =
      href.replace(/^\/+/, "");


    page =
      page.replace(/\.html$/, "");


    if (page === "") {
      page = "index";
    }


    /*
      เอา class active เดิมออก
    */

    link.classList.remove(
      "bg-gradient-to-r",
      "from-green-600",
      "to-teal-600",
      "text-white",
      "font-semibold",
      "shadow-md",
      "text-green-600"
    );


    /*
      Drawer
    */

    if (
      page === currentPath &&
      link.closest("#navDrawer")
    ) {

      link.classList.add(
        "bg-gradient-to-r",
        "from-green-600",
        "to-teal-600",
        "text-white",
        "font-semibold",
        "shadow-md"
      );

    }


    /*
      Bottom Navigation
    */

    if (
      page === currentPath &&
      link.closest("#bottomNav")
    ) {

      link.classList.add(
        "text-green-600"
      );

    }

  });

}