(function () {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const modal = document.querySelector('#video-modal');
  const modalVideo = document.querySelector('#modal-video');
  const modalTitle = document.querySelector('#modal-title');
  const modalCategory = document.querySelector('#modal-category');

  // Menu mobile
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Reveal on scroll
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('visible'); });
  }

  // Filtro do portfólio
  const filters = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.project-card');

  filters.forEach(function (filterButton) {
    filterButton.addEventListener('click', function () {
      const selected = filterButton.dataset.filter;

      filters.forEach(function (button) { button.classList.remove('is-active'); });
      filterButton.classList.add('is-active');

      cards.forEach(function (card) {
        const category = card.dataset.category;
        const show = selected === 'all' || category === selected;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  // Modal de vídeos
  function openModal(button) {
    if (!modal || !modalVideo) return;

    modalTitle.textContent = button.dataset.title || 'Projeto';
    modalCategory.textContent = (button.dataset.categoryLabel || 'Projeto').toUpperCase();

    // Ajusta automaticamente o player ao formato original de cada vídeo.
    const format = button.dataset.format || 'landscape';
    modal.dataset.format = format;

    modalVideo.src = button.dataset.video;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    modalVideo.play().catch(function () {});
  }

  function closeModal() {
    if (!modal || !modalVideo) return;
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    modal.removeAttribute('data-format');
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('[data-video]').forEach(function (button) {
    button.addEventListener('click', function () { openModal(button); });
  });

  document.querySelectorAll('[data-close-modal]').forEach(function (element) {
    element.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
  });

  // Movimento muito sutil dos elementos gráficos no desktop
  const hero = document.querySelector('.hero');
  if (hero && window.matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', function (event) {
      const x = (event.clientX / window.innerWidth - 0.5) * 8;
      const y = (event.clientY / window.innerHeight - 0.5) * 8;
      const orbitOne = document.querySelector('.orbit-one');
      const orbitTwo = document.querySelector('.orbit-two');
      if (orbitOne) orbitOne.style.transform = `translate(${x}px, ${y}px) rotate(-18deg)`;
      if (orbitTwo) orbitTwo.style.transform = `translate(${-x * .7}px, ${-y * .7}px) rotate(26deg)`;
    });
  }
}());
