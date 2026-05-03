(function () {
  const tbody = document.getElementById('builds-list');

  function formatSize(bytes) {
    if (!bytes && bytes !== 0) return '-';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return mb.toFixed(1) + ' MB';
    const kb = bytes / 1024;
    return kb.toFixed(1) + ' KB';
  }

  function formatDate(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  function renderEmpty(message, isError) {
    tbody.innerHTML = `<tr><td colspan="4" class="state">${escapeHtml(message)}</td></tr>`;
  }

  function renderBuilds(builds) {
    if (!builds || builds.length === 0) {
      renderEmpty('Belum ada build yang dipublikasikan.');
      return;
    }
    tbody.innerHTML = builds.map(b => `
      <tr>
        <td class="version-cell">${escapeHtml(b.version || '?')}</td>
        <td class="size-cell">${formatSize(b.size)}</td>
        <td class="date-cell">${formatDate(b.published_at)}</td>
        <td><a class="download-btn" href="${escapeHtml(b.download_url)}">↓ APK</a></td>
      </tr>
    `).join('');
  }

  fetch('latest.json', { cache: 'no-cache' })
    .then(res => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(data => renderBuilds(data.builds))
    .catch(err => {
      console.error(err);
      renderEmpty('Gagal memuat daftar build. Coba refresh atau cek repository di GitHub.', true);
    });
})();
