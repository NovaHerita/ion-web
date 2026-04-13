/* ========================================
   ION — Premium Experience Engine
   ======================================== */

(() => {
  'use strict';

  // ————————————————————————————
  // 1. LENIS SMOOTH SCROLL
  // ————————————————————————————
  let lenis;

  function initLenis() {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Anchor link handling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          lenis.scrollTo(target, { offset: -40, duration: 1.6 });
        }
      });
    });
  }

  // ————————————————————————————
  // 2. LOADING SEQUENCE
  // ————————————————————————————
  function initLoader() {
    const loader = document.querySelector('.loader');
    const loaderLogo = document.querySelector('.loader-logo');
    const loaderText = document.querySelector('.loader-text');
    const loaderLine = document.querySelector('.loader-line');
    if (!loader) return;

    // Orchestrated reveal
    const tl = [
      { el: loaderLogo, delay: 200, props: { opacity: 1, transform: 'scale(1)' } },
      { el: loaderText, delay: 400, props: { opacity: 1 } },
      { el: loaderLine, delay: 500, props: { opacity: 1 } },
    ];

    tl.forEach(({ el, delay, props }) => {
      if (!el) return;
      setTimeout(() => {
        Object.assign(el.style, {
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          ...props,
        });
      }, delay);
    });

    // Dismiss loader
    const dismiss = () => {
      loader.classList.add('done');
      document.body.style.overflow = '';
      setTimeout(() => {
        initHeroSequence();
      }, 300);
    };

    // Wait for fonts + minimum display time
    document.fonts.ready.then(() => {
      setTimeout(dismiss, 1600);
    });
  }

  // ————————————————————————————
  // 3. HERO ENTRANCE SEQUENCE
  // ————————————————————————————
  function initHeroSequence() {
    const heroContent = document.querySelector('.hero-content');
    const constellation = document.querySelector('.hero-constellation');
    const heroArrow = document.querySelector('.hero-arrow');
    if (!heroContent) return;

    const children = heroContent.children;
    const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';

    // Stagger each child element
    Array.from(children).forEach((child, i) => {
      const delay = 100 + i * 120;
      setTimeout(() => {
        child.style.transition = `opacity 1s ${ease}, transform 1s ${ease}`;
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, delay);
    });

    // Constellation fades in
    if (constellation) {
      setTimeout(() => constellation.classList.add('active'), 600);
    }

    // Arrow appears
    if (heroArrow) {
      setTimeout(() => {
        heroArrow.style.transition = `opacity 1s ${ease}`;
        heroArrow.style.opacity = '0.6';
      }, 1200);
    }
  }

  // ————————————————————————————
  // 4. SCROLL PROGRESS BAR
  // ————————————————————————————
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = `scaleX(${progress})`;
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ————————————————————————————
  // 5. REVEAL ON SCROLL (IntersectionObserver)
  // ————————————————————————————
  function initRevealAnimations() {
    const elements = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    });

    elements.forEach((el) => observer.observe(el));
  }

  // ————————————————————————————
  // 6. ACCORDION
  // ————————————————————————————
  function initAccordion() {
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach((accordion) => {
      const allItems = accordion.querySelectorAll('.accordion-item');
      const items = allItems;

      // Staggered reveal on scroll
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            items.forEach((item, i) => {
              setTimeout(() => item.classList.add('is-visible'), i * 60);
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      if (items[0]) observer.observe(items[0]);

      // Show more toggle
      const showMoreBtn = accordion.querySelector('.accordion-show-more');
      const hiddenSection = accordion.querySelector('.accordion-hidden');

      if (showMoreBtn && hiddenSection) {
        showMoreBtn.addEventListener('click', () => {
          const isExpanded = hiddenSection.classList.contains('expanded');
          hiddenSection.classList.toggle('expanded');
          showMoreBtn.classList.toggle('expanded');

          const textEl = showMoreBtn.querySelector('.accordion-show-more-text');
          if (textEl) {
            textEl.textContent = isExpanded ? 'Show more conditions' : 'Show fewer';
          }

          // Stagger reveal the hidden items
          if (!isExpanded) {
            const hiddenItems = hiddenSection.querySelectorAll('.accordion-item');
            hiddenItems.forEach((item, i) => {
              setTimeout(() => item.classList.add('is-visible'), i * 60);
            });

          }
        });
      }

      // Click to toggle
      allItems.forEach((item) => {
        const trigger = item.querySelector('.accordion-trigger');
        if (!trigger) return;

        trigger.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');

          // Close all others
          allItems.forEach((other) => other.classList.remove('open'));

          // Toggle clicked
          if (!isOpen) {
            item.classList.add('open');
          }
        });
      });
    });
  }

  // ————————————————————————————
  // 7. SVG PATH DRAW ON SCROLL
  // ————————————————————————————
  function initSVGDrawAnimations() {
    const illustrations = document.querySelectorAll('.interstitial-illustration');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Calculate real path lengths
          const paths = entry.target.querySelectorAll('path, line');
          paths.forEach((path) => {
            if (path.getTotalLength) {
              const length = path.getTotalLength();
              path.style.strokeDasharray = length;
              path.style.strokeDashoffset = length;
            }
          });

          // Trigger draw
          requestAnimationFrame(() => {
            entry.target.classList.add('drawn');
          });

          // Stagger dot reveals
          const circles = entry.target.querySelectorAll('circle');
          circles.forEach((circle, i) => {
            circle.style.transitionDelay = `${0.8 + i * 0.1}s`;
          });

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    illustrations.forEach((el) => observer.observe(el));
  }

  // ————————————————————————————
  // 8. NAVBAR SCROLL STATE
  // ————————————————————————————
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollY = 0;

    const update = () => {
      const scrollY = window.scrollY;
      navbar.classList.toggle('scrolled', scrollY > 80);
      lastScrollY = scrollY;
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ————————————————————————————
  // 9. ACTIVE NAV HIGHLIGHTING
  // ————————————————————————————
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-links a');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '-100px 0px -40% 0px',
    });

    sections.forEach((s) => observer.observe(s));
  }

  // ————————————————————————————
  // 10. MOBILE MENU
  // ————————————————————————————
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');

      // Lock scroll when open
      if (!isOpen) {
        if (lenis) lenis.stop();
      } else {
        if (lenis) lenis.start();
      }
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        if (lenis) lenis.start();
      });
    });
  }

  // ————————————————————————————
  // 11. TEAM CAROUSEL + BIO PANEL
  // ————————————————————————————
  function initTeamCarousel() {
    const carousel = document.querySelector('.team-carousel');
    const prevBtn = document.querySelector('.team-prev');
    const nextBtn = document.querySelector('.team-next');
    const bioPanel = document.querySelector('.team-bio-panel');
    const cards = Array.from(document.querySelectorAll('.team-card'));
    if (!carousel || !bioPanel || !cards.length) return;

    const bioName = bioPanel.querySelector('.team-bio-name');
    const bioRole = bioPanel.querySelector('.team-bio-role');
    const bioText = bioPanel.querySelector('.team-bio-text');

    const MAX_VISIBLE = 2;
    let startIndex = 0;

    function showCards() {
      cards.forEach((c) => c.classList.remove('visible-card'));
      for (let i = 0; i < MAX_VISIBLE; i++) {
        const idx = (startIndex + i) % cards.length;
        cards[idx].classList.add('visible-card');
      }
    }

    function setActiveMember(card) {
      cards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');

      bioPanel.classList.remove('visible');

      setTimeout(() => {
        bioName.textContent = card.dataset.name || '';
        bioRole.textContent = card.dataset.role || '';
        bioText.textContent = card.dataset.bio || '';
        bioPanel.classList.add('visible');
      }, 250);
    }

    // Click handler for each card
    cards.forEach((card) => {
      card.addEventListener('click', () => setActiveMember(card));
    });

    // Show initial cards and activate the first one
    showCards();
    const firstActive = cards[0];
    if (firstActive) {
      firstActive.classList.add('active');
      bioName.textContent = firstActive.dataset.name || '';
      bioRole.textContent = firstActive.dataset.role || '';
      bioText.textContent = firstActive.dataset.bio || '';
      bioPanel.classList.add('visible');
    }

    // Arrow navigation — loops through cards
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        startIndex = (startIndex + 1) % cards.length;
        showCards();
        // Activate the first visible card
        const firstVisibleIdx = startIndex % cards.length;
        setActiveMember(cards[firstVisibleIdx]);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        startIndex = (startIndex - 1 + cards.length) % cards.length;
        showCards();
        const firstVisibleIdx = startIndex % cards.length;
        setActiveMember(cards[firstVisibleIdx]);
      });
    }
  }

  // ————————————————————————————
  // 12. MAGNETIC BUTTONS
  // ————————————————————————————
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic');
    if (!buttons.length || window.matchMedia('(pointer: coarse)').matches) return;

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        btn.style.transform = 'translate(0, 0)';
        setTimeout(() => { btn.style.transition = ''; }, 500);
      });
    });
  }

  // ————————————————————————————
  // 13. CARD 3D TILT EFFECT
  // ————————————————————————————
  function initCardTilt() {
    const cards = document.querySelectorAll('.card-tilt');
    if (!cards.length || window.matchMedia('(pointer: coarse)').matches) return;

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `
          perspective(800px)
          rotateY(${x * 6}deg)
          rotateX(${-y * 6}deg)
          translateY(-4px)
        `;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
        setTimeout(() => { card.style.transition = ''; }, 600);
      });
    });
  }

  // ————————————————————————————
  // 14. HERO PARALLAX
  // ————————————————————————————
  function initHeroParallax() {
    const heroContent = document.querySelector('.hero-content');
    const constellation = document.querySelector('.hero-constellation');
    if (!heroContent) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      if (scrollY < vh) {
        const progress = scrollY / vh;
        heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
        heroContent.style.opacity = 1 - progress * 1.2;

        if (constellation) {
          constellation.style.transform = `translateY(${scrollY * 0.1}px)`;
        }
      }
    }, { passive: true });
  }

  // ————————————————————————————
  // 15. SECTION DIVIDERS
  // ————————————————————————————
  function initDividers() {
    const dividers = document.querySelectorAll('.section-divider');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    dividers.forEach((d) => observer.observe(d));
  }

  // ————————————————————————————
  // 16. SPLIT TEXT HEADINGS
  // ————————————————————————————
  function initSplitText() {
    const headings = document.querySelectorAll('.split-heading');

    headings.forEach((heading) => {
      const text = heading.textContent.trim();
      heading.innerHTML = '';

      text.split(' ').forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        span.style.transitionDelay = `${i * 60}ms`;
        span.style.transition = `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)`;
        heading.appendChild(span);

        // Add space
        if (i < text.split(' ').length - 1) {
          heading.appendChild(document.createTextNode(' '));
        }
      });
    });

    // Observe
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.word').forEach((word) => {
            word.classList.add('revealed');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    headings.forEach((h) => observer.observe(h));
  }

  // ————————————————————————————
  // 17. REGULATION CURVE ANIMATION
  // ————————————————————————————
  function initRegulationCurve() {
    const canvas = document.querySelector('.regulation-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animating = false;
    let time = 0;

    function getCanvasHeight() {
      // Read height from CSS (responsive via media queries)
      const computed = window.getComputedStyle(canvas).height;
      return parseInt(computed, 10) || 120;
    }

    let canvasH = getCanvasHeight();

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvasH = getCanvasHeight();
      canvas.width = rect.width * dpr;
      canvas.height = canvasH * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = canvasH + 'px';
      ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.width / (window.devicePixelRatio || 1);
    const h = () => canvasH;

    function draw() {
      if (!animating) return;

      const width = w();
      const height = h();
      const mid = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Baseline — thin dashed line
      ctx.beginPath();
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = 'rgba(13, 27, 42, 0.08)';
      ctx.lineWidth = 1;
      ctx.moveTo(0, mid);
      ctx.lineTo(width, mid);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw 3 layered waves — each progressively more dysregulated
      const layers = [
        { alpha: 0.06, ampScale: 1.3, speed: 0.6, freqShift: 0.3 },
        { alpha: 0.10, ampScale: 1.0, speed: 0.8, freqShift: 0 },
        { alpha: 0.25, ampScale: 0.8, speed: 1.0, freqShift: -0.2 },
      ];

      layers.forEach((layer) => {
        ctx.beginPath();

        for (let x = 0; x <= width; x++) {
          const progress = x / width; // 0 (left/regulated) → 1 (right/dysregulated)

          // Amplitude increases from left to right
          const baseAmp = 6 + progress * 38 * layer.ampScale;

          // Frequency increases and becomes irregular
          const baseFreq = 0.015 + progress * 0.04;
          const irregularity = progress * progress * 12;

          // Compose multiple sine waves for organic feel
          const y = mid
            + Math.sin((x * baseFreq + time * layer.speed * 0.008 + layer.freqShift) * 2) * baseAmp * 0.5
            + Math.sin((x * baseFreq * 2.3 + time * layer.speed * 0.012 + 1.7) * 2) * baseAmp * 0.3
            + Math.sin((x * baseFreq * 4.1 + time * layer.speed * 0.006 + 3.2) * 2) * irregularity * 0.15
            + Math.cos((x * 0.008 + time * 0.003) * 2) * progress * 4;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        // Gradient stroke: teal → red
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `rgba(42, 107, 138, ${layer.alpha})`);
        gradient.addColorStop(0.5, `rgba(42, 107, 138, ${layer.alpha * 0.9})`);
        gradient.addColorStop(0.75, `rgba(160, 100, 80, ${layer.alpha})`);
        gradient.addColorStop(1, `rgba(192, 86, 74, ${layer.alpha * 1.2})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.lineJoin = 'round';
        ctx.stroke();
      });

      // Primary wave — the boldest one
      ctx.beginPath();

      for (let x = 0; x <= width; x++) {
        const progress = x / width;

        const baseAmp = 5 + progress * 34;
        const baseFreq = 0.018 + progress * 0.035;
        const chaos = progress * progress * 10;

        const y = mid
          + Math.sin((x * baseFreq + time * 0.01) * 2) * baseAmp * 0.6
          + Math.sin((x * baseFreq * 2.7 + time * 0.014 + 0.8) * 2) * baseAmp * 0.25
          + Math.sin((x * baseFreq * 5.3 + time * 0.007 + 2.1) * 2) * chaos * 0.12;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      const mainGradient = ctx.createLinearGradient(0, 0, width, 0);
      mainGradient.addColorStop(0, 'rgba(42, 107, 138, 0.7)');
      mainGradient.addColorStop(0.45, 'rgba(42, 107, 138, 0.5)');
      mainGradient.addColorStop(0.7, 'rgba(160, 100, 80, 0.5)');
      mainGradient.addColorStop(1, 'rgba(192, 86, 74, 0.65)');

      ctx.strokeStyle = mainGradient;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Small dots at peaks on the right side
      for (let x = Math.floor(width * 0.6); x <= width; x += 30) {
        const progress = x / width;
        const baseAmp = 5 + progress * 34;
        const baseFreq = 0.018 + progress * 0.035;
        const y = mid + Math.sin((x * baseFreq + time * 0.01) * 2) * baseAmp * 0.6;
        const dotAlpha = (progress - 0.6) * 1.5;

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192, 86, 74, ${dotAlpha * 0.4})`;
        ctx.fill();
      }

      time++;
      requestAnimationFrame(draw);
    }

    // Start when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animating) {
          animating = true;
          draw();
        } else if (!entry.isIntersecting) {
          animating = false;
        }
      });
    }, { threshold: 0.2 });

    observer.observe(canvas);
  }

  // ————————————————————————————
  // AROUSAL–PERFORMANCE CURVE (Yerkes-Dodson)
  // ————————————————————————————
  function initArousalCurve() {
    const canvas = document.querySelector('.arousal-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animating = false;
    let progress = 0;       // 0→1 draw-on progress
    let time = 0;           // ongoing animation tick
    let dotPulse = 0;       // pulsing dot at peak

    function getCanvasHeight() {
      const computed = window.getComputedStyle(canvas).height;
      return parseInt(computed, 10) || 220;
    }

    let canvasH = getCanvasHeight();

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvasH = getCanvasHeight();
      canvas.width = rect.width * dpr;
      canvas.height = canvasH * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = canvasH + 'px';
      ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.width / (window.devicePixelRatio || 1);
    const h = () => canvasH;

    // Inverted-U gaussian shape
    function gaussian(x, mean, sigma) {
      return Math.exp(-0.5 * Math.pow((x - mean) / sigma, 2));
    }

    function draw() {
      if (!animating) return;

      const width = w();
      const height = h();
      const padTop = 28;   // extra headroom so Peak Performance label doesn't clip
      const padBottom = 22; // keeps Low/High text well above the canvas bottom edge
      const curveH = height - padTop - padBottom;

      ctx.clearRect(0, 0, width, height);

      // Animate draw-on
      if (progress < 1) progress += 0.012;
      if (progress > 1) progress = 1;

      time++;
      dotPulse += 0.04;

      const drawWidth = width * progress;

      // Gradient fill under curve
      const points = [];
      for (let x = 0; x <= drawWidth; x++) {
        const t = x / width;
        const g = gaussian(t, 0.5, 0.2);
        // Add subtle animation wobble after drawn
        const wobble = progress >= 1 ? Math.sin(time * 0.02 + t * 6) * 2 * g : 0;
        const y = padTop + curveH * (1 - g * 0.85) + wobble;
        points.push({ x, y });
      }

      // Coloured zones (under the curve)
      if (points.length > 1) {
        // Left zone — cool blue
        const zoneGrad = ctx.createLinearGradient(0, 0, width, 0);
        zoneGrad.addColorStop(0, 'rgba(90, 122, 154, 0.08)');
        zoneGrad.addColorStop(0.35, 'rgba(42, 107, 138, 0.12)');
        zoneGrad.addColorStop(0.5, 'rgba(42, 107, 138, 0.15)');
        zoneGrad.addColorStop(0.65, 'rgba(42, 107, 138, 0.12)');
        zoneGrad.addColorStop(0.85, 'rgba(192, 86, 74, 0.08)');
        zoneGrad.addColorStop(1, 'rgba(192, 86, 74, 0.04)');

        ctx.beginPath();
        ctx.moveTo(points[0].x, height - padBottom);
        points.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, height - padBottom);
        ctx.closePath();
        ctx.fillStyle = zoneGrad;
        ctx.fill();
      }

      // Main curve stroke
      if (points.length > 1) {
        const strokeGrad = ctx.createLinearGradient(0, 0, width, 0);
        strokeGrad.addColorStop(0, 'rgba(90, 122, 154, 0.4)');
        strokeGrad.addColorStop(0.3, 'rgba(42, 107, 138, 0.8)');
        strokeGrad.addColorStop(0.5, 'rgba(42, 107, 138, 1)');
        strokeGrad.addColorStop(0.7, 'rgba(160, 100, 80, 0.8)');
        strokeGrad.addColorStop(1, 'rgba(192, 86, 74, 0.4)');

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = strokeGrad;
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Glow line (wider, faint)
      if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = 'rgba(42, 107, 138, 0.12)';
        ctx.lineWidth = 8;
        ctx.stroke();
      }

      // Peak dot — pulsing
      if (progress > 0.5) {
        const peakX = width * 0.5;
        const peakG = gaussian(0.5, 0.5, 0.2);
        const peakY = padTop + curveH * (1 - peakG * 0.85);
        const pulseR = 5 + Math.sin(dotPulse) * 1.5;
        const pulseAlpha = 0.6 + Math.sin(dotPulse) * 0.15;

        // Outer glow
        ctx.beginPath();
        ctx.arc(peakX, peakY, pulseR + 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(42, 107, 138, ${pulseAlpha * 0.15})`;
        ctx.fill();

        // Dot
        ctx.beginPath();
        ctx.arc(peakX, peakY, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(42, 107, 138, ${pulseAlpha})`;
        ctx.fill();

        // Label — always render above the dot; clamp so it never goes above the canvas top
        if (progress >= 1) {
          ctx.font = '500 10px "DM Sans", sans-serif';
          ctx.fillStyle = 'rgba(42, 107, 138, 0.8)';
          ctx.textAlign = 'center';
          const labelY = Math.max(12, peakY - (pulseR + 10));
          ctx.fillText('Peak Performance', peakX, labelY);
        }
      }

      // Baseline
      ctx.beginPath();
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = 'rgba(13, 27, 42, 0.06)';
      ctx.lineWidth = 1;
      ctx.moveTo(0, height - padBottom);
      ctx.lineTo(width, height - padBottom);
      ctx.stroke();
      ctx.setLineDash([]);

      // Axis labels — Low / High
      ctx.font = '500 9px "DM Sans", sans-serif';
      ctx.fillStyle = 'rgba(107, 122, 141, 0.5)';
      ctx.textAlign = 'left';
      ctx.fillText('Low', 2, height - padBottom - 4);
      ctx.textAlign = 'right';
      ctx.fillText('High', width - 2, height - padBottom - 4);

      requestAnimationFrame(draw);
    }

    // Start when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animating) {
          animating = true;
          progress = 0;
          draw();
        } else if (!entry.isIntersecting) {
          animating = false;
        }
      });
    }, { threshold: 0.2 });

    observer.observe(canvas);
  }

  // ————————————————————————————
  // FOOTER YEAR
  // ————————————————————————————
  function initFooter() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ————————————————————————————
  // INIT ALL
  // ————————————————————————————
  function init() {
    document.body.style.overflow = 'hidden';

    initLoader();
    initLenis();
    initScrollProgress();
    initNavbar();
    initActiveNav();
    initMobileMenu();
    initTeamCarousel();
    initRevealAnimations();
    initAccordion();
    initSVGDrawAnimations();
    initMagneticButtons();
    initCardTilt();
    initHeroParallax();
    initDividers();
    initSplitText();
    initRegulationCurve();
    initArousalCurve();
    initFooter();
  }

  // Kick off
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
