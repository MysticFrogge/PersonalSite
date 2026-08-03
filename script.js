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

// =====================================================
// FOLDER TREE DATA
// To add a subfolder: add a `children` array to any folder.
// To add a .txt file: add an object with type:'txt', name, and content.
//   Example:
//   { type: 'txt', name: 'readme.txt', content: 'Hello!\nThis is my note.' }
// =====================================================
const FOLDER_TREE = {
  id: 'root',
  name: 'My Projects',
  icon: 'img/MyProjectsLogo.png',
  children: [
    {
      id: 'School projects',
      name: 'School projects',
      icon: 'img/MyProjectsLogo.png',
      children: [

        {
          id: 'Intel sustainability site',
          name: 'Intel sustainability site',
          icon: 'img/MyProjectsLogo.png',
          children: [
            {
              type: 'txt',
              name: 'Project_Summary.txt',
              content: 'Intel Sustainability Site\n-------------------------\nThis was a' +
              'project for a career accelerator program\nwhere I built a website about Intel\'s' +
              'sustainability\ninitiatives over the years.\n\nBuilt with: HTML, CSS, JavaScript, *AI*\nDate: 2026',
            },
            {
              type: 'img',
              name: 'Intel-main.jpg',
              src: 'Project-files/intel-sustainability-site/intel-images/Intel-main.png',
            },
            {
              type: 'img',
              name: 'Intel-AR.jpg',
              src: 'Project-files/intel-sustainability-site/intel-images/intel-AR.png',
            },
            {
              type: 'img',
              name: 'Intel-tablet.jpg',
              src: 'Project-files/intel-sustainability-site/intel-images/intel-tablet.png',
            },
            {
              type: 'img',
              name: 'Intel-mobile.jpg',
              src: 'Project-files/intel-sustainability-site/intel-images/intel-mobile.png',
            },
            {
              type: 'img',
              name: 'Intel-1968.jpg',
              src: 'Project-files/intel-sustainability-site/intel-images/intel-1968.png',
            },
            {
              type: 'img',
              name: 'Intel-1971.jpg',
              src: 'Project-files/intel-sustainability-site/intel-images/intel-1971.png',
            },
            {
              type: 'img',
              name: 'Intel-1978.jpg',
              src: 'Project-files/intel-sustainability-site/intel-images/intel-1978.png',
            },
            {
              type: 'img',
              name: 'Intel-1985.jpg',
              src: 'Project-files/intel-sustainability-site/intel-images/intel-1985.png',
            },
            {
              type: 'img',
              name: 'Intel-2006.jpg',
              src: 'Project-files/intel-sustainability-site/intel-images/intel-2006.png',
            },
            {
              type: 'img',
              name: 'Intel-2020.jpg',
              src: 'Project-files/intel-sustainability-site/intel-images/intel-2020.png',
            },
            {
              type: 'img',
              name: 'Intel-2022.jpg',
              src: 'Project-files/intel-sustainability-site/intel-images/intel-2022.png',
            },
            {
              type: 'img',
              name: 'Intel-2023.jpg',
              src: 'Project-files/intel-sustainability-site/intel-images/intel-2023.png',
            },
            {
              type: 'img',
              name: 'Intel-2024.jpg',
              src: 'Project-files/intel-sustainability-site/intel-images/intel-2024.png',
            },
          ],
        },
        
        {
          id: 'Intel Check-In site',
          name: 'Intel Check-In site',
          icon: 'img/MyProjectsLogo.png',
          children: [
            {
              type: 'txt',
              name: 'Project_Summary.txt',
              content: 'Intel Check-In Site\n-------------------------\nThis was a' +
              'project for a career accelerator program\nwhere I built a website about Intel where users\ncan check in for an event under a team.\n\nBuilt with: HTML, CSS, JavaScript, *AI*\nDate: 2026',
            },
            {
              type: 'img',
              name: 'Main_Site.jpg',
              src: 'Project-files/Intel-check-in/Intel_check_in.png',
            }
          ]
        },

        {
          id: 'NASA space image site',
          name: 'NASA space image site',
          icon: 'img/MyProjectsLogo.png',
          children: [
            {
              type: 'txt',
              name: 'Project_Summary.txt',
              content: 'NASA space image site\n-------------------------\nThis was a' +
              'project for a career accelerator program\nwhere I built a website about NASA where users\ncan select a timeframe and get space images posted\nby NASA within that time.\n\nBuilt with: HTML, CSS, JavaScript, *AI*\nDate: 2026',
            },
            {
              type: 'img',
              name: 'Main_Site.jpg',
              src: 'Project-files/NASA_space_explore/NASA_space_explore.png',
            }
          ]
        },
      ],
    },
    // To add more folders or files, follow the patterns above.
  ],
};

