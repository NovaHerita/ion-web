(() => {
  'use strict';

  const API = '/api';

  let token = localStorage.getItem('ion_token');

  // ——— Helpers ———
  function headers(extra = {}) {
    const h = { 'Content-Type': 'application/json', ...extra };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }

  async function api(path, options = {}) {
    const res = await fetch(`${API}${path}`, {
      headers: headers(),
      ...options,
    });
    if (res.status === 401) { logout(); throw new Error('Unauthorized'); }
    return res.json();
  }

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // ——— Auth ———
  function showScreen(id) {
    $$('.screen').forEach((s) => s.classList.remove('active'));
    $(`#${id}`).classList.add('active');
  }

  async function checkAuth() {
    if (!token) return showScreen('login-screen');
    try {
      const { valid } = await api('/auth/verify');
      if (valid) { showScreen('dashboard'); loadAll(); }
      else { logout(); }
    } catch { logout(); }
  }

  function logout() {
    token = null;
    localStorage.removeItem('ion_token');
    showScreen('login-screen');
  }

  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('#login-email').value;
    const password = $('#login-password').value;
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      token = data.token;
      localStorage.setItem('ion_token', token);
      $('#login-error').textContent = '';
      showScreen('dashboard');
      loadAll();
    } catch {
      $('#login-error').textContent = 'Invalid email or password';
    }
  });

  $('#logout-btn').addEventListener('click', logout);

  // ——— Tabs ———
  $$('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.nav-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      $$('.tab-panel').forEach((p) => p.classList.remove('active'));
      $(`#tab-${btn.dataset.tab}`).classList.add('active');
    });
  });

  // ——— Load All Data ———
  function loadAll() {
    loadArticles();
    loadVideos();
    loadSubscribers();
    loadNewsletterHistory();
  }

  // ——— ARTICLES ———
  let cachedArticles = [];

  async function loadArticles() {
    cachedArticles = await api('/articles/all');
    const list = $('#articles-list');

    if (cachedArticles.length === 0) {
      list.innerHTML = '<div class="empty-state">No articles yet. Click "+ New Article" to create one.</div>';
      return;
    }

    list.innerHTML = cachedArticles.map((a, i) => `
      <div class="list-item" data-article-id="${a.id}">
        <div class="list-item-order">
          <button class="order-btn" onclick="moveArticle(${a.id}, 'up')" ${i === 0 ? 'disabled' : ''} title="Move up">&#9650;</button>
          <button class="order-btn" onclick="moveArticle(${a.id}, 'down')" ${i === cachedArticles.length - 1 ? 'disabled' : ''} title="Move down">&#9660;</button>
        </div>
        <div class="list-item-info">
          <h4>${esc(a.title)}</h4>
          <p>
            <span class="badge ${a.published ? 'badge-published' : 'badge-draft'}">${a.published ? 'Published' : 'Draft'}</span>
            ${a.is_external ? '<span class="badge badge-external">External</span>' : ''}
            ${esc(a.category)} &middot; ${formatDate(a.created_at)}
          </p>
        </div>
        <div class="list-item-actions">
          <button class="btn-edit" onclick="editArticle(${a.id})">Edit</button>
          <button class="btn-danger" onclick="deleteArticle(${a.id})">Delete</button>
        </div>
      </div>
    `).join('');
  }

  window.moveArticle = async (id, direction) => {
    const idx = cachedArticles.findIndex((a) => a.id === id);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= cachedArticles.length) return;

    [cachedArticles[idx], cachedArticles[swapIdx]] = [cachedArticles[swapIdx], cachedArticles[idx]];

    const order = cachedArticles.map((a, i) => ({ id: a.id, sort_order: i }));
    await api('/articles/reorder', {
      method: 'PUT',
      body: JSON.stringify({ order }),
    });
    loadArticles();
  };

  $('#add-article-btn').addEventListener('click', () => {
    $('#article-modal-title').textContent = 'New Article';
    $('#article-form').reset();
    $('#article-id').value = '';
    $('#article-published').checked = true;
    setArticleType('custom');
    $('#article-modal').classList.add('open');
  });

  function setArticleType(type) {
    $$('[data-type]').forEach((b) => b.classList.toggle('active', b.dataset.type === type));
    $('#article-content-group').classList.toggle('hidden', type === 'external');
    $('#article-url-group').classList.toggle('hidden', type === 'custom');
  }

  $$('[data-type]').forEach((btn) => {
    btn.addEventListener('click', () => setArticleType(btn.dataset.type));
  });

  window.editArticle = async (id) => {
    const article = await api(`/articles/${id}`);
    $('#article-modal-title').textContent = 'Edit Article';
    $('#article-id').value = article.id;
    $('#article-title').value = article.title;
    $('#article-category').value = article.category;
    $('#article-summary').value = article.summary;
    $('#article-content').value = article.content;
    $('#article-url').value = article.external_url;
    $('#article-published').checked = !!article.published;
    setArticleType(article.is_external ? 'external' : 'custom');
    $('#article-modal').classList.add('open');
  };

  window.deleteArticle = async (id) => {
    if (!confirm('Delete this article?')) return;
    await api(`/articles/${id}`, { method: 'DELETE' });
    loadArticles();
  };

  $('#article-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $('#article-id').value;
    const isExternal = $$('[data-type].active')[0]?.dataset.type === 'external';

    const body = JSON.stringify({
      title: $('#article-title').value,
      category: $('#article-category').value,
      summary: $('#article-summary').value,
      content: $('#article-content').value,
      external_url: $('#article-url').value,
      is_external: isExternal,
      published: $('#article-published').checked,
    });

    if (id) {
      await api(`/articles/${id}`, { method: 'PUT', body });
    } else {
      await api('/articles', { method: 'POST', body });
    }

    $('#article-modal').classList.remove('open');
    loadArticles();
  });

  // ——— VIDEOS ———
  let cachedVideos = [];

  async function loadVideos() {
    cachedVideos = await api('/videos/all');
    const list = $('#videos-list');

    if (cachedVideos.length === 0) {
      list.innerHTML = '<div class="empty-state">No videos yet. Click "+ New Video" to add one.</div>';
      return;
    }

    list.innerHTML = cachedVideos.map((v, i) => `
      <div class="list-item" data-video-id="${v.id}">
        <div class="list-item-order">
          <button class="order-btn" onclick="moveVideo(${v.id}, 'up')" ${i === 0 ? 'disabled' : ''} title="Move up">&#9650;</button>
          <button class="order-btn" onclick="moveVideo(${v.id}, 'down')" ${i === cachedVideos.length - 1 ? 'disabled' : ''} title="Move down">&#9660;</button>
        </div>
        <div class="list-item-info">
          <h4>${esc(v.title)}</h4>
          <p>
            <span class="badge ${v.published ? 'badge-published' : 'badge-draft'}">${v.published ? 'Published' : 'Draft'}</span>
            ${v.is_external ? '<span class="badge badge-external">External</span>' : '<span class="badge" style="background:#f3e5f5;color:#7b1fa2;">Uploaded</span>'}
            &middot; ${formatDate(v.created_at)}
          </p>
        </div>
        <div class="list-item-actions">
          <button class="btn-edit" onclick="editVideo(${v.id})">Edit</button>
          <button class="btn-danger" onclick="deleteVideo(${v.id})">Delete</button>
        </div>
      </div>
    `).join('');
  }

  window.moveVideo = async (id, direction) => {
    const idx = cachedVideos.findIndex((v) => v.id === id);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= cachedVideos.length) return;

    [cachedVideos[idx], cachedVideos[swapIdx]] = [cachedVideos[swapIdx], cachedVideos[idx]];

    const order = cachedVideos.map((v, i) => ({ id: v.id, sort_order: i }));
    await api('/videos/reorder', {
      method: 'PUT',
      body: JSON.stringify({ order }),
    });
    loadVideos();
  };

  let currentVideoType = 'link';

  $('#add-video-btn').addEventListener('click', () => {
    $('#video-modal-title').textContent = 'New Video';
    $('#video-form').reset();
    $('#video-id').value = '';
    $('#video-published').checked = true;
    setVideoType('link');
    $('#video-modal').classList.add('open');
  });

  function setVideoType(type) {
    currentVideoType = type;
    $$('[data-video-type]').forEach((b) => b.classList.toggle('active', b.dataset.videoType === type));
    $('#video-url-group').classList.toggle('hidden', type === 'upload');
    $('#video-file-group').classList.toggle('hidden', type === 'link');
  }

  $$('[data-video-type]').forEach((btn) => {
    btn.addEventListener('click', () => setVideoType(btn.dataset.videoType));
  });

  window.editVideo = async (id) => {
    const videos = await api('/videos/all');
    const video = videos.find((v) => v.id === id);
    if (!video) return;

    $('#video-modal-title').textContent = 'Edit Video';
    $('#video-id').value = video.id;
    $('#video-title').value = video.title;
    $('#video-description').value = video.description || '';
    $('#video-url').value = video.video_url || '';
    $('#video-thumbnail').value = video.thumbnail_url || '';
    $('#video-published').checked = !!video.published;
    setVideoType(video.is_external ? 'link' : 'upload');
    $('#video-modal').classList.add('open');
  };

  window.deleteVideo = async (id) => {
    if (!confirm('Delete this video?')) return;
    await api(`/videos/${id}`, { method: 'DELETE' });
    loadVideos();
  };

  $('#video-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $('#video-id').value;

    if (currentVideoType === 'upload' && !id) {
      // File upload
      const formData = new FormData();
      formData.append('video', $('#video-file').files[0]);
      formData.append('title', $('#video-title').value);
      formData.append('description', $('#video-description').value);
      formData.append('thumbnail_url', $('#video-thumbnail').value);
      formData.append('published', $('#video-published').checked);

      await fetch(`${API}/videos/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    } else {
      const body = JSON.stringify({
        title: $('#video-title').value,
        description: $('#video-description').value,
        video_url: $('#video-url').value,
        thumbnail_url: $('#video-thumbnail').value,
        published: $('#video-published').checked,
      });

      if (id) {
        await api(`/videos/${id}`, { method: 'PUT', body });
      } else {
        await api('/videos', { method: 'POST', body });
      }
    }

    $('#video-modal').classList.remove('open');
    loadVideos();
  });

  // ——— SUBSCRIBERS ———
  async function loadSubscribers() {
    const data = await api('/subscribers');
    const list = $('#subscribers-list');
    const statsEl = $('#subscriber-stats');

    statsEl.innerHTML = `
      <div class="stat-card"><div class="stat-num">${data.stats.total}</div><div class="stat-label">Total</div></div>
      <div class="stat-card"><div class="stat-num">${data.stats.active}</div><div class="stat-label">Active</div></div>
      <div class="stat-card"><div class="stat-num">${data.stats.unsubscribed}</div><div class="stat-label">Unsubscribed</div></div>
    `;

    if (data.subscribers.length === 0) {
      list.innerHTML = '<div class="empty-state">No subscribers yet.</div>';
      return;
    }

    list.innerHTML = data.subscribers.map((s) => `
      <div class="list-item">
        <div class="list-item-info">
          <h4>${esc(s.email)}</h4>
          <p>
            <span class="badge ${s.subscribed ? 'badge-active' : 'badge-unsub'}">${s.subscribed ? 'Active' : 'Unsubscribed'}</span>
            Joined ${formatDate(s.subscribed_at)}
          </p>
        </div>
        <div class="list-item-actions">
          <button class="btn-danger" onclick="deleteSubscriber(${s.id})">Remove</button>
        </div>
      </div>
    `).join('');
  }

  window.deleteSubscriber = async (id) => {
    if (!confirm('Remove this subscriber?')) return;
    await api(`/subscribers/${id}`, { method: 'DELETE' });
    loadSubscribers();
  };

  // ——— NEWSLETTER ———
  async function loadNewsletterHistory() {
    const newsletters = await api('/newsletter/history');
    const list = $('#newsletter-history-list');

    if (newsletters.length === 0) {
      list.innerHTML = '<div class="empty-state">No newsletters sent yet.</div>';
      return;
    }

    list.innerHTML = newsletters.map((n) => `
      <div class="history-item">
        <h4>${esc(n.subject)}</h4>
        <p>Sent to ${n.sent_to_count} subscribers &middot; ${formatDate(n.sent_at)}</p>
      </div>
    `).join('');
  }

  $('#newsletter-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const statusEl = $('#newsletter-status');

    if (!confirm('Send this newsletter to ALL active subscribers?')) return;

    statusEl.textContent = 'Sending...';
    statusEl.className = 'status-message';

    try {
      const result = await api('/newsletter/send', {
        method: 'POST',
        body: JSON.stringify({
          subject: $('#newsletter-subject').value,
          body: $('#newsletter-body').value,
        }),
      });

      statusEl.textContent = `Sent to ${result.sent} of ${result.total} subscribers.`;
      statusEl.className = 'status-message success';
      loadNewsletterHistory();
    } catch (err) {
      statusEl.textContent = `Error: ${err.message}`;
      statusEl.className = 'status-message error';
    }
  });

  $('#newsletter-test-btn').addEventListener('click', async () => {
    const statusEl = $('#newsletter-status');
    const testEmail = prompt('Send test email to:');
    if (!testEmail) return;

    statusEl.textContent = 'Sending test...';
    statusEl.className = 'status-message';

    try {
      const result = await api('/newsletter/test', {
        method: 'POST',
        body: JSON.stringify({
          subject: $('#newsletter-subject').value,
          body: $('#newsletter-body').value,
          testEmail,
        }),
      });
      statusEl.textContent = result.message;
      statusEl.className = 'status-message success';
    } catch (err) {
      statusEl.textContent = `Error: ${err.message}`;
      statusEl.className = 'status-message error';
    }
  });

  // ——— Modal close ———
  $$('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      $(`#${btn.dataset.close}`).classList.remove('open');
    });
  });

  // Close modal on backdrop click
  $$('.modal').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  });

  // ——— Utility ———
  function esc(str) {
    const el = document.createElement('span');
    el.textContent = str || '';
    return el.innerHTML;
  }

  // ——— Init ———
  checkAuth();
})();
