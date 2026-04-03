/* ============================================
   MATIHUB - Main JavaScript
   Scroll animations, navigation, interactions
   ============================================ */

(function () {
  'use strict';

  // ---- Page Loader ----
  const loader = document.getElementById('pageLoader');
  const body = document.body;

  window.addEventListener('load', () => {
    setTimeout(() => {
      body.classList.add('loaded');
      loader.classList.add('hidden');
      initHeroAnimation();
    }, 800);
  });

  // Fallback if load event already fired
  if (document.readyState === 'complete') {
    setTimeout(() => {
      body.classList.add('loaded');
      loader.classList.add('hidden');
      initHeroAnimation();
    }, 800);
  }

  // ---- Hero Animation ----
  function initHeroAnimation() {
    const hero = document.querySelector('.hero');

    if (hero) {
      hero.classList.add('animate-stripes');
      hero.classList.add('visible');

      // Mark stripes as revealed after animation completes
      setTimeout(() => {
        const stripes = hero.querySelector('.hero__stripes');
        if (stripes) stripes.classList.add('revealed');
      }, 2200);
    }
  }

  // ---- Smooth Scroll Navigation ----
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          // Close mobile menu if open
          closeMobileMenu();

          const offset = href === '#top' ? 0 : target.offsetTop - 60;
          window.scrollTo({
            top: offset,
            behavior: 'smooth',
          });
        }
      }
    });
  });

  // ---- Mobile Menu ----
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    burger.classList.remove('active');
    mobileMenu.classList.remove('active');
    body.style.overflow = '';
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.contains('active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        burger.classList.add('active');
        mobileMenu.classList.add('active');
        body.style.overflow = 'hidden';
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach((link) => {
      link.addEventListener('click', () => {
        setTimeout(closeMobileMenu, 100);
      });
    });
  }

  // ---- Scroll Reveal Animations ----
  const animateElements = document.querySelectorAll('[data-animate]');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.05,
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach((el) => {
    scrollObserver.observe(el);
  });

  // ---- Parallax on Hero (subtle) ----
  const heroContent = document.querySelector('.hero__content');

  function handleParallax() {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;

    if (scrollY < heroHeight && heroContent) {
      const progress = scrollY / heroHeight;
      const translateY = progress * 80;
      const opacity = 1 - progress * 1.5;
      heroContent.style.transform = `translateY(${translateY}px)`;
      heroContent.style.opacity = Math.max(0, opacity);
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // ---- Page Transition Effect ----
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.target === '_blank') return;
      e.preventDefault();
      const href = link.href;
      body.style.transition = 'opacity 0.5s ease';
      body.style.opacity = '0';
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    });
  });

  // ---- Stagger animation for work cards in grid ----
  const workCards = document.querySelectorAll('.work-card');

  const workCardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const parent = card.closest('.works__grid');
          if (parent) {
            const cards = Array.from(parent.querySelectorAll('.work-card'));
            const index = cards.indexOf(card);
            card.style.transitionDelay = `${(index % 3) * 0.1}s`;
          }
          card.classList.add('visible');
          workCardObserver.unobserve(card);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.05,
    }
  );

  workCards.forEach((card) => {
    workCardObserver.observe(card);
  });

  // ---- Discipline section interaction ----
  const disciplineTriggers = Array.from(document.querySelectorAll('[data-discipline-trigger]'));
  const disciplinePanels = Array.from(document.querySelectorAll('[data-discipline-panel]'));
  const disciplineNav = document.querySelector('.discipline-system__nav');
  const disciplinePanelWrap = document.querySelector('.discipline-system__panel-wrap');
  const disciplineTrack = document.querySelector('[data-discipline-track]');
  const disciplineDots = Array.from(document.querySelectorAll('[data-discipline-dot]'));
  const canHoverDisciplines = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mobileCarouselQuery = window.matchMedia('(max-width: 640px)');
  let touchStartX = 0;
  let touchDeltaX = 0;

  function isMobileDisciplineCarousel() {
    return mobileCarouselQuery.matches;
  }

  function setActiveDot(index) {
    disciplineDots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === index);
    });
  }

  function clearActiveDiscipline() {
    disciplineTriggers.forEach((trigger, index) => {
      trigger.classList.remove('is-active');
      trigger.setAttribute('aria-selected', 'false');
      trigger.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });

    disciplinePanels.forEach((panel) => {
      panel.hidden = !isMobileDisciplineCarousel();
      panel.classList.remove('is-active');
    });

    disciplinePanelWrap?.classList.remove('has-active-panel');
    setActiveDot(-1);

    if (disciplineTrack && isMobileDisciplineCarousel()) {
      disciplineTrack.style.transform = 'translateX(0)';
    }
  }

  function setActiveDiscipline(id) {
    let activeIndex = 0;

    disciplineTriggers.forEach((trigger, index) => {
      const isActive = trigger.dataset.discipline === id;
      trigger.classList.toggle('is-active', isActive);
      trigger.setAttribute('aria-selected', isActive ? 'true' : 'false');
      trigger.setAttribute('tabindex', isActive ? '0' : '-1');

      if (isActive) {
        activeIndex = index;
      }
    });

    disciplinePanels.forEach((panel) => {
      const isActive = panel.dataset.discipline === id;
      panel.hidden = isMobileDisciplineCarousel() ? false : !isActive;
      panel.classList.toggle('is-active', isActive);
    });

    disciplinePanelWrap?.classList.add('has-active-panel');
    setActiveDot(activeIndex);

    if (disciplineTrack && isMobileDisciplineCarousel()) {
      disciplineTrack.style.transform = `translateX(-${activeIndex * 100}%)`;
    }
  }

  disciplineTriggers.forEach((trigger, index) => {
    const id = trigger.dataset.discipline;
    if (!id) return;

    trigger.addEventListener('click', () => {
      setActiveDiscipline(id);
    });

    trigger.addEventListener('focus', () => {
      setActiveDiscipline(id);
    });

    trigger.addEventListener('mouseenter', () => {
      if (canHoverDisciplines) {
        setActiveDiscipline(id);
      }
    });

    trigger.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') {
        return;
      }

      event.preventDefault();

      let nextIndex = index;

      if (event.key === 'ArrowDown') nextIndex = (index + 1) % disciplineTriggers.length;
      if (event.key === 'ArrowUp') nextIndex = (index - 1 + disciplineTriggers.length) % disciplineTriggers.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = disciplineTriggers.length - 1;

      const nextTrigger = disciplineTriggers[nextIndex];
      const nextId = nextTrigger?.dataset.discipline;

      if (nextTrigger && nextId) {
        setActiveDiscipline(nextId);
        nextTrigger.focus();
      }
    });
  });

  if (disciplineNav && canHoverDisciplines) {
    disciplineNav.addEventListener('mouseleave', () => {
      clearActiveDiscipline();
    });
  }

  if (disciplineTrack) {
    disciplineTrack.addEventListener('touchstart', (event) => {
      if (!isMobileDisciplineCarousel()) return;
      touchStartX = event.touches[0]?.clientX ?? 0;
      touchDeltaX = 0;
    }, { passive: true });

    disciplineTrack.addEventListener('touchmove', (event) => {
      if (!isMobileDisciplineCarousel()) return;
      touchDeltaX = (event.touches[0]?.clientX ?? 0) - touchStartX;
    }, { passive: true });

    disciplineTrack.addEventListener('touchend', () => {
      if (!isMobileDisciplineCarousel() || Math.abs(touchDeltaX) < 40) return;

      const currentIndex = disciplineTriggers.findIndex((trigger) => trigger.classList.contains('is-active'));
      const fallbackIndex = currentIndex === -1 ? 0 : currentIndex;
      const nextIndex = touchDeltaX < 0
        ? Math.min(fallbackIndex + 1, disciplineTriggers.length - 1)
        : Math.max(fallbackIndex - 1, 0);

      const nextId = disciplineTriggers[nextIndex]?.dataset.discipline;
      if (nextId) {
        setActiveDiscipline(nextId);
      }
    });
  }

  if (canHoverDisciplines) {
    clearActiveDiscipline();
  } else if (disciplineTriggers.length > 0) {
    const initialId = disciplineTriggers[0].dataset.discipline;
    if (initialId) {
      setActiveDiscipline(initialId);
    }
  }

  mobileCarouselQuery.addEventListener('change', () => {
    const activeTrigger = disciplineTriggers.find((trigger) => trigger.classList.contains('is-active'));
    const activeId = activeTrigger?.dataset.discipline ?? disciplineTriggers[0]?.dataset.discipline;

    if (canHoverDisciplines && !isMobileDisciplineCarousel()) {
      clearActiveDiscipline();
      return;
    }

    if (activeId) {
      setActiveDiscipline(activeId);
    }
  });

  // ---- Discipline panel reveal stagger ----
  const disciplineSection = document.querySelector('.discipline-system');

  const philosophyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          philosophyObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -30px 0px',
      threshold: 0.05,
    }
  );

  if (disciplineSection) {
    philosophyObserver.observe(disciplineSection);
  }

  // ---- Video hover on work cards ----
  workCards.forEach((card) => {
    const video = card.querySelector('.work-card__video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });

  // ---- Cursor-following gradient on hero (subtle) ----
  const hero = document.querySelector('.hero');

  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty('--mouse-x', `${x}%`);
      hero.style.setProperty('--mouse-y', `${y}%`);
    });
  }
})();
