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

  const mobileMenuButton =
    document.getElementById("mobileMenuButton");

  const mobileMenu =
    document.getElementById("mobileMenu");

  const backdrop =
    document.getElementById("backdrop");


  /* =========================================================
     MOBILE MENU
  ========================================================= */

  function openMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.remove("hidden");

    if (backdrop) {
      backdrop.classList.remove("hidden");

      setTimeout(() => {
        backdrop.classList.remove("opacity-0");
        backdrop.classList.add("opacity-100");
      }, 10);
    }
  }


  function closeMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.add("hidden");

    if (backdrop) {
      backdrop.classList.remove("opacity-100");
      backdrop.classList.add("opacity-0");

      setTimeout(() => {
        backdrop.classList.add("hidden");
      }, 300);
    }
  }


  function toggleMobileMenu() {

    if (!mobileMenu) return;

    if (mobileMenu.classList.contains("hidden")) {
      openMobileMenu();
    } else {
      closeMobileMenu();
    }
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
     BACKDROP
  ========================================================= */

  if (backdrop) {
    backdrop.addEventListener(
      "click",
      closeMobileMenu
    );
  }


  /* =========================================================
     ESC
  ========================================================= */

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
      closeMobileMenu();
    }

  });


  /* =========================================================
     NAVIGATION
  ========================================================= */

  const links = document.querySelectorAll(
    "#topNav a, #bottomNav a, #mobileMenu a"
  );


  links.forEach((link) => {

    link.addEventListener("click", (event) => {

      const href = link.getAttribute("href");

      if (!href) return;


      /*
        ไม่ยุ่งกับ External Link
      */

      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("#")
      ) {
        return;
      }


      event.preventDefault();


      /*
        ปิด Mobile Menu ก่อนเปลี่ยนหน้า
      */

      closeMobileMenu();


      navigateToPage(href);

    });

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

  let page = href.replace(/^\/+/, "");


  /*
    หน้าแรก
  */

  if (
    page === "" ||
    page === "index" ||
    page === "index.html"
  ) {

    if (isLocalhost) {

      window.location.href = "/index.html";

    } else {

      window.location.href = "/";

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

    window.location.href = "/" + page;

    return;
  }


  /*
    Netlify

    /education.html
         ↓
    /education
  */

  page = page.replace(/\.html$/, "");

  window.location.href = "/" + page;

}


/* =========================================================
   ACTIVE PAGE
========================================================= */

function setActivePage() {

  const links = document.querySelectorAll(
    "#topNav a, #bottomNav a, #mobileMenu a"
  );


  /*
    URL ปัจจุบัน
  */

  let currentPath = window.location.pathname;


  currentPath = currentPath
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .replace(/\.html$/, "");


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

    const href = link.getAttribute("href");

    if (!href) return;


    /*
      แปลง href ให้เป็นชื่อหน้า
    */

    let page = href
      .replace(/^\/+/, "")
      .replace(/\.html$/, "");


    if (page === "") {
      page = "index";
    }


    /*
      ล้าง Active เดิม
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


    /* =====================================================
       TOP NAV
    ===================================================== */

    if (
      page === currentPath &&
      link.classList.contains("top-nav-item")
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


    /* =====================================================
       MOBILE BOTTOM NAV
    ===================================================== */

    if (
      page === currentPath &&
      link.classList.contains("bottom-nav-item")
    ) {

      link.classList.add(
        "text-green-600"
      );

    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (
      page === currentPath &&
      link.classList.contains("mobile-menu-link")
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

  });

}