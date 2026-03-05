const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

/* ── Tabs ── */

const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    tabContents.forEach((c) => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

/* ── Banner generation (existing) ── */

const form = document.getElementById('movie-form');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');
const previewEl = document.getElementById('preview');
const downloadLink = document.getElementById('download-link');
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const submitBtn = document.getElementById('submit-btn');

function waitForImage(url, maxAttempts = 12, delay = 2500) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    function attempt() {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        attempts++;
        if (attempts >= maxAttempts) {
          reject(new Error('Изображение недоступно'));
        } else {
          setTimeout(attempt, delay);
        }
      };
      img.src = url + '?t=' + Date.now();
    }
    attempt();
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const movieName = String(formData.get('movieName') || '').trim();

  if (!movieName) {
    statusEl.textContent = 'Введите название фильма.';
    return;
  }

  submitBtn.disabled = true;
  statusEl.textContent = 'Генерируем баннер...';
  resultEl.classList.add('hidden');

  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error('Некорректный ответ сервера');
    }

    if (!data.imageUrl) {
      throw new Error('Нет imageUrl');
    }

    statusEl.textContent = 'Загружаем изображение...';
    await waitForImage(data.imageUrl);

    previewEl.src = data.imageUrl;
    modalImage.src = data.imageUrl;
    downloadLink.href = data.imageUrl;
    resultEl.classList.remove('hidden');
    statusEl.textContent = 'Готово!';
  } catch (error) {
    statusEl.textContent = 'Возникла ошибка при генерации, попробуйте ещё раз';
  } finally {
    submitBtn.disabled = false;
  }
});

previewEl.addEventListener('click', () => {
  if (typeof modal.showModal === 'function') {
    modal.showModal();
  }
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.close();
  }
});

/* ── Semantics generation ── */

const semForm = document.getElementById('semantics-form');
const semStatusEl = document.getElementById('semantics-status');
const semResultEl = document.getElementById('semantics-result');
const semMovieEl = document.getElementById('sem-movie');
const semCountEl = document.getElementById('sem-count');
const semLinkEl = document.getElementById('sem-spreadsheet-link');
const semBtn = document.getElementById('semantics-btn');
const semDebugEl = document.getElementById('semantics-debug');

semForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(semForm);
  const movieName = String(formData.get('movieName') || '').trim();

  if (!movieName) {
    semStatusEl.textContent = 'Введите название фильма.';
    return;
  }

  semBtn.disabled = true;
  semStatusEl.textContent = 'Генерируем семантику...';
  semResultEl.classList.add('hidden');
  semDebugEl.classList.add('hidden');

  try {
    const response = await fetch('/api/generate-semantics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieName }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error('Некорректный ответ сервера');
    }

    semDebugEl.textContent = JSON.stringify(data, null, 2);
    semDebugEl.classList.remove('hidden');

    if (!response.ok) {
      throw new Error(data?.error || `HTTP ${response.status}`);
    }

    if (!data.spreadsheet_url) {
      throw new Error('Нет spreadsheet_url');
    }

    semMovieEl.textContent = data.movie || movieName;
    semCountEl.textContent = data.keywords_total ?? '—';
    semLinkEl.href = data.spreadsheet_url;
    semResultEl.classList.remove('hidden');
    semStatusEl.textContent = 'Готово!';
  } catch (error) {
    semStatusEl.textContent = `Ошибка: ${error.message}`;
  } finally {
    semBtn.disabled = false;
  }
});