// =====================================================
// EXPLORER STATE  (per-window; keyed by window id)
// =====================================================
const explorerStates = {};

function getExplorerState(winId) {
  if (!explorerStates[winId]) {
    explorerStates[winId] = {
      currentPath: [FOLDER_TREE],   // array of folder nodes from root → current
      history: [],                  // stack of paths for Back button
      expandedIds: new Set(['root']),
    };
  }
  return explorerStates[winId];
}

// Given a state, find the folder node we're currently looking at
function currentFolder(state) {
  return state.currentPath[state.currentPath.length - 1];
}

// =====================================================
// RENDER HELPERS
// =====================================================

// Renders either a custom <img> or an emoji span depending on the icon value.
// Pass context='tree' for the small left-pane icon, 'files' for the large right-pane icon.
function makeFolderIcon(iconValue, isSelected, context) {
  const isImage = iconValue && (iconValue.startsWith('img/') || iconValue.startsWith('/') || iconValue.startsWith('http') || iconValue.includes('.'));

  if (isImage) {
    const img = document.createElement('img');
    img.src = iconValue;
    img.alt = '';
    if (context === 'tree') {
      img.style.width = '16px';
      img.style.height = '16px';
      img.style.objectFit = 'contain';
      img.style.marginRight = '2px';
      img.style.flexShrink = '0';
    } else {
      img.className = 'explorer-folder-icon';
      img.style.width = '32px';
      img.style.height = '32px';
      img.style.objectFit = 'contain';
      img.style.display = 'block';
      img.style.marginBottom = '3px';
    }
    return img;
  }

  // Fallback: emoji
  const span = document.createElement('span');
  if (context === 'tree') {
    span.style.fontSize = '14px';
    span.style.marginRight = '2px';
    span.textContent = isSelected ? '📂' : (iconValue || '📁');
  } else {
    span.className = 'explorer-folder-icon';
    span.textContent = iconValue || '📁';
  }
  return span;
}

// Make the 📄 txt file icon for the right pane
function makeTxtFileIcon(context) {
  const img = document.createElement('img');
  img.src = 'img/notepad.png'; // ← your image path here
  img.alt = '';
  if (context === 'files') {
    img.style.width = '32px';
    img.style.height = '32px';
    img.style.objectFit = 'contain';
    img.style.display = 'block';
    img.style.marginBottom = '3px';
  } else {
    img.style.width = '16px';
    img.style.height = '16px';
    img.style.objectFit = 'contain';
    img.style.marginRight = '2px';
    img.style.flexShrink = '0';
  }
  return img;
}

function makeImgFileIcon(src, context) {
  const img = document.createElement('img');
  img.src = src; // ← use the actual image as its own icon
  img.alt = '';
  if (context === 'files') {
    img.style.width = '48px';
    img.style.height = '48px';
    img.style.objectFit = 'cover';
    img.style.display = 'block';
    img.style.marginBottom = '3px';
    img.style.border = '1px solid #808080';
  } else {
    img.style.width = '16px';
    img.style.height = '16px';
    img.style.objectFit = 'cover';
    img.style.marginRight = '2px';
    img.style.flexShrink = '0';
  }
  return img;
}

function renderTreeItem(node, depth, state, winEl) {
  const isSelected = currentFolder(state).id === node.id;
  const isExpanded = state.expandedIds.has(node.id);

  // Only folders appear in the tree; filter out txt files from children count
  const hasChildren = node.children && node.children.some(c => !c.type || (c.type !== 'txt' && c.type !== 'img'));

  const item = document.createElement('div');
  item.className = 'tree-item' + (isSelected ? ' tree-item--selected' : '');
  item.style.paddingLeft = (4 + depth * 16) + 'px';
  item.dataset.nodeId = node.id;

  // Arrow toggle
  const arrow = document.createElement('span');
  arrow.className = 'tree-arrow';
  arrow.textContent = hasChildren ? (isExpanded ? '▼' : '▶') : ' ';
  if (hasChildren) {
    arrow.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.expandedIds.has(node.id)) {
        state.expandedIds.delete(node.id);
      } else {
        state.expandedIds.add(node.id);
      }
      renderExplorer(winEl, state);
    });
  }

  // Folder icon
  const icon = makeFolderIcon(node.icon, isSelected, 'tree');

  // Label
  const label = document.createElement('span');
  label.textContent = node.name;

  item.appendChild(arrow);
  item.appendChild(icon);
  item.appendChild(label);

  // Click = navigate to this folder
  item.addEventListener('click', () => {
    navigateTo(winEl, state, node);
  });

  return item;
}

