// Trust Layer - Don’t trust just verify it
// Customer Flow: Open App → Search Service → Location → Filter Verified/Top Rated → View Profile → Call/WhatsApp

const STORAGE_KEY = 'trustlayer_pros';
const THEME_KEY = 'trustlayer_theme';

let professionals = [];
let currentFilter = 'all';       // all | verified | toprated
let currentCategory = 'All';
let editingId = null;
let detailId = null;

const categoryIcons = {
  'Plumber': '🔧',
  'Electrician': '⚡',
  'AC Technician': '❄️',
  'Carpenter': '🪚',
  'Painter': '🎨',
  'Mechanic': '🚗',
  'Cleaner': '🧹',
  'Mobile/Laptop Repair': '💻',
  'Appliance Repair': '🏠',
  'Salon/Barber': '💇',
  'Tutor': '📚',
  'Tailor': '🧵',
  'Photographer': '📷',
  'Other': '📦'
};

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  loadProfessionals();
  renderCategoryChips();
  setupEventListeners();
  renderList();
});

function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  const locationInput = document.getElementById('location-input');
  const clearBtn = document.getElementById('clear-search');

  searchInput.addEventListener('input', (e) => {
    clearBtn.style.display = e.target.value ? 'block' : 'none';
    renderList();
  });

  locationInput.addEventListener('input', () => renderList());

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    renderList();
  });

  // Main filters: All / Verified / Top Rated
  document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderList();
    });
  });

  document.getElementById('pro-form').addEventListener('submit', handleSubmit);
  document.getElementById('pro-rating').addEventListener('input', updateRatingDisplay);
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
}

function loadTheme() {
  const theme = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('theme-toggle').textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  document.getElementById('theme-toggle').textContent = next === 'dark' ? '☀️' : '🌙';
}

function loadProfessionals() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    professionals = data ? JSON.parse(data) : [];
  } catch (e) {
    professionals = [];
  }
}

function saveProfessionals() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(professionals));
}

function renderCategoryChips() {
  const container = document.getElementById('filter-chips');
  const categories = ['All', ...Object.keys(categoryIcons)];

  container.innerHTML = categories.map(cat => {
    const active = currentCategory === cat ? 'active' : '';
    const icon = cat === 'All' ? '📋' : categoryIcons[cat];
    return `<button class="chip ${active}" data-cat="${cat}">${icon} ${cat}</button>`;
  }).join('');

  container.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      currentCategory = chip.dataset.cat;
      renderCategoryChips();
      renderList();
    });
  });
}

function renderList() {
  const listEl = document.getElementById('pros-list');
  const emptyEl = document.getElementById('empty-state');
  const resultsHeader = document.getElementById('results-header');
  const resultsCount = document.getElementById('results-count');

  const search = document.getElementById('search-input').value.toLowerCase().trim();
  const location = document.getElementById('location-input').value.toLowerCase().trim();

  let filtered = [...professionals];

  // 1. Search Service
  if (search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search) ||
      (p.services && p.services.toLowerCase().includes(search)) ||
      (p.notes && p.notes.toLowerCase().includes(search))
    );
  }

  // 2. Location
  if (location) {
    filtered = filtered.filter(p =>
      (p.area && p.area.toLowerCase().includes(location))
    );
  }

  // 3. Filter: Verified / Top Rated
  if (currentFilter === 'verified') {
    filtered = filtered.filter(p => p.verified);
  } else if (currentFilter === 'toprated') {
    filtered = filtered.filter(p => p.rating >= 4);
  }

  // 4. Category chip
  if (currentCategory !== 'All') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  // Sort: verified first, then rating, then recent
  filtered.sort((a, b) => {
    if (a.verified !== b.verified) return b.verified ? 1 : -1;
    if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0);
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  if (professionals.length === 0) {
    emptyEl.style.display = 'block';
    listEl.innerHTML = '';
    resultsHeader.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  resultsHeader.style.display = 'block';
  resultsCount.textContent = `${filtered.length} professional${filtered.length !== 1 ? 's' : ''} found`;

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state" style="padding: 40px 20px;">
        <div class="empty-icon">🔍</div>
        <h2>No matches found</h2>
        <p>Try changing service, location or filters.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map(p => createCardHTML(p)).join('');

  listEl.querySelectorAll('.pro-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.quick-btn')) return;
      openDetail(card.dataset.id);
    });
  });
}

