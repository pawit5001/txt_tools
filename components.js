// components.js

// ฟังก์ชันโหลด navbar เข้าสู่หน้า HTML
function loadNavbar() {
  const navbarHtml = `
  <nav class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <a href="index.html" id="nav-home" class="text-xl font-bold text-blue-700 hover:text-blue-800">Home</a>
      <div class="hidden md:flex space-x-6">
        <a href="combine_combo.html" id="nav-combine" class="text-gray-600 hover:text-blue-700 font-normal">Combine Combo</a>
        <a href="combine_recovery.html" id="nav-recovery" class="text-gray-600 hover:text-blue-700 font-normal">Combine Recovery</a>
        <a href="split_combo.html" id="nav-split" class="text-gray-600 hover:text-blue-700 font-normal">Split Combo</a>
        <a href="get_combo_from_username.html" id="nav-getcombo" class="text-gray-600 hover:text-blue-700 font-normal">Get Combo From Username</a>
        <a href="get_combo_by_number.html" id="nav-getcomboby" class="text-gray-600 hover:text-blue-700 font-normal">Get Combo By Number</a>
      </div>
      <div class="md:hidden">
        <button id="menu-btn" aria-label="Toggle menu" class="focus:outline-none">
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
    </div>
    <div id="mobile-menu" class="hidden md:hidden bg-white shadow-md">
      <a href="combine_combo.html" id="nav-combine-mobile" class="block px-4 py-2 text-gray-600 hover:text-blue-700 font-normal">Combine Combo</a>
      <a href="combine_recovery.html" id="nav-recovery-mobile" class="block px-4 py-2 text-gray-600 hover:text-blue-700 font-normal">Combine Recovery</a>
      <a href="split_combo.html" id="nav-split-mobile" class="block px-4 py-2 text-gray-600 hover:text-blue-700 font-normal">Split Combo</a>
      <a href="get_combo_from_username.html" id="nav-getcombo-mobile" class="block px-4 py-2 text-gray-600 hover:text-blue-700 font-normal">Get Combo From Username</a>
      <a href="get_combo_by_number.html" id="nav-getcomboby-mobile" class="block px-4 py-2 text-gray-600 hover:text-blue-700 font-normal">Get Combo By Number</a>
    </div>
  </nav>
  `;

  const navbarPlaceholder = document.getElementById('navbar-placeholder');
  if (navbarPlaceholder) {
    navbarPlaceholder.innerHTML = navbarHtml;
  }
}

// ฟังก์ชันโหลด footer
function loadFooter() {
  const footerHtml = `
  <footer class="bg-white shadow-inner mt-10 py-4 text-center text-gray-600 text-sm">
    &copy; 2025 TextServ. All rights reserved.
  </footer>
  `;
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = footerHtml;
  }
}

// toggle เมนูมือถือ
function setupMobileMenuToggle() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// ตั้ง active class ตาม URL
function setActiveNav() {
  const path = window.location.pathname.split('/').pop();

  const pageMap = {
    'index.html': ['nav-home', 'nav-home-mobile'],
    'combine_recovery.html': ['nav-recovery', 'nav-recovery-mobile'],
    'combine_combo.html': ['nav-combine', 'nav-combine-mobile'],
    'split_combo.html': ['nav-split', 'nav-split-mobile'],
    'get_combo_from_username.html': ['nav-getcombo', 'nav-getcombo-mobile'],
    'get_combo_by_number.html': ['nav-getcomboby', 'nav-getcomboby-mobile'],
  };

  const navIds = pageMap[path] || ['nav-home', 'nav-home-mobile'];
  const allNavIds = Object.values(pageMap).flat();

  // รีเซ็ตทุกลิงก์เป็นสีปกติ
  allNavIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('text-blue-700', 'font-semibold', 'border-b-2', 'border-blue-700', 'pb-1', 'border-l-4', 'bg-gray-100');
    el.classList.add('text-gray-600', 'hover:text-blue-700', 'font-normal');
  });

  // ตั้ง active link
  navIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('text-gray-600', 'hover:text-blue-700', 'font-normal');
    el.classList.add('text-blue-700', 'font-semibold');
    if (id.endsWith('-mobile')) {
      el.classList.add('bg-gray-100', 'border-l-4', 'border-blue-700');
    } else {
      el.classList.add('border-b-2', 'border-blue-700', 'pb-1');
    }
  });
}

// เรียกใช้งานทั้งหมดตอน DOM พร้อม
document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  loadFooter();
  setupMobileMenuToggle();
  setActiveNav();
});
