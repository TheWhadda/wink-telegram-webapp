const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const form = document.getElementById('movie-form');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');
const previewEl = document.getElementById('preview');
const downloadLink = document.getElementById('download-link');
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const submitBtn = document.getElementById('submit-btn');

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