function createCardHTML(p) {
  const icon = categoryIcons[p.category] || '📦';
  const stars = p.rating > 0 ? '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating) : '';
  const verifiedBadge = p.verified ? `<span class="verified-badge">✓ Verified</span>` : '';
  const verifiedDot = p.verified ? `<span class="verified-dot">✓</span>` : '';

  return `
    <div class="pro-card" data-id="${p.id}">
      <div class="pro-avatar">
        ${icon}
        ${verifiedDot}
      </div>
      <div class="pro-info">
        <div class="pro-name-row">
          <span class="pro-name">${escapeHtml(p.name)}</span>
          ${verifiedBadge}
        </div>
        <div class="pro-meta">
          <span class="pro-category-tag">${escapeHtml(p.category)}</span>
          ${stars ? `<span class="pro-rating">${stars}</span>` : ''}
        </div>
        ${p.area ? `<div class="pro-location">📍 ${escapeHtml(p.area)}</div>` : ''}
        <div class="pro-quick-actions">
          <a class="quick-btn quick-call" href="tel:${p.phone}" onclick="event.stopPropagation()">📞 Call</a>
          <a class="quick-btn quick-wa" href="https://wa.me/91${cleanPhone(p.phone)}" target="_blank" onclick="event.stopPropagation()">💬 WhatsApp</a>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function cleanPhone(phone) {
  return phone.replace(/\D/g, '').replace(/^91/, '');
}

function openAddModal() {
  editingId = null;
  document.getElementById('modal-title').textContent = 'Add Professional';
  document.getElementById('save-btn').textContent = 'Save';
  document.getElementById('pro-form').reset();
  document.getElementById('pro-id').value = '';
  document.getElementById('pro-rating').value = 0;
  document.getElementById('pro-verified').checked = false;
  updateRatingDisplay();
  document.getElementById('modal-overlay').classList.add('active');
  document.getElementById('pro-name').focus();
}

function closeModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.closest('.icon-btn') && e.type === 'click') return;
  document.getElementById('modal-overlay').classList.remove('active');
}

function updateRatingDisplay() {
  const val = parseInt(document.getElementById('pro-rating').value);
  const display = document.getElementById('rating-display');
  display.textContent = val === 0 ? 'Not rated' : '★'.repeat(val) + '☆'.repeat(5 - val);
}

function handleSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('pro-name').value.trim();
  const phone = document.getElementById('pro-phone').value.trim();
  const category = document.getElementById('pro-category').value;
  const area = document.getElementById('pro-area').value.trim();
  const services = document.getElementById('pro-services').value.trim();
  const notes = document.getElementById('pro-notes').value.trim();
  const rating = parseInt(document.getElementById('pro-rating').value) || 0;
  const verified = document.getElementById('pro-verified').checked;

  if (!name || !phone || !category || !area) {
    showToast('Please fill required fields');
    return;
  }

  if (editingId) {
    const idx = professionals.findIndex(p => p.id === editingId);
    if (idx !== -1) {
      professionals[idx] = {
        ...professionals[idx],
        name, phone, category, area, services, notes, rating, verified,
        updatedAt: Date.now(),
        verifiedAt: verified ? (professionals[idx].verifiedAt || Date.now()) : null
      };
      showToast('Updated successfully');
    }
  } else {
    const pro = {
      id: 'TL-' + Date.now().toString().slice(-6) + Math.random().toString(36).slice(2, 5).toUpperCase(),
      name, phone, category, area, services, notes, rating, verified,
      createdAt: Date.now(),
      verifiedAt: verified ? Date.now() : null
    };
    professionals.unshift(pro);
    showToast(verified ? 'Verified professional saved!' : 'Professional saved!');
  }

  saveProfessionals();
  closeModal();
  renderList();
}

function openDetail(id) {
  const pro = professionals.find(p => p.id === id);
  if (!pro) return;

  detailId = id;
  document.getElementById('detail-name').textContent = pro.name;

  const icon = categoryIcons[pro.category] || '📦';
  const stars = pro.rating > 0
    ? '★'.repeat(pro.rating) + '☆'.repeat(5 - pro.rating)
    : 'Not rated';

  const verifiedDate = pro.verifiedAt
    ? new Date(pro.verifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const qrData = encodeURIComponent(
    `Trust Layer\n${pro.name}\n${pro.category}\n${pro.phone}\n${pro.area || ''}\nID: ${pro.id}`
  );
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

  document.getElementById('detail-body').innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar-lg">${icon}</div>
      <div class="profile-title">
        <h3>${escapeHtml(pro.name)}</h3>
        <div class="profile-subtitle">${escapeHtml(pro.category)}${pro.services ? ' • ' + escapeHtml(pro.services) : ''}</div>
        ${pro.verified ? '<span class="verified-badge" style="margin-top:6px;display:inline-flex">✓ VERIFIED</span>' : ''}
      </div>
    </div>

    <div class="detail-row">
      <span class="detail-label">LOCATION</span>
      <span class="detail-value">${pro.area ? escapeHtml(pro.area) : '—'}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">CONTACT</span>
      <span class="detail-value">${escapeHtml(pro.phone)}</span>
    </div>
    ${pro.verified && verifiedDate ? `
    <div class="detail-row">
      <span class="detail-label">VERIFIED ON</span>
      <span class="detail-value">${verifiedDate}</span>
    </div>` : ''}
    <div class="detail-row">
      <span class="detail-label">YOUR RATING</span>
      <span class="detail-value" style="color:#f59e0b">${stars}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">PROFILE ID</span>
      <span class="detail-value">${pro.id}</span>
    </div>

    ${pro.notes ? `
    <div class="detail-notes">
      <strong>YOUR NOTES</strong>
      ${escapeHtml(pro.notes)}
    </div>` : ''}

    <div class="qr-section">
      <img src="${qrUrl}" alt="QR Code" />
      <p>Scan to share this profile<br>Profile ID: ${pro.id}</p>
    </div>

    <div class="disclaimer">
      Verification confirms identity & details you recorded. It is NOT a guarantee of future service quality.
    </div>
  `;

  document.getElementById('call-btn').href = `tel:${pro.phone}`;
  document.getElementById('whatsapp-btn').href = `https://wa.me/91${cleanPhone(pro.phone)}`;

  document.getElementById('detail-overlay').classList.add('active');
}

