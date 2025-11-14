// Overlay Navigation
(function () {
  const toggle = document.querySelector('[data-nav-toggle]');
  const overlay = document.querySelector('[data-overlay]');
  const links = document.querySelectorAll('[data-navlink]');
  if (!toggle || !overlay) return;

  function closeOverlay() {
    overlay.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.body.classList.remove('menu-open');
  }
  function openOverlay() {
    overlay.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('menu-open');
  }

  toggle.addEventListener('click', () => {
    const isOpen = overlay.classList.contains('is-open');
    isOpen ? closeOverlay() : openOverlay();
  });
  links.forEach(link => link.addEventListener('click', closeOverlay));
  // Click on dark background closes
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeOverlay();
    }
  });
  // ESC closes
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeOverlay();
    }
  });
})();

// Hero Slideshow
(function () {
  const container = document.querySelector('[data-hero]');
  if (!container) return;
  const slides = Array.from(container.querySelectorAll('.hero__slide'));
  let index = 0;
  setInterval(() => {
    slides[index].classList.remove('is-active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('is-active');
  }, 4200);
})();

// Reveal on scroll (galleries)
(function () {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.gallery img').forEach(img => observer.observe(img));
})();

// Smooth scroll for anchor links
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href.length <= 1) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// Lightbox for gallery images
(function() {
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImg = document.querySelector('[data-lightbox-img]');
  if (!lightbox || !lightboxImg) return;

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  const galleryGroups = new Map();
  const grids = document.querySelectorAll('.gallery-grid');
  grids.forEach((grid, gridIndex) => {
    const groupId = grid.dataset.gallery || `gallery-${gridIndex}`;
    const images = Array.from(grid.querySelectorAll('img'));
    if (!images.length) return;
    galleryGroups.set(groupId, images);
    images.forEach((img, index) => {
      img.dataset.gallery = groupId;
      img.dataset.index = index;
      img.addEventListener('click', () => showImage(groupId, index));
    });
  });

  let currentGroup = null;
  let currentIndex = -1;

  function showImage(groupId, index) {
    const group = galleryGroups.get(groupId);
    if (!group || !group[index]) return;
    currentGroup = groupId;
    currentIndex = index;
    const img = group[index];
    openLightbox(img.src, img.alt);
  }

  const prevBtn = document.querySelector('[data-lightbox-prev]');
  const nextBtn = document.querySelector('[data-lightbox-next]');

  function showPrev() {
    const group = galleryGroups.get(currentGroup);
    if (!group || !group.length) return;
    const newIndex = (currentIndex - 1 + group.length) % group.length;
    showImage(currentGroup, newIndex);
  }

  function showNext() {
    const group = galleryGroups.get(currentGroup);
    if (!group || !group.length) return;
    const newIndex = (currentIndex + 1) % group.length;
    showImage(currentGroup, newIndex);
  }

  prevBtn && prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
  });
  nextBtn && nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox || event.target.matches('.lightbox__close')) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    } else if (event.key === 'ArrowLeft' && lightbox.classList.contains('is-open')) {
      showPrev();
    } else if (event.key === 'ArrowRight' && lightbox.classList.contains('is-open')) {
      showNext();
    }
  });
})();


