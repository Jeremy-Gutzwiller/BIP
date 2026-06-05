// HubSpot Custom Fields Prototype, app.js
// State lives in URL hash so column selections are shareable.

const DEFAULT_KEYS = FIELDS.filter(f => f.defaultVisible).map(f => f.key);
const PINNED_KEYS = FIELDS.filter(f => f.pinned).map(f => f.key);
const TOTAL_TOGGLEABLE = FIELDS.filter(f => !f.pinned).length;
const HAVE_TODAY_KEYS = FIELDS.filter(f => !f.pinned && (f.availability === 'exposed' || f.availability === 'synced_today')).map(f => f.key);

let visibleKeys = new Set(DEFAULT_KEYS);
let records = [];

// -------- Persistence (URL hash) --------

function readHashState() {
  const hash = window.location.hash;
  if (!hash.startsWith('#cols=')) return null;
  const csv = hash.slice('#cols='.length);
  if (!csv) return null;
  return csv.split(',').filter(k => FIELDS.some(f => f.key === k));
}

function writeHashState() {
  const togglable = Array.from(visibleKeys).filter(k => !PINNED_KEYS.includes(k));
  if (togglable.length === 0) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  } else {
    history.replaceState(null, '', '#cols=' + togglable.join(','));
  }
}

function applyDefaults() {
  visibleKeys = new Set(DEFAULT_KEYS);
  writeHashState();
}

function applyHaveToday() {
  visibleKeys = new Set([...PINNED_KEYS, ...DEFAULT_KEYS, ...HAVE_TODAY_KEYS]);
  writeHashState();
}

function initStateFromHash() {
  const fromHash = readHashState();
  if (fromHash && fromHash.length > 0) {
    visibleKeys = new Set([...PINNED_KEYS, ...fromHash]);
  } else {
    visibleKeys = new Set(DEFAULT_KEYS);
  }
}

// -------- Formatters --------

function fmtValue(value, field) {
  if (value === null || value === undefined || value === '') {
    return '<span class="placeholder">—</span>';
  }
  const f = field.formatter || field.type;
  switch (f) {
    case 'company':
      return `<div class="font-medium text-slate-800">${escapeHtml(value)}</div>`;
    case 'string':
      return escapeHtml(String(value));
    case 'number':
      return `<span class="tabular-nums">${Number(value).toLocaleString()}</span>`;
    case 'currency':
      return `<span class="tabular-nums">$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>`;
    case 'score':
      return `<span class="tabular-nums font-medium">${Number(value).toFixed(2)}</span>`;
    case 'date': {
      const d = new Date(value);
      if (isNaN(d)) return escapeHtml(String(value));
      return `<span title="${d.toISOString().slice(0, 10)}">${relativeDate(d)}</span>`;
    }
    case 'datetime': {
      const d = new Date(value);
      if (isNaN(d)) return escapeHtml(String(value));
      return `<span title="${d.toISOString()}">${relativeDate(d)}</span>`;
    }
    case 'boolean': {
      const truthy = value === true || value === 'true';
      return `<span class="chip ${truthy ? 'chip-bool-true' : 'chip-bool-false'}">${truthy ? '✓ Yes' : '— No'}</span>`;
    }
    case 'activity_badge': {
      const v = String(value).toLowerCase();
      return `<span class="chip chip-${v}">${v.charAt(0).toUpperCase()}${v.slice(1)}</span>`;
    }
    case 'stage_badge': {
      const v = String(value).toLowerCase();
      return `<span class="chip chip-${v}">${v.charAt(0).toUpperCase()}${v.slice(1)}</span>`;
    }
    case 'chips': {
      const list = Array.isArray(value) ? value : String(value).split(',').map(s => s.trim());
      return list.filter(Boolean).map(v => `<span class="chip chip-list">${escapeHtml(v)}</span>`).join(' ');
    }
    case 'json':
      return `<details><summary class="text-sky-700 text-xs">view</summary><pre class="text-xs bg-slate-50 p-2 rounded mt-1 max-w-xs overflow-auto">${escapeHtml(JSON.stringify(value, null, 2))}</pre></details>`;
    case 'url':
      return `<a href="${escapeHtml(value)}" target="_blank" rel="noopener" class="text-sky-700 hover:underline text-xs truncate inline-block max-w-xs align-middle">${escapeHtml(value)}</a>`;
    case 'blob':
      return `<div class="blob-cell" title="${escapeHtml(String(value))}">${escapeHtml(String(value))}</div>`;
    default:
      return escapeHtml(String(value));
  }
}

function relativeDate(d) {
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff < 0) return d.toISOString().slice(0, 10);
  if (diff === 0) return 'today';
  if (diff === 1) return 'yesterday';
  if (diff < 30) return `${diff}d ago`;
  if (diff < 365) return `${Math.floor(diff / 30)}mo ago`;
  return d.toISOString().slice(0, 10);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function availabilityChip(field, size = 'sm') {
  const a = AVAILABILITY[field.availability];
  if (!a) return '';
  const sizeClass = size === 'xs' ? 'text-[10px]' : 'text-xs';
  return `<span class="chip ${a.chipClass} ${sizeClass}" title="${a.label}">${a.short}</span>`;
}

// -------- Table render --------