function closeDetail(e) {
  if (e && e.target !== e.currentTarget && !e.target.closest('.icon-btn') && e.type === 'click') return;
  document.getElementById('detail-overlay').classList.remove('active');
  detailId = null;
}

function editFromDetail() {
  const pro = professionals.find(p => p.id === detailId);
  if (!pro) return;

  closeDetail();
  editingId = pro.id;

  document.getElementById('modal-title').textContent = 'Edit Professional';
  document.getElementById('save-btn').textContent = 'Update';
  document.getElementById('pro-id').value = pro.id;
  document.getElementById('pro-name').value = pro.name;
  document.getElementById('pro-phone').value = pro.phone;
  document.getElementById('pro-category').value = pro.category;
  document.getElementById('pro-area').value = pro.area || '';
  document.getElementById('pro-services').value = pro.services || '';
  document.getElementById('pro-notes').value = pro.notes || '';
  document.getElementById('pro-rating').value = pro.rating || 0;
  document.getElementById('pro-verified').checked = !!pro.verified;
  updateRatingDisplay();

  document.getElementById('modal-overlay').classList.add('active');
}

function confirmDelete() {
  if (!confirm('Delete this professional? This cannot be undone.')) return;
  professionals = professionals.filter(p => p.id !== detailId);
  saveProfessionals();
  closeDetail();
  renderList();
  showToast('Deleted');
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

window.openAddModal = openAddModal;
window.closeModal = closeModal;
window.closeDetail = closeDetail;
window.editFromDetail = editFromDetail;
window.confirmDelete = confirmDelete;
