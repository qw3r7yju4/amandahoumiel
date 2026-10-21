/**
 * Amanda Houmiel Archive - Main Site Scripts
 * Interactive Gallery, Lightbox Modal, Filtering & Navigation
 */

(function () {
  'use strict';

  // --- Image Archive Data ---
  const images = [];

  // 37 Amanda / Mandy photos
  for (let i = 1; i <= 37; i++) {
    images.push({
      id: `mandy-${i}`,
      category: 'mandy',
      title: `Amanda / Mandy Houmiel #${i}`,
      src: `images/mandy${i}.jpg`,
      fallbackSrc: `https://raw.githubusercontent.com/qw3r7yju4/dummies/refs/heads/main/images/mandy${i}.jpg`,
      alt: `Photo of Amanda Houmiel aka Mandy Gaskins #${i}`,
      badge: `Mandy #${i}`
    });
  }

  // 4 Kaylen photos
  for (let i = 1; i <= 4; i++) {
    images.push({
      id: `kaylen-${i}`,
      category: 'kaylen',
      title: `Kaylen Marie Houmiel #${i}`,
      src: `images/mandykalen${i}.jpg`,
      fallbackSrc: `https://raw.githubusercontent.com/qw3r7yju4/dummies/refs/heads/main/images/mandykalen${i}.jpg`,
      alt: `Photo of Kaylen Houmiel #${i}`,
      badge: `Kaylen #${i}`
    });
  }

  // --- DOM Elements ---
  const galleryGrid = document.getElementById('photoGrid');
  const galleryCountEl = document.getElementById('galleryCount');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  // Lightbox Elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentFilter = 'all';
  let activeFilteredList = [...images];
  let currentLightboxIndex = 0;

  // --- Render Gallery Grid ---
  function renderGallery(filter) {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';

    if (filter === 'all') {
      activeFilteredList = images;
    } else {
      activeFilteredList = images.filter((img) => img.category === filter);
    }

    if (galleryCountEl) {
      galleryCountEl.textContent = `Showing ${activeFilteredList.length} of ${images.length} archived photos`;
    }

    activeFilteredList.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'photo-card';
      card.setAttribute('data-id', item.id);
      card.setAttribute('data-index', index);

      card.innerHTML = `
        <div class="photo-card-img-wrapper">
          <img src="${item.src}" alt="${item.alt}" loading="lazy" onerror="this.onerror=null; this.src='${item.fallbackSrc}'" />
          <span class="photo-badge">${item.badge}</span>
        </div>
        <div class="photo-info">
          <span class="photo-title">${item.title}</span>
          <i class="fa-solid fa-magnifying-glass-plus photo-action-icon"></i>
        </div>
      `;

      card.addEventListener('click', () => {
        openLightbox(index);
      });

      galleryGrid.appendChild(card);
    });
  }

  // --- Filter Buttons Handlers ---
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderGallery(currentFilter);
    });
  });

  // --- Lightbox Functions ---
  function openLightbox(index) {
    if (!lightboxModal || !activeFilteredList[index]) return;
    currentLightboxIndex = index;
    const item = activeFilteredList[currentLightboxIndex];

    lightboxImg.src = item.src;
    lightboxImg.onerror = function () {
      this.onerror = null;
      this.src = item.fallbackSrc;
    };
    lightboxCaption.textContent = `${item.title} (${currentLightboxIndex + 1} of ${activeFilteredList.length})`;

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextImage() {
    if (!activeFilteredList.length) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % activeFilteredList.length;
    openLightbox(currentLightboxIndex);
  }

  function showPrevImage() {
    if (!activeFilteredList.length) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + activeFilteredList.length) % activeFilteredList.length;
    openLightbox(currentLightboxIndex);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // --- Mobile Menu Toggle ---
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // Initial Render
  renderGallery('all');
})();