function renderTable() {
  const visibleFields = FIELDS.filter(f => visibleKeys.has(f.key));
  const head = document.getElementById('table-head');
  const body = document.getElementById('table-body');
  const empty = document.getElementById('empty-state');
  const container = document.getElementById('table-container');

  head.innerHTML = visibleFields.map((f, i) => {
    const sticky = i === 0 || f.pinned ? 'sticky-col' : '';
    const chip = f.availability === 'exposed' ? '' : ` ${availabilityChip(f)}`;
    const exposed = f.availability === 'exposed' && !f.pinned ? ' <span class="chip avail-exposed ml-1">8</span>' : '';
    return `<th class="${sticky} text-left px-3 py-2 border-b border-slate-200 whitespace-nowrap" title="${escapeHtml(f.section)}">${escapeHtml(f.label)}${exposed}${chip}</th>`;
  }).join('');

  if (records.length === 0) {
    body.innerHTML = '';
    container.classList.add('hidden');
    empty.classList.remove('hidden');
    return;
  }
  container.classList.remove('hidden');
  empty.classList.add('hidden');

  body.innerHTML = records.map(record => {
    return '<tr>' + visibleFields.map((f, i) => {
      const sticky = i === 0 || f.pinned ? 'sticky-col' : '';
      return `<td class="${sticky} px-3 py-2 border-b border-slate-100 align-top">${fmtValue(record[f.key], f)}</td>`;
    }).join('') + '</tr>';
  }).join('');

  const togglableVisible = visibleFields.filter(f => !f.pinned).length;
  document.getElementById('column-counter').textContent = `${togglableVisible} of ${TOTAL_TOGGLEABLE} columns`;
}

// -------- Column picker --------

function renderPicker(searchTerm = '') {
  const sections = document.getElementById('picker-sections');
  const groups = {};
  for (const f of FIELDS) {
    if (f.pinned) continue;
    if (searchTerm && !f.label.toLowerCase().includes(searchTerm.toLowerCase()) && !f.key.toLowerCase().includes(searchTerm.toLowerCase())) continue;
    (groups[f.sectionNumber] ||= []).push(f);
  }

  const html = SECTION_ORDER.filter(s => s.number > 0 && groups[s.number]).map(section => {
    const fields = groups[section.number];
    const checkedCount = fields.filter(f => visibleKeys.has(f.key)).length;
    return `
      <details ${searchTerm ? 'open' : (section.number === 1 ? 'open' : '')}>
        <summary class="text-sm font-semibold text-slate-700 py-1">
          ${section.label}
          <span class="text-xs text-slate-500 font-normal ml-1">(${checkedCount}/${fields.length})</span>
        </summary>
        <div class="pl-5 mt-1 space-y-1">
          ${fields.map(f => {
            const checked = visibleKeys.has(f.key) ? 'checked' : '';
            const chip = availabilityChip(f, 'xs');
            return `
              <label class="flex items-start gap-2 text-sm text-slate-700">
                <input type="checkbox" data-key="${f.key}" ${checked} class="picker-checkbox mt-0.5" />
                <span>
                  <span>${escapeHtml(f.label)}</span>
                  <span class="ml-2">${chip}</span>
                  <span class="block text-xs text-slate-400">${escapeHtml(f.key)}</span>
                </span>
              </label>
            `;
          }).join('')}
        </div>
      </details>
    `;
  }).join('');

  sections.innerHTML = html;

  document.querySelectorAll('.picker-checkbox').forEach(cb => {
    cb.addEventListener('change', e => {
      const key = e.target.getAttribute('data-key');
      if (e.target.checked) {
        visibleKeys.add(key);
      } else {
        visibleKeys.delete(key);
      }
      writeHashState();
      renderTable();
      renderPicker(document.getElementById('picker-search').value);
    });
  });

  const togglableSelected = Array.from(visibleKeys).filter(k => !PINNED_KEYS.includes(k)).length;
  document.getElementById('drawer-subtitle').textContent = `${togglableSelected} of ${TOTAL_TOGGLEABLE} columns selected`;
}

// -------- Wiring --------

function openDrawer() {
  document.getElementById('drawer').classList.remove('closed');
  document.getElementById('drawer-backdrop').classList.remove('hidden');
  renderPicker();
}
function closeDrawer() {
  document.getElementById('drawer').classList.add('closed');
  document.getElementById('drawer-backdrop').classList.add('hidden');
}

document.getElementById('open-picker').addEventListener('click', openDrawer);
document.getElementById('close-picker').addEventListener('click', closeDrawer);
document.getElementById('drawer-backdrop').addEventListener('click', closeDrawer);
document.getElementById('reset-columns').addEventListener('click', () => {
  applyDefaults();
  renderTable();
  renderPicker();
});
document.getElementById('show-have-today').addEventListener('click', () => {
  applyHaveToday();
  renderTable();
  renderPicker();
});
document.getElementById('picker-search').addEventListener('input', e => renderPicker(e.target.value));

window.addEventListener('hashchange', () => {
  initStateFromHash();
  renderTable();
});

// -------- Boot --------

async function boot() {
  initStateFromHash();
  // Update the "Show all N we have today" button label to reflect actual count
  const btn = document.getElementById('show-have-today');
  if (btn) btn.textContent = `Show all ${HAVE_TODAY_KEYS.length} we have today`;
  try {
    const resp = await fetch('sample_data.json', { cache: 'no-store' });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    records = await resp.json();
  } catch (err) {
    console.warn('Could not load sample_data.json:', err);
    records = [];
  }
  renderTable();
}

boot();
