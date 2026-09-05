// JS/nav.js
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const drawer = document.getElementById("navDrawer");
  const closeBtn = document.getElementById("drawerClose");
  const backdrop = document.getElementById("backdrop");

  let lastFocused = null;

  // เปิด Drawer
  function openDrawer() {
    if (!drawer) return;

    lastFocused = document.activeElement;

    // Drawer เลื่อนเข้ามา
    drawer.classList.remove("-translate-x-full");
    drawer.classList.add("translate-x-0");

    drawer.setAttribute("aria-hidden", "false");

    // Backdrop
    if (backdrop) {
      backdrop.classList.remove("hidden");

      requestAnimationFrame(() => {
        backdrop.classList.remove("opacity-0");
        backdrop.classList.add("opacity-100");
      });
    }

    // ป้องกัน Scroll หน้าเว็บ
    document.body.classList.add("overflow-hidden");

    // เปลี่ยนสถานะปุ่ม
    toggle?.setAttribute("aria-expanded", "true");

    // Focus ปุ่มปิด
    closeBtn?.focus();
  }

  // ปิด Drawer
  function closeDrawer() {
    if (!drawer) return;

    // Drawer เลื่อนออก
    drawer.classList.remove("translate-x-0");
    drawer.classList.add("-translate-x-full");
    drawer.setAttribute("aria-hidden", "true");

    // Backdrop Fade Out
    if (backdrop) {
      backdrop.classList.remove("opacity-100");
      backdrop.classList.add("opacity-0");

      setTimeout(() => {
        backdrop.classList.add("hidden");
      }, 300);
    }

    // เปิด Scroll กลับ
    document.body.classList.remove("overflow-hidden");

    // เปลี่ยนสถานะปุ่ม
    toggle?.setAttribute("aria-expanded", "false");

    // คืน Focus กลับตำแหน่งเดิม
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  // เปิดด้วย Mouse
  toggle?.addEventListener("click", openDrawer);

  // เปิดด้วย Keyboard
  toggle?.addEventListener("keydown", (e) => {

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDrawer();
    }
  });

  // ปุ่มปิด
  closeBtn?.addEventListener("click", closeDrawer);

  // คลิก Backdrop
  backdrop?.addEventListener("click", closeDrawer);

  // กด Escape เพื่อปิด
  document.addEventListener("keydown", (e) => {

    if (
      e.key === "Escape" &&
      drawer?.classList.contains("translate-x-0")
    ) {
      closeDrawer();
    }

  });

  // ป้องกัน Scroll ผ่าน Drawer
  drawer?.addEventListener(
    "touchmove",
    (e) => e.stopPropagation(),
    { passive: true }
  );

});