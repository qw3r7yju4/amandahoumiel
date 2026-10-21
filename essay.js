/**
 * Amanda Houmiel Archive - Longform Essay Reader Scripts
 * Dynamic Reading Controls & Scroll Spy
 */

(function () {
  'use strict';

  const htmlEl = document.documentElement;
  const progressBar = document.getElementById('readingProgress');
  const backToTopBtn = document.getElementById('backToTop');
  const tocLinks = document.querySelectorAll('.toc-link');
  const sections = document.querySelectorAll('.essay-section');
  const sizeLabel = document.getElementById('sizeLabel');

  // --- Reading Progress & Scroll Spy & Back-To-Top ---
  function onScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
    }

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scroll spy for TOC
    let currentSectionId = '';
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      tocLinks.forEach((link) => {
        if (link.getAttribute('href') === '#' + currentSectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Theme Switcher (Light / Sepia / Dark) ---
  const themeButtons = document.querySelectorAll('.theme-btn');

  function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    themeButtons.forEach((btn) => {
      if (btn.getAttribute('data-theme') === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    try {
      localStorage.setItem('ah_essay_theme', theme);
    } catch (_) {}
  }

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      if (theme) setTheme(theme);
    });
  });

  // Restore saved theme
  try {
    const savedTheme = localStorage.getItem('ah_essay_theme') || localStorage.getItem('klutch_essay_theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  } catch (_) {}

  // --- Font Family Switcher (Serif / Sans) ---
  const fontSerifBtn = document.getElementById('fontSerifBtn');
  const fontSansBtn = document.getElementById('fontSansBtn');

  function setFontFamily(font) {
    htmlEl.setAttribute('data-font', font);
    if (font === 'sans') {
      fontSansBtn?.classList.add('active');
      fontSerifBtn?.classList.remove('active');
    } else {
      fontSerifBtn?.classList.add('active');
      fontSansBtn?.classList.remove('active');
    }
    try {
      localStorage.setItem('ah_essay_font', font);
    } catch (_) {}
  }

  fontSerifBtn?.addEventListener('click', () => setFontFamily('serif'));
  fontSansBtn?.addEventListener('click', () => setFontFamily('sans'));

  try {
    const savedFont = localStorage.getItem('ah_essay_font') || localStorage.getItem('klutch_essay_font');
    if (savedFont) {
      setFontFamily(savedFont);
    }
  } catch (_) {}

  // --- Font Size Scaler ---
  const fontSizes = [
    { label: '90%', size: '15px' },
    { label: '100%', size: '16px' },
    { label: '115%', size: '18px' },
    { label: '130%', size: '20px' }
  ];
  let currentSizeIndex = 1; // Default 100%

  function applyFontSize(index) {
    currentSizeIndex = Math.max(0, Math.min(fontSizes.length - 1, index));
    const target = fontSizes[currentSizeIndex];
    htmlEl.style.fontSize = target.size;
    if (sizeLabel) {
      sizeLabel.textContent = target.label;
    }
    try {
      localStorage.setItem('ah_essay_size_index', currentSizeIndex);
    } catch (_) {}
  }

  document.getElementById('fontDecBtn')?.addEventListener('click', () => {
    applyFontSize(currentSizeIndex - 1);
  });

  document.getElementById('fontIncBtn')?.addEventListener('click', () => {
    applyFontSize(currentSizeIndex + 1);
  });

  try {
    const savedSizeIndex = localStorage.getItem('ah_essay_size_index') || localStorage.getItem('klutch_essay_size_index');
    if (savedSizeIndex !== null) {
      applyFontSize(parseInt(savedSizeIndex, 10));
    }
  } catch (_) {}

  // Initial trigger
  onScroll();
})();
