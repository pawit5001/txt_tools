// components.js

// ฟังก์ชัน Modal Component
function createModal() {
  const modalHtml = `
  <div id="custom-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
      <div class="p-6">
        <div class="flex items-center justify-center mb-4">
          <div id="modal-icon" class="w-16 h-16 rounded-full flex items-center justify-center"></div>
        </div>
        <h3 id="modal-title" class="text-2xl font-bold text-gray-900 text-center mb-3"></h3>
        <p id="modal-message" class="text-gray-600 text-center mb-6 leading-relaxed"></p>
        <div id="modal-buttons" class="flex gap-3 justify-center"></div>
      </div>
    </div>
  </div>
  `;
  
  if (!document.getElementById('custom-modal')) {
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
}

// ฟังก์ชันแสดง Modal
function showModal(options) {
  const {
    title = 'Notification',
    message = '',
    type = 'info', // 'success', 'error', 'warning', 'info', 'confirm'
    confirmText = 'OK',
    cancelText = 'Cancel',
    onConfirm = null,
    onCancel = null
  } = options;

  createModal();
  
  const modal = document.getElementById('custom-modal');
  const modalIcon = document.getElementById('modal-icon');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const modalButtons = document.getElementById('modal-buttons');

  // ตั้งค่า icon และสีตาม type
  const iconConfig = {
    success: {
      bg: 'bg-green-100',
      icon: '<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>'
    },
    error: {
      bg: 'bg-red-100',
      icon: '<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>'
    },
    warning: {
      bg: 'bg-yellow-100',
      icon: '<svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>'
    },
    info: {
      bg: 'bg-blue-100',
      icon: '<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    },
    confirm: {
      bg: 'bg-purple-100',
      icon: '<svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    }
  };

  const config = iconConfig[type] || iconConfig.info;
  modalIcon.className = `w-16 h-16 rounded-full flex items-center justify-center ${config.bg}`;
  modalIcon.innerHTML = config.icon;
  modalTitle.textContent = title;
  modalMessage.textContent = message;

  // สร้างปุ่ม
  modalButtons.innerHTML = '';
  
  if (type === 'confirm') {
    // สำหรับ confirm dialog มี 2 ปุ่ม
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition';
    cancelBtn.textContent = cancelText;
    cancelBtn.onclick = () => {
      hideModal();
      if (onCancel) onCancel();
    };
    
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition';
    confirmBtn.textContent = confirmText;
    confirmBtn.onclick = () => {
      hideModal();
      if (onConfirm) onConfirm();
    };
    
    modalButtons.appendChild(cancelBtn);
    modalButtons.appendChild(confirmBtn);
  } else {
    // สำหรับ alert ปกติมีปุ่มเดียว
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition';
    confirmBtn.textContent = confirmText;
    confirmBtn.onclick = () => {
      hideModal();
      if (onConfirm) onConfirm();
    };
    
    modalButtons.appendChild(confirmBtn);
  }

  // แสดง modal
  modal.classList.remove('hidden');
  
  // ปิด modal เมื่อคลิกพื้นหลัง
  modal.onclick = (e) => {
    if (e.target === modal) {
      hideModal();
      if (onCancel) onCancel();
    }
  };
}

// ฟังก์ชันซ่อน Modal
function hideModal() {
  const modal = document.getElementById('custom-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Toast helpers (non-blocking feedback)
function ensureToastContainer() {
  let container = document.getElementById('toast-stack');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-stack';
    container.className = 'fixed z-[120] flex flex-col gap-3 max-w-sm pointer-events-none';
    document.body.appendChild(container);
  }
  return container;
}

function positionToastContainer() {
  const container = ensureToastContainer();
  container.style.top = 'auto';
  container.style.right = '20px';
  container.style.bottom = '20px';
  container.style.left = 'auto';
}

function showToast({ message, type = 'info', duration = 2000 }) {
  const palette = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-amber-500',
    info: 'bg-blue-600'
  };

  const container = ensureToastContainer();
  // Limit concurrent toasts to keep UI tidy
  const maxToasts = 3;
  while (container.children.length >= maxToasts) {
    container.firstChild.remove();
  }

  const toast = document.createElement('div');
  toast.className = `${palette[type] || palette.info} bg-opacity-95 text-white shadow-2xl rounded-xl px-4 py-3 pointer-events-auto transition-all duration-200 opacity-0 translate-y-2 backdrop-blur-sm border border-white/10`; // Elevated but light
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 220);
  }, duration);
}

