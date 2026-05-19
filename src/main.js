import { getMetrics, isLive, onUpdate } from './realdata.js'
import { liveDashboard }  from './modules/live-dashboard.js'
import { dockerVm }       from './modules/docker-vm.js'
import { paging }         from './modules/paging.js'
import { contextSwitch }  from './modules/context-switch.js'
import { cpuRing }        from './modules/cpu-ring.js'
import { diskIo }         from './modules/disk-io.js'

// ── Module registry ──────────────────────────────
const MODULES = {
  'live-dashboard': liveDashboard,
  'docker-vm':      dockerVm,
  'paging':         paging,
  'context-switch': contextSwitch,
  'cpu-ring':       cpuRing,
  'disk-io':        diskIo,
}

const NAV_ITEMS = [
  { id: 'home',           icon: '🏠', label: 'Ana Sayfa' },
  { id: 'live-dashboard', icon: '📊', label: 'Canlı Veriler' },
  { id: 'docker-vm',      icon: '🐳', label: 'Docker vs VM' },
  { id: 'paging',         icon: '📄', label: 'Paging' },
  { id: 'context-switch', icon: '🔄', label: 'Context Switch' },
  { id: 'cpu-ring',       icon: '🛡️', label: 'CPU Ring' },
  { id: 'disk-io',        icon: '💾', label: 'Disk I/O' },
]

let currentModule = null
let currentPage   = null

// ── Navigation ────────────────────────────────────
function navigate(page) {
  if (currentModule?.destroy) currentModule.destroy()
  currentModule = null
  currentPage = page

  updateNav(page)

  if (page === 'home') {
    renderHome()
    updateFloatingNav()
    return
  }

  const mod = MODULES[page]
  if (!mod) return

  const app = document.getElementById('app')
  app.innerHTML = mod.template()
  currentModule = mod
  if (mod.init) mod.init(app)
  updateFloatingNav()
}

function updateNav(page) {
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page)
  })
}

// ── Floating tab prev/next ────────────────────────
function getTabIds() {
  const app = document.getElementById('app')
  return Array.from(app.querySelectorAll('.tab-btn')).map(b => b.dataset.tab)
}

function activeTabId() {
  const app = document.getElementById('app')
  const active = app.querySelector('.tab-btn.active')
  return active ? active.dataset.tab : null
}

function updateFloatingNav() {
  const prev = document.getElementById('tab-nav-prev')
  const next = document.getElementById('tab-nav-next')
  const tabs = getTabIds()

  if (currentPage === 'home' || tabs.length === 0) {
    prev.style.display = 'none'
    next.style.display = 'none'
    return
  }

  prev.style.display = 'flex'
  next.style.display = 'flex'

  const idx = tabs.indexOf(activeTabId())
  prev.classList.toggle('disabled', idx <= 0)
  next.classList.toggle('disabled', idx >= tabs.length - 1)
}

document.getElementById('tab-nav-prev').addEventListener('click', () => {
  const tabs = getTabIds()
  const idx  = tabs.indexOf(activeTabId())
  if (idx > 0) { window.showTab(tabs[idx - 1]); updateFloatingNav() }
})

document.getElementById('tab-nav-next').addEventListener('click', () => {
  const tabs = getTabIds()
  const idx  = tabs.indexOf(activeTabId())
  if (idx < tabs.length - 1) { window.showTab(tabs[idx + 1]); updateFloatingNav() }
})

