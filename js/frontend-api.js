/* ========================================
   ION — Frontend API Integration
   Connects the public site to the backend
   ======================================== */

(() => {
  'use strict';

  const API = '/api';

  // ——— Newsletter Subscribe ———
  const form = document.getElementById('subscribe-form');
  const msgEl = document.getElementById('subscribe-message');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('subscribe-email').value;
      msgEl.style.color = '#6b7a8d';
      msgEl.textContent = 'Subscribing...';

      try {
        const res = await fetch(`${API}/subscribers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        msgEl.style.color = '#2d8a4e';
        msgEl.textContent = data.message || 'Successfully subscribed!';
        form.reset();
      } catch {
        msgEl.style.color = '#c0564a';
        msgEl.textContent = 'Something went wrong. Please try again.';
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

      grid.innerHTML = articles.slice(0, 3).map((a) => `
        <div class="card journal-card is-visible" style="opacity:1;transform:none;">
          <span class="category">${escHtml(a.category)}</span>
          <h3>${escHtml(a.title)}</h3>
          <p class="summary">${escHtml(a.summary)}</p>
          <a href="${a.is_external ? escHtml(a.external_url) : '#'}" class="read-link" ${a.is_external ? 'target="_blank" rel="noopener"' : ''}>Read here &rarr;</a>
        </div>
      `).join('');
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