// ฟังก์ชันโหลด navbar เข้าสู่หน้า HTML
function loadNavbar() {
  const navbarHtml = `
  <nav class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900 to-blue-950 shadow-xl border-b-4 border-blue-950">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <a href="index.html" id="nav-home" class="text-2xl font-bold text-white transition duration-200 focus:outline-none">TextServ</a>
      <div class="hidden md:flex space-x-1 items-center">
        <a href="split_combo.html" id="nav-split" class="px-4 py-2 text-white hover:bg-blue-500 hover:text-white rounded-lg transition duration-200 font-medium">Split Combo</a>
        <a href="get_combo_from_username.html" id="nav-getcombo" class="px-4 py-2 text-white hover:bg-blue-500 hover:text-white rounded-lg transition duration-200 font-medium">Get Combo From Username</a>
        <a href="get_combo_by_number.html" id="nav-getcomboby" class="px-4 py-2 text-white hover:bg-blue-500 hover:text-white rounded-lg transition duration-200 font-medium">Get Combo By Number</a>
        <a href="setting_v4_config.html" id="nav-setting" class="px-4 py-2 text-white hover:bg-blue-500 hover:text-white rounded-lg transition duration-200 font-medium">Setting V4</a>
        
        <!-- Dropdown Menu -->
        <div class="relative group ml-2">
          <button class="px-4 py-2 text-white hover:bg-blue-500 hover:text-white rounded-lg transition duration-200 font-medium flex items-center space-x-1">
            <span>More</span>
            <svg class="w-4 h-4 group-hover:rotate-180 transition duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </button>
          <div class="absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 border border-gray-200">
            <a href="combine_combo.html" class="block px-5 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium first:rounded-t-lg transition">Combine Combo</a>
            <a href="combine_recovery.html" class="block px-5 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium last:rounded-b-lg transition">Combine Recovery</a>
          </div>
        </div>
      </div>
      <div class="md:hidden">
        <button id="menu-btn" aria-label="Toggle menu" class="focus:outline-none">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
    </div>
    <div id="mobile-menu" class="hidden md:hidden bg-blue-600 shadow-md border-t border-blue-500">
      <a href="split_combo.html" id="nav-split-mobile" class="block px-5 py-3 text-white hover:bg-blue-500 font-medium transition">Split Combo</a>
      <a href="get_combo_from_username.html" id="nav-getcombo-mobile" class="block px-5 py-3 text-white hover:bg-blue-500 font-medium transition">Get Combo From Username</a>
      <a href="get_combo_by_number.html" id="nav-getcomboby-mobile" class="block px-5 py-3 text-white hover:bg-blue-500 font-medium transition">Get Combo By Number</a>
      <a href="setting_v4_config.html" id="nav-setting-mobile" class="block px-5 py-3 text-white hover:bg-blue-500 font-medium transition">Setting V4</a>
      <div class="px-5 py-3 border-t border-blue-500 bg-blue-700">
        <p class="text-white font-bold mb-2 text-sm">More Tools</p>
        <a href="combine_combo.html" class="block px-3 py-2 text-blue-100 hover:text-white hover:bg-blue-500 rounded font-medium text-sm transition">Combine Combo</a>
        <a href="combine_recovery.html" class="block px-3 py-2 text-blue-100 hover:text-white hover:bg-blue-500 rounded font-medium text-sm transition">Combine Recovery</a>
      </div>
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
  <footer class="bg-gradient-to-r from-blue-900 to-blue-950 text-white mt-auto">
    <div class="container mx-auto px-6 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="text-center md:text-left">
          <h3 class="text-2xl font-bold mb-2">TextServ</h3>
          <p class="text-blue-200 text-sm">Powerful text processing tools for your needs</p>
        </div>
        <div class="flex flex-col items-center md:items-end gap-2">
          <p class="text-blue-100 text-sm">&copy; 2025 TextServ. All rights reserved.</p>
          <p class="text-blue-300 text-xs">Built with ❤️ for efficiency</p>
        </div>
      </div>
    </div>
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
    'split_combo.html': ['nav-split', 'nav-split-mobile'],
    'get_combo_from_username.html': ['nav-getcombo', 'nav-getcombo-mobile'],
    'get_combo_by_number.html': ['nav-getcomboby', 'nav-getcomboby-mobile'],
    'setting_v4_config.html': ['nav-setting', 'nav-setting-mobile'],
  };

  const navIds = pageMap[path] || [];
  const allNavIds = Object.values(pageMap).flat();

  // รีเซ็ตทุกลิงก์เป็นสีปกติ
  allNavIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('text-blue-700', 'font-semibold', 'border-b-2', 'border-blue-700', 'pb-1', 'border-l-4', 'bg-gray-100', 'text-white', 'bg-blue-500');
    el.classList.add('text-white', 'hover:bg-blue-500');
  });

  // ตั้ง active link
  navIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('text-gray-600', 'hover:text-blue-700', 'font-normal');
    el.classList.add('text-white', 'font-semibold', 'bg-blue-500');
    if (id.endsWith('-mobile')) {
      el.classList.add('bg-blue-500');
    }
  });
}

// เรียกใช้งานทั้งหมดตอน DOM พร้อม
document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  loadFooter();
  setupMobileMenuToggle();
  setActiveNav();
  positionToastContainer();
  window.addEventListener('resize', positionToastContainer);
});