function renderTreeItems(parentNode, depth, state, winEl, container) {
  // Only render folders in the tree (skip txt files)
  if (parentNode.type === 'txt' || parentNode.type === 'img') return;

  const item = renderTreeItem(parentNode, depth, state, winEl);
  container.appendChild(item);

  if (state.expandedIds.has(parentNode.id) && parentNode.children) {
    for (const child of parentNode.children) {
      if (!child.type || child.type !== 'txt') {
        renderTreeItems(child, depth + 1, state, winEl, container);
      }
    }
  }
}

function renderExplorer(winEl, state) {
  const treeBody = winEl.querySelector('#explorer-tree-body');
  const filesEl = winEl.querySelector('#explorer-files');
  const statusEl = winEl.querySelector('#explorer-status');
  const addressEl = winEl.querySelector('#explorer-address');
  const backBtn = winEl.querySelector('#explorer-back');

  if (!treeBody || !filesEl || !statusEl || !addressEl || !backBtn) return;

  const folder = currentFolder(state);

  // --- Address bar ---
  const pathNames = state.currentPath.map(f => f.name).join(' \\ ');
  addressEl.textContent = pathNames;

  // --- Back button ---
  backBtn.disabled = state.history.length === 0;

  // --- Tree ---
  const ancestors = state.currentPath.slice(0, -1);
  for (const node of ancestors) {
    state.expandedIds.add(node.id);
  }

  treeBody.innerHTML = '';
  renderTreeItems(FOLDER_TREE, 0, state, winEl, treeBody);

  // --- Files pane ---
  filesEl.innerHTML = '';

  const children = folder.children || [];

  if (children.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'explorer-empty';
    empty.innerHTML = `
      <div class="explorer-empty-icon">📁</div>
      <div>This folder is empty.</div>
      <div class="explorer-empty-sub">Check back later! :^)</div>
    `;
    filesEl.appendChild(empty);
    statusEl.textContent = '0 object(s)';
  } else {
    let selected = null;

    children.forEach(child => {
      const isTxt = child.type === 'txt';
      const isImg = child.type === 'img';
      const item = document.createElement('div');
      item.className = 'explorer-folder-item';

      const iconEl = isTxt
        ? makeTxtFileIcon('files')
        : isImg
          ? makeImgFileIcon(child.src, 'files')
          : makeFolderIcon(child.icon, false, 'files');

      const labelEl = document.createElement('div');
      labelEl.className = 'explorer-folder-label';
      labelEl.textContent = child.name;

      item.appendChild(iconEl);
      item.appendChild(labelEl);

      // Single click = select
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        if (selected) selected.classList.remove('explorer-folder-item--selected');
        selected = item;
        item.classList.add('explorer-folder-item--selected');
        statusEl.textContent = `1 object(s) selected`;
      });

      // Double-click: open txt in notepad, or navigate into folder
      item.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        if (isTxt) {
          openNotepad(child.name, child.content);
        } else if (isImg) {
          openImageViewer(child.name, child.src);
        } else {
          navigateTo(winEl, state, child);
        }
      });

      filesEl.appendChild(item);
    });

    // Click on empty space in files pane = deselect
    filesEl.addEventListener('click', () => {
      if (selected) {
        selected.classList.remove('explorer-folder-item--selected');
        selected = null;
        statusEl.textContent = `${children.length} object(s)`;
      }
    });

    statusEl.textContent = `${children.length} object(s)`;
  }
}

function navigateTo(winEl, state, node) {
  const folder = currentFolder(state);
  if (folder.id === node.id) return; // already here

  // Push current path to history before navigating
  state.history.push([...state.currentPath]);

  // Build new path
  const newPath = findPathToNode(FOLDER_TREE, node.id);
  if (newPath) {
    state.currentPath = newPath;
    state.expandedIds.add(node.id);
  }

  renderExplorer(winEl, state);
}

function navigateBack(winEl, state) {
  if (state.history.length === 0) return;
  state.currentPath = state.history.pop();
  renderExplorer(winEl, state);
}

// DFS to find the path from root to a node by id
function findPathToNode(root, targetId, pathSoFar = []) {
  const current = [...pathSoFar, root];
  if (root.id === targetId) return current;
  for (const child of (root.children || [])) {
    if (child.type === 'txt') continue; // txt files don't have ids for nav
    const result = findPathToNode(child, targetId, current);
    if (result) return result;
  }
  return null;
}

