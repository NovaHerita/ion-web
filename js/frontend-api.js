/* ========================================
   ION — Frontend API Integration
   Connects the public site to the backend
   ======================================== */

(() => {
  'use strict';

  const API = '/api';

  // ——— Newsletter Subscribe (with GDPR consent modal) ———
  const form = document.getElementById('subscribe-form');
  const msgEl = document.getElementById('subscribe-message');
  const modal = document.getElementById('consent-modal');
  const checkbox = document.getElementById('consent-checkbox');
  const confirmBtn = document.getElementById('consent-confirm');
  const cancelBtn = document.getElementById('consent-cancel');

  function openConsentModal() {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (checkbox) checkbox.checked = false;
    if (confirmBtn) confirmBtn.disabled = true;
  }

  function closeConsentModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  async function submitSubscription(email) {
    msgEl.style.color = '#6b7a8d';
    msgEl.textContent = 'Subscribing...';

    try {
      const res = await fetch(`${API}/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent: true,
          consentText: checkbox?.parentElement?.querySelector('span')?.textContent?.trim() ||
            'User confirmed GDPR consent on newsletter signup form',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        msgEl.style.color = '#c0564a';
        msgEl.textContent = data.error || `Error ${res.status}: subscribe failed`;
        return;
      }
      msgEl.style.color = '#2d8a4e';
      msgEl.textContent = data.message || 'Successfully subscribed!';
      form.reset();
    } catch (err) {
      msgEl.style.color = '#c0564a';
      msgEl.textContent = `Network error: ${err.message}`;
    }
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('subscribe-email').value.trim();
      if (!email) return;
      msgEl.textContent = '';
      openConsentModal();
    });
  }

  if (checkbox && confirmBtn) {
    checkbox.addEventListener('change', () => {
      confirmBtn.disabled = !checkbox.checked;
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
      if (!checkbox?.checked) return;
      const email = document.getElementById('subscribe-email').value.trim();
      closeConsentModal();
      await submitSubscription(email);
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeConsentModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeConsentModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeConsentModal();
    });
  }

  // ——— Consultation Enquiry Modal ———
  const consultModal = document.getElementById('consult-modal');
  const consultForm = document.getElementById('consult-form');
  const consultStatus = document.getElementById('consult-status');
  const consultSubmit = document.getElementById('consult-submit');
  const consultCancel = document.getElementById('consult-cancel');

  function openConsultModal() {
    if (!consultModal) return;
    consultModal.classList.add('is-open');
    consultModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    consultStatus.textContent = '';
    consultStatus.className = 'consult-status';
    setTimeout(() => document.getElementById('consult-first')?.focus(), 50);
  }

  function closeConsultModal() {
    if (!consultModal) return;
    consultModal.classList.remove('is-open');
    consultModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.js-consult-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openConsultModal();
    });
  });

  if (consultCancel) consultCancel.addEventListener('click', closeConsultModal);
  if (consultModal) {
    consultModal.addEventListener('click', (e) => {
      if (e.target === consultModal) closeConsultModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && consultModal.classList.contains('is-open')) closeConsultModal();
    });
  }

  if (consultSubmit && consultForm) {
    consultSubmit.addEventListener('click', async () => {
      if (!consultForm.reportValidity()) return;

      const payload = {
        firstName: document.getElementById('consult-first').value.trim(),
        lastName: document.getElementById('consult-last').value.trim(),
        email: document.getElementById('consult-email').value.trim(),
        enquiry: document.getElementById('consult-enquiry').value.trim(),
      };

      consultSubmit.disabled = true;
      consultStatus.textContent = 'Sending...';
      consultStatus.className = 'consult-status';

      try {
        const res = await fetch(`${API}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Error ${res.status}`);

        consultStatus.textContent = 'Thanks — your enquiry has been sent. We’ll be in touch shortly.';
        consultStatus.className = 'consult-status success';
        consultForm.reset();
        setTimeout(closeConsultModal, 2200);
      } catch (err) {
        consultStatus.textContent = err.message || 'Could not send your enquiry. Please try again.';
        consultStatus.className = 'consult-status error';
      } finally {
        consultSubmit.disabled = false;
      }
    });
  }

  // ——— Load Articles ———
  async function loadArticles() {
    const grid = document.querySelector('.journals-grid');
    if (!grid) return;

    try {
      const res = await fetch(`${API}/articles`);
      const articles = await res.json();

      if (!articles.length) return; // Keep static content if no API articles

      grid.innerHTML = articles.slice(0, 3).map((a) => {
        const href = a.is_external
          ? escHtml(a.external_url)
          : `/article.html?id=${encodeURIComponent(a.id)}`;
        const target = a.is_external ? 'target="_blank" rel="noopener"' : '';
        return `
        <div class="card journal-card is-visible" style="opacity:1;transform:none;">
          <span class="category">${escHtml(a.category)}</span>
          <h3>${escHtml(a.title)}</h3>
          <p class="summary">${escHtml(a.summary)}</p>
          <a href="${href}" class="read-link" ${target}>Read here &rarr;</a>
        </div>
      `;
      }).join('');
    } catch {
      // API not available — keep static content
    }
  }

  // ——— Load Videos ———
  async function loadVideos() {
    const grid = document.querySelector('.webinars-grid');
    if (!grid) return;

    try {
      const res = await fetch(`${API}/videos`);
      const videos = await res.json();

      if (!videos.length) return;

      grid.innerHTML = videos.map((v) => `
        <div class="video-card" style="opacity:1;transform:none;"
             data-video-url="${escHtml(v.video_url || '')}"
             data-file-path="${escHtml(v.file_path || '')}"
             data-is-external="${v.is_external ? '1' : '0'}"
             data-video-title="${escHtml(v.title)}">
          <div class="thumbnail">
            ${v.thumbnail_url
              ? `<img src="${escHtml(v.thumbnail_url)}" alt="${escHtml(v.title)}" style="width:100%;height:100%;object-fit:cover;" />`
              : `<span class="placeholder-text">ION</span>`
            }
            <div class="play-button"></div>
          </div>
          <p class="video-title">${escHtml(v.title)}</p>
        </div>
      `).join('');

      initVideoPlayer();
    } catch {
      // API not available — keep static content
    }
  }

  function escHtml(str) {
    const el = document.createElement('span');
    el.textContent = str || '';
    return el.innerHTML;
  }

  // ——— Video Player ———
  function getEmbedUrl(url) {
    // YouTube
    let m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0`;
    // Vimeo
    m = url.match(/vimeo\.com\/(\d+)/);
    if (m) return `https://player.vimeo.com/video/${m[1]}?autoplay=1`;
    return url;
  }

  function initVideoPlayer() {
    const player = document.getElementById('videoPlayer');
    if (!player) return;

    const container = player.querySelector('.video-player-container');
    const titleEl = player.querySelector('.video-player-title');
    const closeBtn = player.querySelector('.video-player-close');

    document.querySelectorAll('.video-card').forEach((card) => {
      card.querySelector('.thumbnail').addEventListener('click', () => {
        const isExternal = card.dataset.isExternal === '1';
        const videoUrl = card.dataset.videoUrl;
        const filePath = card.dataset.filePath;
        const title = card.dataset.videoTitle;

        titleEl.textContent = title || 'Now Playing';

        if (isExternal && videoUrl) {
          container.innerHTML = `<iframe src="${getEmbedUrl(videoUrl)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
        } else if (filePath) {
          container.innerHTML = `<video controls autoplay><source src="${filePath}" type="video/mp4">Your browser does not support video.</video>`;
        } else {
          // No video source available
          container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-family:var(--font-body);">Video coming soon</div>`;
        }

        player.style.display = 'block';
        player.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });

    closeBtn.addEventListener('click', () => {
      player.style.display = 'none';
      container.innerHTML = '';
    });
  }

  // Init — try to load from API, gracefully fall back to static content
  loadArticles();
  loadVideos();

  // Also init player for static cards (when API is unavailable)
  initVideoPlayer();
})();