// ── Home page ─────────────────────────────────────
function renderHome() {
  const app = document.getElementById('app')

  const cards = [
    {
      id: 'docker-vm',
      icon: '🐳',
      color: 'blue',
      title: 'Docker vs Sanal Makine',
      desc: 'Donanım katmanı mimarisi, boot süreci karşılaştırması, RAM kaynak kullanımı ve Kernel Namespace izolasyonu.',
      tags: [
        { bg: 'var(--blue-b)',   color: 'var(--blue-light)',   text: 'Katman Diyagramı' },
        { bg: 'var(--green-b)',  color: 'var(--green-light)',  text: 'Boot Simülasyonu' },
        { bg: 'var(--purple-b)', color: 'var(--purple-light)', text: 'Namespace' },
      ]
    },
    {
      id: 'paging',
      icon: '📄',
      color: 'green',
      title: 'Sayfalama (Paging)',
      desc: 'Sanal adresten fiziksel adrese çeviri, TLB simülasyonu. Artı: VM\'de çift katmanlı EPT/NPT vs Container\'da tek sayfa tablosu karşılaştırması.',
      tags: [
        { bg: 'var(--green-b)',  color: 'var(--green-light)',  text: 'Adres Çevirisi' },
        { bg: 'var(--blue-b)',   color: 'var(--blue-light)',   text: 'TLB Simülasyonu' },
        { bg: 'var(--purple-b)', color: 'var(--purple-light)', text: '🐳 VM vs Docker' },
      ]
    },
    {
      id: 'context-switch',
      icon: '🔄',
      color: 'yellow',
      title: 'Context Switch',
      desc: 'CPU register kaydetme/yükleme, PCB. VM\'de VMEXIT maliyeti vs Container\'da namespace geçişi karşılaştırması ve Round Robin Scheduler.',
      tags: [
        { bg: 'var(--red-b)',    color: 'var(--red-light)',    text: 'Adım Adım' },
        { bg: 'var(--purple-b)', color: 'var(--purple-light)', text: '🐳 VM vs Docker' },
        { bg: 'var(--blue-b)',   color: 'var(--blue-light)',   text: 'Round Robin' },
      ]
    },
    {
      id: 'cpu-ring',
      icon: '🛡️',
      color: 'purple',
      title: 'CPU Ring 0 / Ring 3',
      desc: 'Kernel mode vs User mode, syscall akışı simülasyonu (read, write, fork...), VM\'de VMEXIT maliyeti ve mini quiz.',
      tags: [
        { bg: 'var(--purple-b)', color: 'var(--purple-light)', text: 'Ring Diyagramı' },
        { bg: 'var(--green-b)',  color: 'var(--green-light)',  text: 'Syscall Sim.' },
        { bg: 'var(--yellow-b)', color: 'var(--yellow-light)', text: 'Quiz ✓' },
      ]
    },
    {
      id: 'disk-io',
      icon: '💾',
      color: 'orange',
      title: 'Disk I/O & DMA',
      desc: 'I/O katman yolculuğu, OverlayFS ve Copy-on-Write simülasyonu, DMA transferi (CPU polling vs DMA) ve VM vs Container I/O karşılaştırması.',
      tags: [
        { bg: 'var(--blue-b)',   color: 'var(--blue-light)',   text: 'OverlayFS' },
        { bg: 'var(--green-b)',  color: 'var(--green-light)',  text: 'DMA Animasyon' },
        { bg: 'var(--yellow-b)', color: 'var(--yellow-light)', text: 'CoW' },
      ]
    },
  ]

  app.innerHTML = `
    <div class="home-page fade-in">
      <div class="home-hero">
        <div class="hero-badge">Bilgisayar Organizasyonu Dersi</div>
        <h1>🐳 Docker vs VM</h1>
        <p>Sanallaştırma teknolojileri derinlemesine: Paging, Context Switch, CPU Ring, Disk I/O konularını Docker ve VM perspektifinden interaktif simülasyonlarla keşfet.</p>
        <div class="home-stats">
          <div class="stat-pill">🐳 Docker</div>
          <div class="stat-pill">🖥️ VM / KVM</div>
          <div class="stat-pill"><strong>5</strong> Modül</div>
          <div class="stat-pill"><strong>20+</strong> Simülasyon</div>
          <div class="stat-pill">🇹🇷 Türkçe</div>
        </div>
      </div>

      <div class="home-grid">
        ${cards.map((c, i) => `
          <button class="module-card card-${c.color}" data-nav="${c.id}">
            <div class="card-num">Modül ${i + 1}</div>
            <div class="card-icon">${c.icon}</div>
            <div class="card-title">${c.title}</div>
            <div class="card-desc">${c.desc}</div>
            <div class="card-tags">
              ${c.tags.map(t => `<span class="card-tag" style="background:${t.bg};color:${t.color}">${t.text}</span>`).join('')}
            </div>
            <div class="card-cta">▶ Simülasyonu Aç →</div>
          </button>
        `).join('')}
      </div>
    </div>
  `

  app.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.nav))
  })
}

// ── Global tab switcher (called by modules) ───────
window.showTab = function(tabId, container) {
  const root = container || document.getElementById('app')
  root.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
  root.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
  const panel = root.querySelector('#' + tabId)
  const btn   = root.querySelector(`[data-tab="${tabId}"]`)
  if (panel) panel.classList.add('active')
  if (btn)   btn.classList.add('active')
  updateFloatingNav()
}

// ── Build nav ─────────────────────────────────────
function buildNav() {
  const nav = document.getElementById('top-nav')
  nav.innerHTML = `
    <div class="nav-brand" id="nav-brand">
      <span class="brand-icon">🐳</span>
      <span class="brand-text">Docker vs VM</span>
    </div>
    <div class="nav-tabs">
      ${NAV_ITEMS.map(item => `
        <button class="nav-tab" data-page="${item.id}">
          <span class="tab-icon">${item.icon}</span>
          ${item.label}
        </button>
      `).join('')}
    </div>
  `

  nav.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.page))
  })

  nav.querySelector('#nav-brand').addEventListener('click', () => navigate('home'))
}

// ── Real-data panel helper (used by modules) ──────
window.renderRealDataPanel = function(containerId, cells) {
  const m = getMetrics()
  const container = document.getElementById(containerId)
  if (!container) return

  const badge = isLive()
    ? `<span class="realdata-badge live">● CANLI</span>`
    : `<span class="realdata-badge snap">📷 SNAPSHOT — ${new Date(m.collected_at).toLocaleDateString('tr')}</span>`

  container.innerHTML = `
    <div class="realdata-panel">
      <div class="realdata-header">
        <span>📊 Gerçek Sistem Ölçümü &nbsp;·&nbsp; ${m.system.hostname} &nbsp;·&nbsp; ${m.system.cores} çekirdek</span>
        ${badge}
      </div>
      <div class="realdata-grid">
        ${cells(m).map(c => `
          <div class="realdata-cell">
            <div class="realdata-value">${c.value}</div>
            <div class="realdata-label">${c.label}</div>
          </div>`).join('')}
      </div>
    </div>`
}

// Re-render real-data panels when live data arrives
onUpdate(() => {
  document.querySelectorAll('[data-realdata]').forEach(el => {
    const fn = window['_rdFn_' + el.dataset.realdata]
    if (fn) fn()
  })
})

// ── Bootstrap ─────────────────────────────────────
buildNav()
navigate('home')
