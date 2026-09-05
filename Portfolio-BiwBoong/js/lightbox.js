// lightbox.js

document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.certi-images img , .port-images img');
  const image = document.querySelectorAll('.certi-image img, .port-image img');
  image.forEach(img => {
    img.addEventListener('click', () => {
      const lightbox = document.createElement('div');
      lightbox.id = 'lightbox-overlay'; // 🔑 ใช้ id เพื่ออ้างอิงตอนกด ESC
      lightbox.style.position = 'fixed';
      lightbox.style.top = 0;
      lightbox.style.left = 0;
      lightbox.style.width = '100vw';
      lightbox.style.height = '100vh';
      lightbox.style.backgroundColor = 'rgba(0,0,0,0.8)';
      lightbox.style.display = 'flex';
      lightbox.style.alignItems = 'center';
      lightbox.style.justifyContent = 'center';
      lightbox.style.zIndex = 9999;
      lightbox.style.cursor = 'zoom-out';

      const imgClone = document.createElement('img');
      imgClone.src = img.src;
      imgClone.style.maxWidth = '90%';
      imgClone.style.maxHeight = '90%';
      imgClone.style.boxShadow = '0 0 15px #fff';
      lightbox.appendChild(imgClone);

      // ปิดด้วยการคลิก
      lightbox.addEventListener('click', () => document.body.removeChild(lightbox));

      // ปิดด้วยการกด ESC
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          if (document.body.contains(lightbox)) {
            document.body.removeChild(lightbox);
            document.removeEventListener('keydown', escHandler); // ล้าง event
          }
        }
      };

      document.addEventListener('keydown', escHandler); // ✅ เพิ่มตรงนี้
      document.body.appendChild(lightbox);
    });
  });

  images.forEach(img => {
    img.addEventListener('click', () => {
      const lightbox = document.createElement('div');
      lightbox.id = 'lightbox-overlay'; // 🔑 ใช้ id เพื่ออ้างอิงตอนกด ESC
      lightbox.style.position = 'fixed';
      lightbox.style.top = 0;
      lightbox.style.left = 0;
      lightbox.style.width = '100vw';
      lightbox.style.height = '100vh';
      lightbox.style.backgroundColor = 'rgba(0,0,0,0.8)';
      lightbox.style.display = 'flex';
      lightbox.style.alignItems = 'center';
      lightbox.style.justifyContent = 'center';
      lightbox.style.zIndex = 9999;
      lightbox.style.cursor = 'zoom-out';

      const imgClone = document.createElement('img');
      imgClone.src = img.src;
      imgClone.style.maxWidth = '90%';
      imgClone.style.maxHeight = '90%';
      imgClone.style.boxShadow = '0 0 15px #fff';
      lightbox.appendChild(imgClone);

      // ปิดด้วยการคลิก
      lightbox.addEventListener('click', () => document.body.removeChild(lightbox));

      // ปิดด้วยการกด ESC
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          if (document.body.contains(lightbox)) {
            document.body.removeChild(lightbox);
            document.removeEventListener('keydown', escHandler); // ล้าง event
          }
        }
      };

      document.addEventListener('keydown', escHandler); // ✅ เพิ่มตรงนี้
      document.body.appendChild(lightbox);
    });
  });
});