// =====================================================
// NOTEPAD VIEWER
// =====================================================
let notepadCounter = 0;

function openNotepad(filename, content) {
  notepadCounter++;
  const id = 'notepad-' + notepadCounter;

  // Escape HTML entities so raw text is safe
  const escaped = (content || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const notepadHTML = `
    <div class="notepad-shell">
      <div class="notepad-body">
        <pre class="notepad-text">${escaped}</pre>
      </div>
    </div>
  `;

  createWindow({
    id,
    title: filename + ' - Notepad',
    content: notepadHTML,
    x: 80 + (notepadCounter % 6) * 24,
    y: 60 + (notepadCounter % 6) * 24,
    width: 440,
    height: 300,
    fitContent: false,
  });
}

let imgViewerCounter = 0;

function openImageViewer(filename, src) {
  imgViewerCounter++;
  const id = 'imgviewer-' + imgViewerCounter;

  const html = `
    <div class="imgviewer-shell">
      <img class="imgviewer-img" src="${src}" alt="${filename}">
    </div>
    <div class="imgviewer-statusbar">
      <span class="imgviewer-status-text">Drag bottom-right corner to resize</span>
      <div class="imgviewer-resize-hint">↔</div>
    </div>
  `;

  createWindow({
    id,
    title: filename,
    content: html,
    x: 100 + (imgViewerCounter % 6) * 28,
    y: 80 + (imgViewerCounter % 6) * 28,
    width: 520,
    height: 400,
    fitContent: false,
  });
}

// =====================================================
// WINDOWS
// =====================================================
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

  if (fitContent) {
    const contentEl = win.querySelector('.win95-content');
    if (contentEl) {
      requestAnimationFrame(() => {
        const desiredWidth = Math.max(width, Math.ceil(contentEl.scrollWidth + 24));
        const desiredHeight = Math.max(height, Math.ceil(contentEl.scrollHeight + 28 + 16));
        const maxWidth = Math.max(240, window.innerWidth - 32);
        const maxHeight = Math.max(160, window.innerHeight - y - 48);
        win.style.width = Math.min(desiredWidth, maxWidth) + 'px';
        win.style.height = Math.min(desiredHeight, maxHeight) + 'px';
      });
    }
  }

  return win;
}

function closeWindow(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
  // Clean up state
  delete explorerStates[id];
}

//I did not write any of this
function toggleMaximize(winEl) {
  if (!winEl) return;
  const isMax = !winEl.classList.contains('maximized');
  if (isMax) {
    winEl.dataset.prevLeft = winEl.style.left;
    winEl.dataset.prevTop = winEl.style.top;
    winEl.dataset.prevWidth = winEl.style.width;
    winEl.dataset.prevHeight = winEl.style.height;
    winEl.dataset.prevPosition = winEl.style.position || getComputedStyle(winEl).position;
    winEl.classList.add('maximized');
    winEl.style.left = '';
    winEl.style.top = '';
    winEl.style.width = '';
    winEl.style.height = '';
  } else {
    winEl.classList.remove('maximized');
    winEl.style.position = winEl.dataset.prevPosition || 'absolute';
    winEl.style.left = winEl.dataset.prevLeft || '60px';
    winEl.style.top = winEl.dataset.prevTop || '60px';
    winEl.style.width = winEl.dataset.prevWidth || '480px';
    winEl.style.height = winEl.dataset.prevHeight || '360px';
    delete winEl.dataset.prevPosition;
  }
}
//do not ask me what it does. I will not know.

let zIndexCounter = 1000;
function getNextZ() { return ++zIndexCounter; }

// =====================================================
// DESKTOP ICONS
// =====================================================
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

      const win = createWindow({
        id: cfg.id,
        title: cfg.title,
        content: getWindowContent(cfg),
        fitContent: Boolean(cfg.contentId),
      });

      // If this is the explorer window, initialize and render it
      if (cfg.id === 'my-projects' && win) {
        // Wait one frame for DOM to settle after fitContent resize
        requestAnimationFrame(() => {
          const state = getExplorerState(cfg.id);

          // Wire up the Back button
          const backBtn = win.querySelector('#explorer-back');
          if (backBtn) {
            backBtn.addEventListener('click', () => navigateBack(win, state));
          }

          renderExplorer(win, state);
        });
      }
    });

    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') icon.click();
    });
  });

  const initialIcon = document.querySelector('.icon[data-window*="site-navigation"]');
  if (initialIcon) initialIcon.click();
});