import snapshot from '../data/snapshot.json'

const POLL_MS   = 2000
const HISTORY   = 40   // kaç veri noktası tutulsun

export const liveDashboard = {
  _timers:  [],
  _history: { ctxt: [], ring0: [], pfault: [] },
  _cur:     {},
  _disp:    { ctxt: 0, ring0: 0, pfault: 0, reads: 0 },
  _live:    false,
  _containers: 0,
  _raf:     null,

  template() {
    return `
<style>
  .ld-wrap      { max-width:960px; margin:0 auto; padding-bottom:32px; }
  .ld-status    { display:flex; align-items:center; gap:10px; padding:10px 16px;
                  background:var(--bg-card); border:1px solid var(--border);
                  border-radius:10px; margin-bottom:20px; font-size:.8rem; }
  .ld-dot       { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .ld-dot.live  { background:var(--green-light); animation:pulse 1.2s infinite; }
  .ld-dot.snap  { background:var(--yellow-light); }
  .ld-sys       { color:var(--text-muted); margin-left:auto; font-family:var(--font-mono); font-size:.75rem; }

  .ld-kpis      { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
  .ld-kpi       { background:var(--bg-card); border:2px solid var(--border);
                  border-radius:14px; padding:20px 18px; transition:border-color .4s, box-shadow .4s; }
  .ld-kpi.spike { box-shadow:0 0 24px currentColor; }
  .ld-kpi-val   { font-family:var(--font-mono); font-size:1.7rem; font-weight:800;
                  line-height:1; margin-bottom:6px; transition:color .3s; }
  .ld-kpi-lbl   { font-size:.72rem; color:var(--text-muted); font-weight:600;
                  text-transform:uppercase; letter-spacing:.06em; }
  .ld-kpi-sub   { font-size:.7rem; color:var(--text-subtle); margin-top:4px; }

  .ld-chart-wrap { background:var(--bg-card); border:1px solid var(--border);
                   border-radius:14px; padding:16px 18px; margin-bottom:16px; }
  .ld-chart-title{ font-size:.78rem; font-weight:700; color:var(--text-muted);
                   text-transform:uppercase; letter-spacing:.06em; margin-bottom:10px; }
  .ld-canvas    { width:100%; height:110px; display:block; border-radius:6px; }

  .ld-cpu-wrap  { background:var(--bg-card); border:1px solid var(--border);
                  border-radius:14px; padding:16px 18px; margin-bottom:16px; }
  .ld-cpu-bar   { height:32px; border-radius:8px; overflow:hidden;
                  display:flex; margin-top:10px; transition:all .6s; }
  .ld-cpu-seg   { display:flex; align-items:center; justify-content:center;
                  font-size:.72rem; font-weight:700; transition:width .6s; overflow:hidden;
                  white-space:nowrap; padding:0 6px; }

  .ld-docker    { background:var(--bg-card); border:1px solid var(--border);
                  border-radius:14px; padding:20px 22px; }
  .ld-docker-title { font-size:.9rem; font-weight:700; color:var(--text-bright);
                     margin-bottom:4px; }
  .ld-docker-sub { font-size:.78rem; color:var(--text-muted); margin-bottom:16px; }
  .ld-docker-btns{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
  .ld-ccount    { margin-left:auto; font-family:var(--font-mono); font-size:.82rem; color:var(--text-muted); }
  .ld-ccount span{ color:var(--green-light); font-weight:700; }

  .ld-no-server { padding:10px 14px; background:var(--yellow-b); border-radius:8px;
                  font-size:.78rem; color:var(--yellow-light); margin-top:10px; display:none; }
</style>

<div class="module-page">
  <div class="module-header">
    <div class="module-badge" style="background:var(--green-b);color:var(--green-light);">Canlı</div>
    <h2>📊 Canlı Sistem Metrikleri</h2>
    <p>Gerçek zamanlı kernel istatistikleri — Docker yük testi ile canlı karşılaştırma.</p>
  </div>

  <div class="ld-wrap">

    <!-- Durum çubuğu -->
    <div class="ld-status">
      <div class="ld-dot" id="ld-dot"></div>
      <span id="ld-status-txt">Bağlanıyor...</span>
      <span class="ld-sys" id="ld-sys-info"></span>
    </div>

    <!-- 4 KPI kartı -->
    <div class="ld-kpis">
      <div class="ld-kpi" id="kpi-ctxt" style="border-color:var(--blue);color:var(--blue-light);">
        <div class="ld-kpi-val" id="val-ctxt">—</div>
        <div class="ld-kpi-lbl">Context Switch/s</div>
        <div class="ld-kpi-sub" id="sub-ctxt">kernel process geçiş hızı</div>
      </div>
      <div class="ld-kpi" id="kpi-ring0" style="border-color:var(--red);color:var(--red-light);">
        <div class="ld-kpi-val" id="val-ring0">—</div>
        <div class="ld-kpi-lbl">Ring 0 (Kernel) %</div>
        <div class="ld-kpi-sub" id="sub-ring0">CPU'nun kernel'de geçirdiği süre</div>
      </div>
      <div class="ld-kpi" id="kpi-pfault" style="border-color:var(--purple);color:var(--purple-light);">
        <div class="ld-kpi-val" id="val-pfault">—</div>
        <div class="ld-kpi-lbl">Page Fault/s</div>
        <div class="ld-kpi-sub" id="sub-pfault">sayfa tablosu erişim sayısı</div>
      </div>
      <div class="ld-kpi" id="kpi-reads" style="border-color:var(--green);color:var(--green-light);">
        <div class="ld-kpi-val" id="val-reads">—</div>
        <div class="ld-kpi-lbl">Disk Okuma/s</div>
        <div class="ld-kpi-sub" id="sub-reads">I/O işlem sayısı</div>
      </div>
    </div>

    <!-- Context switch sparkline -->
    <div class="ld-chart-wrap">
      <div class="ld-chart-title">Context Switch / saniye — son 80 sn</div>
      <canvas class="ld-canvas" id="ld-canvas-ctxt"></canvas>
    </div>

    <!-- CPU Ring bar -->
    <div class="ld-cpu-wrap">
      <div class="ld-chart-title">CPU Kullanımı — Ring 3 (User) vs Ring 0 (Kernel)</div>
      <div class="ld-cpu-bar" id="ld-cpu-bar">
        <div class="ld-cpu-seg" id="seg-r3"  style="background:var(--blue);color:#000;width:10%">Ring 3</div>
        <div class="ld-cpu-seg" id="seg-r0"  style="background:var(--red-light);color:#000;width:4%">Ring 0</div>
        <div class="ld-cpu-seg" id="seg-idle"style="background:var(--bg-root);color:var(--text-subtle);flex:1">idle</div>
      </div>
      <div style="display:flex;gap:20px;margin-top:8px;font-size:.75rem;color:var(--text-muted);">
        <span>🔵 <strong id="lbl-r3">—</strong> Ring 3 (uygulama)</span>
        <span>🔴 <strong id="lbl-r0">—</strong> Ring 0 (kernel/syscall)</span>
        <span>⚫ <strong id="lbl-idle">—</strong> idle</span>
      </div>
    </div>

    <!-- Docker yük testi -->
    <div class="ld-docker">
      <div class="ld-docker-title">🐳 Docker Yük Testi</div>
      <div class="ld-docker-sub">
        4 CPU-intensive container başlat — metriklerin nasıl değiştiğini canlı izle.
        VM'de bu yük VMEXIT overhead'i de oluştururdu.
      </div>
      <div class="ld-docker-btns">
        <button class="btn btn-green" id="btn-stress-start">▶ 4 Container Başlat</button>
        <button class="btn btn-outline" id="btn-stress-stop">⏹ Durdur</button>
        <div class="ld-ccount">Çalışan container: <span id="ld-ccount">0</span></div>
      </div>
      <div class="ld-no-server" id="ld-no-server">
        ⚠️ Sunucu bulunamadı — WSL'de <code>node server.js</code> çalıştır, sonra sayfayı yenile.
      </div>
    </div>

  </div>
</div>`
  },

  init(root) {
    this._timers  = []
    this._history = { ctxt: [], ring0: [], pfault: [] }
    this._cur     = {}
    this._disp    = { ctxt: 0, ring0: 0, pfault: 0, reads: 0 }
    this._live    = false
    this._containers = 0
    this._root    = root

    this._initCanvas(root)
    this._startPolling(root)
    this._initDockerBtns(root)
    this._startRaf(root)
  },

  // ── Canvas setup ──────────────────────────────────
  _initCanvas(root) {
    const canvas = root.querySelector('#ld-canvas-ctxt')
    if (!canvas) return
    const resize = () => {
      canvas.width  = canvas.offsetWidth  * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
    }
    resize()
    this._resizeObserver = new ResizeObserver(resize)
    this._resizeObserver.observe(canvas)
  },

  // ── Polling ───────────────────────────────────────
  _startPolling(root) {
    const poll = async () => {
      try {
        const r = await fetch('http://localhost:4001/metrics', { signal: AbortSignal.timeout(1800) })
        const m = await r.json()
        this._live = true
        this._updateData(m, root)
      } catch {
        this._live = false
        // snapshot'a düş
        this._updateData(snapshot, root)
      }

      // docker status
      if (this._live) {
        try {
          const r2 = await fetch('http://localhost:4001/stress/status', { signal: AbortSignal.timeout(1000) })
          const s  = await r2.json()
          this._containers = s.count || 0
          const el = root.querySelector('#ld-ccount')
          if (el) el.textContent = this._containers
        } catch {}
      }
    }

    poll()
    const t = setInterval(poll, POLL_MS)
    this._timers.push(t)
  },

  // ── Data update ───────────────────────────────────
  _updateData(m, root) {
    this._cur = m

    // history
    const push = (arr, val) => { arr.push(val); if (arr.length > HISTORY) arr.shift() }
    push(this._history.ctxt,   m.context_switch?.ctxt_per_sec    || 0)
    push(this._history.ring0,  m.cpu?.ring0_pct                  || 0)
    push(this._history.pfault, m.paging?.pgfault_per_sec         || 0)

    // targets for animation
    this._disp._ctxtTarget   = m.context_switch?.ctxt_per_sec    || 0
    this._disp._ring0Target  = m.cpu?.ring0_pct                  || 0
    this._disp._pfaultTarget = m.paging?.pgfault_per_sec         || 0
    this._disp._readsTarget  = m.disk?.reads_per_sec             || 0

    // status bar
    const dot = root.querySelector('#ld-dot')
    const txt = root.querySelector('#ld-status-txt')
    const sys = root.querySelector('#ld-sys-info')
    const nos = root.querySelector('#ld-no-server')
    if (dot) dot.className = 'ld-dot ' + (this._live ? 'live' : 'snap')
    if (txt) txt.textContent = this._live ? '● Canlı veri — 2 saniyede bir güncelleniyor' : '📷 Snapshot verisi — node server.js başlat'
    if (sys) sys.textContent = `${m.system?.hostname || '—'} · ${m.system?.kernel?.replace('Linux version ','') || '—'} · ${m.system?.cores || '—'} çekirdek`
    if (nos) nos.style.display = this._live ? 'none' : 'block'

    // CPU bar
    const r3   = m.cpu?.ring3_pct || 0
    const r0   = m.cpu?.ring0_pct || 0
    const idle = Math.max(0, 100 - r3 - r0)
    const sr3  = root.querySelector('#seg-r3')
    const sr0  = root.querySelector('#seg-r0')
    const si   = root.querySelector('#seg-idle')
    if (sr3)  sr3.style.width  = r3   + '%'
    if (sr0)  sr0.style.width  = r0   + '%'
    if (si)   si.style.width   = idle + '%'
    const lr3  = root.querySelector('#lbl-r3')
    const lr0  = root.querySelector('#lbl-r0')
    const li   = root.querySelector('#lbl-idle')
    if (lr3)  lr3.textContent  = r3   + '%'
    if (lr0)  lr0.textContent  = r0   + '%'
    if (li)   li.textContent   = idle.toFixed(1) + '%'

    // spike highlight
    const ctxtVal = m.context_switch?.ctxt_per_sec || 0
    const kpi = root.querySelector('#kpi-ctxt')
    if (kpi) {
      const isSpike = ctxtVal > 20000
      kpi.classList.toggle('spike', isSpike)
    }

    this._drawCanvas(root)
  },

  // ── Canvas draw ───────────────────────────────────
  _drawCanvas(root) {
    const canvas = root.querySelector('#ld-canvas-ctxt')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)

    const data = this._history.ctxt
    if (data.length < 2) return

    const max = Math.max(...data) * 1.15 || 1
    const pts = data.map((v, i) => ({
      x: (i / (HISTORY - 1)) * W,
      y: H - (v / max) * H * 0.85 - H * 0.08
    }))

    // grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth = 1
    for (let i = 1; i < 4; i++) {
      ctx.beginPath()
      ctx.moveTo(0, H * i / 4)
      ctx.lineTo(W, H * i / 4)
      ctx.stroke()
    }

    // gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, 'rgba(99,179,237,0.35)')
    grad.addColorStop(1, 'rgba(99,179,237,0)')
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i++) {
      const mx = (pts[i-1].x + pts[i].x) / 2
      ctx.bezierCurveTo(mx, pts[i-1].y, mx, pts[i].y, pts[i].x, pts[i].y)
    }
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath()
    ctx.fillStyle = grad; ctx.fill()

    // line
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i++) {
      const mx = (pts[i-1].x + pts[i].x) / 2
      ctx.bezierCurveTo(mx, pts[i-1].y, mx, pts[i].y, pts[i].x, pts[i].y)
    }
    ctx.strokeStyle = '#63b3ed'
    ctx.lineWidth = 2 * devicePixelRatio
    ctx.stroke()

    // current dot
    const last = pts[pts.length - 1]
    ctx.beginPath()
    ctx.arc(last.x, last.y, 5 * devicePixelRatio, 0, Math.PI * 2)
    ctx.fillStyle = '#63b3ed'; ctx.fill()

    // max label
    ctx.fillStyle = 'rgba(99,179,237,0.6)'
    ctx.font = `${11 * devicePixelRatio}px monospace`
    ctx.fillText(Math.round(max).toLocaleString() + '/s', 6 * devicePixelRatio, 14 * devicePixelRatio)
  },

  // ── Smooth number animation (rAF) ─────────────────
  _startRaf(root) {
    const lerp = (a, b, t) => a + (b - a) * t
    const fmt  = n => Math.round(n).toLocaleString()

    const tick = () => {
      if (!this._disp) return
      const d = this._disp

      d.ctxt   = lerp(d.ctxt   || 0, d._ctxtTarget   || 0, 0.12)
      d.ring0  = lerp(d.ring0  || 0, d._ring0Target  || 0, 0.12)
      d.pfault = lerp(d.pfault || 0, d._pfaultTarget || 0, 0.12)
      d.reads  = lerp(d.reads  || 0, d._readsTarget  || 0, 0.12)

      const v = (id, val) => { const el = root.querySelector(id); if (el) el.textContent = val }
      v('#val-ctxt',   fmt(d.ctxt))
      v('#val-ring0',  d.ring0.toFixed(1) + '%')
      v('#val-pfault', fmt(d.pfault))
      v('#val-reads',  fmt(d.reads))

      this._raf = requestAnimationFrame(tick)
    }
    this._raf = requestAnimationFrame(tick)
  },

  // ── Docker buttons ────────────────────────────────
  _initDockerBtns(root) {
    root.querySelector('#btn-stress-start')?.addEventListener('click', async () => {
      if (!this._live) return
      try {
        await fetch('http://localhost:4001/stress/start', { method: 'POST' })
      } catch {}
    })
    root.querySelector('#btn-stress-stop')?.addEventListener('click', async () => {
      if (!this._live) return
      try {
        await fetch('http://localhost:4001/stress/stop', { method: 'POST' })
      } catch {}
    })
  },

  destroy() {
    this._timers.forEach(t => clearInterval(t))
    this._timers = []
    if (this._raf) cancelAnimationFrame(this._raf)
    if (this._resizeObserver) this._resizeObserver.disconnect()
    this._disp = null
  },
}
