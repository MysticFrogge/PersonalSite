function updateClock() {
  const clockElement = document.getElementById('clock');
  if (!clockElement) return;

  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  clockElement.textContent = now.toLocaleTimeString([], options);
}

updateClock();
setInterval(updateClock, 1000);

// WINDOWS
function createWindow(opts) {
  const { id, title = 'Window', content = '', x = 60, y = 60, width = 480, height = 360, fitContent = false } = opts;
  const windowsRoot = document.getElementById('windows');
  if (!windowsRoot) return;

  // DO NOT TOUCH, FOR THE LOVE OF ALL THAT IS HOLY
  const existing = document.getElementById(id);
  if (existing) {
    existing.style.zIndex = getNextZ();
    return existing;
  }

  const win = document.createElement('div');
  win.className = 'win95-window';
  win.id = id;
  win.style.left = x + 'px';
  win.style.top = y + 'px';
  win.style.width = width + 'px';
  win.style.height = height + 'px';
  win.style.zIndex = getNextZ();

  win.innerHTML = `
    <div class="win95-titlebar" role="toolbar" aria-label="${title} window controls">
      <div class="title-left"><div class="title-text">${title}</div></div>
      <div class="title-buttons">
        <div class="win95-btn win95-max" aria-label="Maximize">▢</div>
        <div class="win95-btn win95-close" aria-label="Close">✖</div>
      </div>
    </div>
    <div class="win95-content">${content}</div>
    <div class="win95-resize" aria-hidden="true"></div>
  `;

  windowsRoot.appendChild(win);

  // Win buttons
  const btnClose = win.querySelector('.win95-close');
  const btnMax = win.querySelector('.win95-max');
  const contentEl = win.querySelector('.win95-content');

  btnClose.addEventListener('click', (e) => { e.stopPropagation(); closeWindow(id); });
  btnClose.addEventListener('dblclick', (e) => { e.stopPropagation(); });

  // Maximize
  btnMax.addEventListener('click', (e) => { e.stopPropagation(); toggleMaximize(win); });
  btnMax.addEventListener('dblclick', (e) => { e.stopPropagation(); });

  // Click = Bring to front
  win.addEventListener('mousedown', () => { win.style.zIndex = getNextZ(); });

  const titlebar = win.querySelector('.win95-titlebar');

  // Drag window
  let dragging = false;
  let startX = 0, startY = 0, origLeft = 0, origTop = 0;
  function toNumber(px) { return parseInt(px || '0', 10); }
  titlebar.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('.title-buttons')) return;
    if (win.classList.contains('maximized')) return;
    dragging = true;
    titlebar.setPointerCapture(e.pointerId);
    win.classList.add('dragging');
    startX = e.clientX; startY = e.clientY;
    origLeft = toNumber(win.style.left);
    origTop = toNumber(win.style.top);
    const move = (ev) => {
      if (!dragging) return;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      // Prevent dragging above the top of the window to keep close button visible
      const newTop = Math.max(0, origTop + dy);
      win.style.left = (origLeft + dx) + 'px';
      win.style.top = newTop + 'px';
    };
    const up = (ev) => {
      dragging = false;
      win.classList.remove('dragging');
      titlebar.releasePointerCapture(e.pointerId);
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      win.dataset.prevLeft = win.style.left;
      win.dataset.prevTop = win.style.top;
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  });

  // Resize support (bottom-right corner)
  const resizeEl = win.querySelector('.win95-resize');
  if (resizeEl) {
    resizeEl.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      if (win.classList.contains('maximized')) return;
      e.stopPropagation();
      resizeEl.setPointerCapture(e.pointerId);
      const startX = e.clientX, startY = e.clientY;
      const startRect = win.getBoundingClientRect();
      const startWidth = startRect.width, startHeight = startRect.height;
      const minWidth = 160, minHeight = 80;
      const move = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        const newW = Math.max(minWidth, Math.round(startWidth + dx));
        const newH = Math.max(minHeight, Math.round(startHeight + dy));
        win.style.width = newW + 'px';
        win.style.height = newH + 'px';
      };
      const up = (ev) => {
        try { resizeEl.releasePointerCapture(e.pointerId); } catch (_) {}
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        win.dataset.prevWidth = win.style.width;
        win.dataset.prevHeight = win.style.height;
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    });
  }

  if (fitContent && contentEl) {
    requestAnimationFrame(() => {
      const desiredWidth = Math.max(width, Math.ceil(contentEl.scrollWidth + 24));
      const desiredHeight = Math.max(height, Math.ceil(contentEl.scrollHeight + 28 + 16));
      const maxWidth = Math.max(240, window.innerWidth - 32);
      // Account for the window's vertical position to ensure bottom stays visible
      const maxHeight = Math.max(160, window.innerHeight - y - 48);
      win.style.width = Math.min(desiredWidth, maxWidth) + 'px';
      win.style.height = Math.min(desiredHeight, maxHeight) + 'px';
    });
  }

  return win;
}

function closeWindow(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

//I did not write any of this
function toggleMaximize(winEl) {
  if (!winEl) return;
  const isMax = !winEl.classList.contains('maximized');
  if (isMax) {
    // store previous geometry and positioning
    winEl.dataset.prevLeft = winEl.style.left;
    winEl.dataset.prevTop = winEl.style.top;
    winEl.dataset.prevWidth = winEl.style.width;
    winEl.dataset.prevHeight = winEl.style.height;
    winEl.dataset.prevPosition = winEl.style.position || getComputedStyle(winEl).position;
    // apply maximized state
    winEl.classList.add('maximized');
    // clear inline geometry so CSS fixed sizing applies
    winEl.style.left = '';
    winEl.style.top = '';
    winEl.style.width = '';
    winEl.style.height = '';
  } else {
    // restore previous geometry and positioning
    winEl.classList.remove('maximized');
    winEl.style.position = winEl.dataset.prevPosition || 'absolute';
    winEl.style.left = winEl.dataset.prevLeft || '60px';
    winEl.style.top = winEl.dataset.prevTop || '60px';
    winEl.style.width = winEl.dataset.prevWidth || '480px';
    winEl.style.height = winEl.dataset.prevHeight || '360px';
    // cleanup stored values
    delete winEl.dataset.prevPosition;
  }
}
//do not ask me what it does. I will not know.


let zIndexCounter = 1000;
function getNextZ() { return ++zIndexCounter; }

//desktop icons
function parseWindowData(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Invalid window data', e);
    return null;
  }
}

function getWindowContent(cfg) {
  if (cfg.contentId) {
    const tpl = document.getElementById(cfg.contentId);
    if (tpl instanceof HTMLTemplateElement) return tpl.innerHTML;
  }
  return cfg.content || '';
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('click', () => {
      const cfg = parseWindowData(icon.dataset.window);
      if (!cfg) return;
      createWindow({
        id: cfg.id,
        title: cfg.title,
        content: getWindowContent(cfg),
        fitContent: Boolean(cfg.contentId),
      });
    });

    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') icon.click();
    });
  });

  const initialIcon = document.querySelector('.icon[data-window*="site-navigation"]');
  if (initialIcon) initialIcon.click();
});

