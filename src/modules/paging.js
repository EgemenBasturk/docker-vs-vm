// ── Paging Module ─────────────────────────────────
export const paging = {
  template() {
    return `
<style>
.bit-row { display:flex; gap:2px; }
.bit {
  width:38px; height:46px; border-radius:5px; display:flex; flex-direction:column;
  align-items:center; justify-content:center; font-family:var(--font-mono); font-size:1rem;
  font-weight:700; cursor:pointer; transition:all 0.2s; user-select:none; position:relative;
  border:1px solid var(--border);
}
.bit:hover { border-color:var(--blue-light); }
.bit.page-bit   { background:var(--purple-b); border-color:var(--purple); color:var(--purple-light); }
.bit.offset-bit { background:var(--green-b);  border-color:var(--green);  color:var(--green-light); }
.bit-lbl { font-size:0.42rem; color:var(--text-muted); position:absolute; bottom:3px; }

.pt-grid { display:grid; grid-template-columns:repeat(8,1fr); gap:4px; margin-top:8px; }
.pt-entry {
  background:var(--bg-card); border:1px solid var(--border); border-radius:5px;
  padding:8px 4px; text-align:center; font-family:var(--font-mono); font-size:0.72rem; transition:all 0.4s;
}
.pt-entry .vpn { font-size:0.6rem; color:var(--text-muted); }
.pt-entry .pfn { font-weight:700; color:var(--blue-light); }
.pt-entry.hit  { background:var(--blue-b); border-color:var(--blue); box-shadow:0 0 10px rgba(49,130,206,0.35); }

.tlb-sim-btns { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px; }
.tlb-btn {
  padding:7px 14px; border-radius:var(--r-md); border:1px solid var(--border);
  font-size:0.78rem; cursor:pointer; color:var(--text); background:var(--bg-card);
  transition:all 0.2s; font-family:var(--font-sans);
}
.tlb-btn:hover { background:var(--bg-card-2); border-color:var(--border-active); }
.tlb-btn.primary { background:var(--blue); border-color:var(--blue); color:white; }

.mem-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:3px; margin-bottom:12px; }
.mem-frame {
  aspect-ratio:1; border-radius:4px; background:var(--border); border:1px solid var(--border-active);
  display:flex; align-items:center; justify-content:center; font-size:0.6rem;
  font-family:var(--font-mono); transition:all 0.3s; cursor:pointer; color:var(--text-muted);
}
.mem-frame.used-p0 { background:#2a1f4e; border-color:#6b46c1; color:#d6bcfa; }
.mem-frame.used-p1 { background:#1a3a2a; border-color:#2f6e4e; color:#68d391; }
.mem-frame.used-p2 { background:#3a2a1a; border-color:#975a16; color:#f6ad55; }
.mem-frame.used-p3 { background:#1a2a3a; border-color:#2a5f8a; color:#63b3ed; }
.mem-frame.highlighted { box-shadow:0 0 12px rgba(255,255,255,0.4); transform:scale(1.1); z-index:1; }

.proc-item {
  display:flex; align-items:center; gap:8px; padding:7px 10px; border-radius:6px;
  font-size:0.78rem; cursor:pointer; transition:all 0.2s; border:1px solid transparent;
}
.proc-item:hover { border-color:var(--border-active); }
.proc-dot { width:11px; height:11px; border-radius:2px; flex-shrink:0; }
</style>

<div class="module-page">
  <div class="module-header">
    <div class="module-header-left">
      <div class="module-header-icon" style="background:var(--green-b)">📄</div>
      <div>
        <h1>Sayfalama (Paging) Simülasyonu</h1>
        <p>Sanal Adres → Fiziksel Adres Çevirisi — Bilgisayar Organizasyonu</p>
      </div>
    </div>
    <span class="module-badge">İnteraktif</span>
  </div>

  <div class="module-tabs">
    <button class="tab-btn active" data-tab="pg-nedir">① Paging Nedir?</button>
    <button class="tab-btn" data-tab="pg-cevirisi">② Adres Çevirisi</button>
    <button class="tab-btn" data-tab="pg-tlb">③ TLB Hit / Miss</button>
    <button class="tab-btn" data-tab="pg-fiziksel">④ Fiziksel Bellek</button>
  </div>

  <!-- TAB 1: Nedir -->
  <div id="pg-nedir" class="tab-panel active">
    <div class="panel-title">Paging (Sayfalama) Nedir?</div>
    <div class="panel-sub">Neden ihtiyaç duyulur? Nasıl çalışır?</div>
    <div class="concept-grid">
      <div class="concept-card">
        <h3>🤔 Problem: Bellek Parçalanması</h3>
        <p>Her program RAM'de <span class="hl-y">ardışık (bitişik)</span> yer istese, büyük programlar için yer bulunamaz. Araya boşluklar girer — kullanılamaz. Buna <span class="hl-y">harici parçalanma</span> denir.</p>
      </div>
      <div class="concept-card">
        <h3>✅ Çözüm: Sayfalama</h3>
        <p>Belleği eşit boyutlu <span class="hl-b">sayfalara (page)</span> böl. Programın parçaları RAM'in <span class="hl-b">herhangi bir yerine</span> yerleştirilebilir. Program ardışık görmek isterse — ona öyle göster.</p>
      </div>
      <div class="concept-card">
        <h3>🗺️ Sayfa Tablosu</h3>
        <p><span class="hl-g">Sanal sayfa numarası (VPN)</span> ile <span class="hl-b">fiziksel çerçeve numarası (PFN)</span> arasındaki eşlemeyi tutar. Her process'in kendi sayfa tablosu vardır. OS bunu yönetir.</p>
      </div>
      <div class="concept-card">
        <h3>⚡ TLB (Translation Lookaside Buffer)</h3>
        <p>Sayfa tablosuna her seferinde bakmak <span class="hl-y">yavaştır</span>. TLB, son kullanılan çevirileri <span class="hl-g">cache'leyen</span> donanım birimidir. TLB'de varsa: <span class="hl-g">HIT</span>. Yoksa: <span class="hl-y">MISS</span>.</p>
      </div>
    </div>
    <div class="analogy-box">
      <h3>🏨 Gerçek Hayat Analojisi</h3>
      <p>
        Bir otelde <strong style="color:var(--yellow-light)">oda numaraları</strong> var (sanal adres) ama gerçekte odalar farklı katlarda dağınık (fiziksel adres).
        Resepsiyoncu (sayfa tablosu) sana "304 numaralı oda aslında 2. katta" der.
        Sık gelen misafirlerin oda eşlemesini aklında tutan resepsiyoncu ise <strong style="color:var(--blue-light)">TLB</strong>'dir.
      </p>
    </div>
  </div>

  <!-- TAB 2: Adres Çevirisi -->
  <div id="pg-cevirisi" class="tab-panel">
    <div class="panel-title">Adres Çevirisi Simülasyonu</div>
    <div class="panel-sub">Bit bit göster — sanal adres nasıl fiziksel adrese dönüşür?</div>

    <div style="max-width:860px;margin:0 auto">
      <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:12px">
        Aşağıdaki <strong style="color:var(--purple-light)">8-bit sanal adres</strong>i tıklayarak değiştir, sonra "Çevir" butonuna bas.<br>
        İlk 4 bit = <span style="color:var(--purple-light)">Sayfa Numarası (VPN)</span> | Son 4 bit = <span style="color:var(--green-light)">Offset</span>
      </p>

      <div style="display:flex;gap:16px;align-items:center;margin-bottom:14px;flex-wrap:wrap">
        <div class="legend">
          <div class="legend-item"><div class="legend-dot" style="background:var(--purple)"></div> VPN (4 bit)</div>
          <div class="legend-item"><div class="legend-dot" style="background:var(--green)"></div> Offset (4 bit)</div>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap">
        <span style="font-size:0.82rem;color:var(--text-muted)">Sanal Adres:</span>
        <div class="bit-row" id="virtual-bits"></div>
      </div>

      <div class="btn-row" style="justify-content:flex-start">
        <button class="btn btn-primary" id="translate-btn">🔄 Çevir</button>
      </div>

      <div class="flow-row" id="flow-row">
        <div class="flow-box" id="fb-virtual"><div class="fb-title">Sanal Adres</div><div class="fb-val" id="fv-virtual">—</div></div>
        <div class="flow-arrow">→</div>
        <div class="flow-box" id="fb-vpn"><div class="fb-title">VPN (Sayfa No)</div><div class="fb-val" id="fv-vpn">—</div></div>
        <div class="flow-arrow">→</div>
        <div class="flow-box" id="fb-pt"><div class="fb-title">Sayfa Tablosu</div><div class="fb-val" id="fv-pt">—</div></div>
        <div class="flow-arrow">→</div>
        <div class="flow-box" id="fb-pfn"><div class="fb-title">PFN (Çerçeve No)</div><div class="fb-val" id="fv-pfn">—</div></div>
        <div class="flow-arrow">→</div>
        <div class="flow-box" id="fb-phys"><div class="fb-title">Fiziksel Adres</div><div class="fb-val" id="fv-phys">—</div></div>
      </div>

      <div>
        <h4 style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px">📋 Sayfa Tablosu (VPN → PFN)</h4>
        <div class="pt-grid" id="page-table"></div>
      </div>
    </div>
  </div>

  <!-- TAB 3: TLB -->
  <div id="pg-tlb" class="tab-panel">
    <div class="panel-title">TLB Hit / Miss Simülasyonu</div>
    <div class="panel-sub">Hangi durumlarda TLB hızlandırır, ne zaman sayfa tablosuna gitmek gerekir?</div>

    <div style="max-width:860px;margin:0 auto">
      <div class="tlb-sim-btns">
        <button class="tlb-btn primary" data-tlb-page="3">Sayfa 3'e eriş</button>
        <button class="tlb-btn primary" data-tlb-page="7">Sayfa 7'ye eriş</button>
        <button class="tlb-btn primary" data-tlb-page="1">Sayfa 1'e eriş</button>
        <button class="tlb-btn primary" data-tlb-page="11">Sayfa 11'e eriş</button>
        <button class="tlb-btn primary" data-tlb-page="5">Sayfa 5'e eriş</button>
        <button class="tlb-btn" id="reset-tlb">🔄 TLB'yi Sıfırla</button>
      </div>

      <div class="grid-2" style="margin-bottom:16px">
        <div class="panel-box">
          <div class="panel-box-header ph-green">⚡ TLB (Hızlı Cache) <span id="tlb-hit-count">Hit: 0</span></div>
          <div class="panel-box-body" style="padding:0">
            <table class="sim-table" style="font-size:0.76rem">
              <thead><tr><th>VPN</th><th>PFN</th><th>Geçerli?</th></tr></thead>
              <tbody id="tlb-body"></tbody>
            </table>
          </div>
        </div>
        <div class="panel-box">
          <div class="panel-box-header ph-red">📋 Sayfa Tablosu (Yavaş) <span id="tlb-miss-count">Miss: 0</span></div>
          <div class="panel-box-body" style="padding:0">
            <table class="sim-table" style="font-size:0.76rem">
              <thead><tr><th>VPN</th><th>PFN</th></tr></thead>
              <tbody id="pt-body"></tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="sim-log" id="tlb-log"><span class="log-info">▶ Yukarıdaki butonlardan bir sayfaya erişmeyi dene...</span></div>
    </div>
  </div>

  <!-- TAB 4: Fiziksel Bellek -->
  <div id="pg-fiziksel" class="tab-panel">
    <div class="panel-title">Fiziksel Bellek Çerçeveleri</div>
    <div class="panel-sub">Farklı processler RAM'in farklı çerçevelerini kullanır — ama hepsi ardışık sanır</div>

    <div class="grid-2">
      <div class="panel-box">
        <div class="panel-box-header ph-blue">🧠 Fiziksel RAM (32 Çerçeve)</div>
        <div class="panel-box-body">
          <div class="mem-grid" id="phys-mem-grid"></div>
          <p style="font-size:0.72rem;color:var(--text-muted)">Bir çerçeveye tıkla → hangi processe ait?</p>
        </div>
      </div>
      <div class="panel-box">
        <div class="panel-box-header ph-purple">⚙️ Processler</div>
        <div class="panel-box-body">
          <div id="proc-legend"></div>
          <div class="btn-row" style="flex-direction:column;align-items:stretch;gap:6px;margin-top:12px">
            <button class="btn btn-primary" id="alloc-proc">➕ Yeni Process Ekle</button>
            <button class="btn btn-ghost" id="reset-mem">🔄 Belleği Sıfırla</button>
          </div>
          <div style="margin-top:14px;font-size:0.78rem;color:var(--text-muted);line-height:1.6" id="frame-detail">
            Bir çerçeveye tıklayarak detaylarını gör.
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`
  },

  init(root) {
    this._timers = []

    // ── Tab switching ──
    root.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        root.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
        root.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
        btn.classList.add('active')
        const panel = root.querySelector('#' + btn.dataset.tab)
        if (panel) panel.classList.add('active')
      })
    })

    // ── Tab 2: Adres çevirisi ──
    const PAGE_TABLE = [5,12,3,9,1,14,7,2,11,4,13,6,15,0,8,10]
    let vBits = [0,0,1,0,0,1,1,0]

    const renderBits = () => {
      const container = root.querySelector('#virtual-bits')
      if (!container) return
      container.innerHTML = ''
      vBits.forEach((b, i) => {
        const d = document.createElement('div')
        d.className = 'bit ' + (i < 4 ? 'page-bit' : 'offset-bit')
        d.textContent = b
        const lbl = document.createElement('span')
        lbl.className = 'bit-lbl'
        lbl.textContent = `b${7 - i}`
        d.appendChild(lbl)
        d.addEventListener('click', () => { vBits[i] ^= 1; renderBits() })
        container.appendChild(d)
      })
    }

    const renderPT = () => {
      const grid = root.querySelector('#page-table')
      if (!grid) return
      grid.innerHTML = ''
      PAGE_TABLE.forEach((pfn, vpn) => {
        const d = document.createElement('div')
        d.className = 'pt-entry'
        d.id = 'pt-' + vpn
        d.innerHTML = `<div class="vpn">VPN ${vpn}</div><div class="pfn">${pfn.toString(16).padStart(2,'0').toUpperCase()}</div>`
        grid.appendChild(d)
      })
    }

    const translateBtn = root.querySelector('#translate-btn')
    if (translateBtn) {
      translateBtn.addEventListener('click', () => {
        const vpn    = parseInt(vBits.slice(0,4).join(''), 2)
        const offset = parseInt(vBits.slice(4).join(''), 2)
        const pfn    = PAGE_TABLE[vpn]
        const phys   = (pfn << 4) | offset

        ;['fb-virtual','fb-vpn','fb-pt','fb-pfn','fb-phys'].forEach(id => {
          const el = root.querySelector('#' + id)
          if (el) { el.classList.remove('active','done') }
        })
        root.querySelectorAll('.pt-entry').forEach(e => e.classList.remove('hit'))

        root.querySelector('#fv-virtual').textContent = vBits.join('')
        root.querySelector('#fv-vpn').textContent     = vpn.toString(2).padStart(4,'0')
        root.querySelector('#fv-pt').textContent      = 'PT[' + vpn + ']'
        root.querySelector('#fv-pfn').textContent     = pfn.toString(2).padStart(4,'0')
        root.querySelector('#fv-phys').textContent    = phys.toString(2).padStart(8,'0')

        const steps = ['fb-virtual','fb-vpn','fb-pt','fb-pfn','fb-phys']
        steps.forEach((id, i) => {
          const t = setTimeout(() => {
            if (i > 0) { const prev = root.querySelector('#' + steps[i-1]); prev?.classList.replace('active','done') }
            root.querySelector('#' + id)?.classList.add('active')
            if (id === 'fb-pt') root.querySelector('#pt-' + vpn)?.classList.add('hit')
            if (i === steps.length - 1) {
              const t2 = setTimeout(() => root.querySelector('#' + id)?.classList.replace('active','done'), 600)
              this._timers.push(t2)
            }
          }, i * 500)
          this._timers.push(t)
        })
      })
      renderBits()
      renderPT()
    }

    // ── Tab 3: TLB ──
    const FULL_PT = {1:8,3:2,5:14,7:6,9:11,11:4}
    let tlbCache = {}
    let hitCount = 0, missCount = 0

    const renderTLB = () => {
      const tb = root.querySelector('#tlb-body')
      if (!tb) return
      tb.innerHTML = ''
      const entries = Object.entries(tlbCache)
      if (!entries.length) {
        tb.innerHTML = '<tr><td colspan="3" style="color:var(--text-subtle);text-align:center;padding:12px">Boş</td></tr>'
        return
      }
      entries.forEach(([vpn, pfn]) => {
        const tr = document.createElement('tr')
        tr.id = 'tlb-row-' + vpn
        tr.innerHTML = `<td>${vpn}</td><td>${pfn}</td><td style="color:var(--green-light)">✓</td>`
        tb.appendChild(tr)
      })
    }

    const renderPTTable = () => {
      const tb = root.querySelector('#pt-body')
      if (!tb) return
      tb.innerHTML = ''
      Object.entries(FULL_PT).forEach(([vpn, pfn]) => {
        const tr = document.createElement('tr')
        tr.id = 'pt-row-' + vpn
        tr.innerHTML = `<td>${vpn}</td><td>${pfn}</td>`
        tb.appendChild(tr)
      })
    }

    const tlbAccess = (vpn) => {
      const log = root.querySelector('#tlb-log')
      if (!log) return
      let msg = ''
      if (tlbCache[vpn] !== undefined) {
        hitCount++
        root.querySelector('#tlb-hit-count').textContent = 'Hit: ' + hitCount
        msg = `<div class="log-hit">✅ TLB HIT — Sayfa ${vpn} → Çerçeve ${tlbCache[vpn]} (hızlı, 1 çevrim)</div>`
        const row = root.querySelector('#tlb-row-' + vpn)
        if (row) { row.classList.add('row-active'); setTimeout(() => row.classList.remove('row-active'), 1200) }
      } else {
        missCount++
        root.querySelector('#tlb-miss-count').textContent = 'Miss: ' + missCount
        const pfn = FULL_PT[vpn]
        if (pfn === undefined) {
          msg = `<div class="log-miss">❌ HATA — Sayfa ${vpn} sayfa tablosunda yok! (Page Fault)</div>`
        } else {
          tlbCache[vpn] = pfn
          renderTLB()
          msg = `<div class="log-miss">⚠️ TLB MISS — Sayfa ${vpn} TLB'de yok</div>
                 <div class="log-info">   → Sayfa tablosuna bakıldı: Sayfa ${vpn} → Çerçeve ${pfn}</div>
                 <div class="log-info">   → TLB'ye eklendi (sonraki erişim HIT olacak)</div>`
          const ptRow = root.querySelector('#pt-row-' + vpn)
          if (ptRow) { ptRow.classList.add('row-active'); setTimeout(() => ptRow.classList.remove('row-active'), 1200) }
        }
      }
      log.innerHTML += msg
      log.scrollTop = log.scrollHeight
    }

    root.querySelectorAll('[data-tlb-page]').forEach(btn => {
      btn.addEventListener('click', () => tlbAccess(parseInt(btn.dataset.tlbPage)))
    })

    const resetTlbBtn = root.querySelector('#reset-tlb')
    if (resetTlbBtn) {
      resetTlbBtn.addEventListener('click', () => {
        tlbCache = {}; hitCount = 0; missCount = 0
        root.querySelector('#tlb-hit-count').textContent = 'Hit: 0'
        root.querySelector('#tlb-miss-count').textContent = 'Miss: 0'
        root.querySelector('#tlb-log').innerHTML = '<span class="log-info">▶ TLB sıfırlandı. Tekrar dene...</span>'
        renderTLB()
      })
    }

    renderPTTable()
    renderTLB()

    // ── Tab 4: Fiziksel Bellek ──
    const PROC_COLORS = ['used-p0','used-p1','used-p2','used-p3']
    const PROC_NAMES  = ['Process A','Process B','Process C','Process D']
    const PROC_CLRS   = ['#6b46c1','#2f6e4e','#975a16','#2a5f8a']
    let frameMap   = Array(32).fill(null)
    let procFrames = [[],[],[],[]]
    let procCount  = 0

    const initPhysMem = () => {
      const grid = root.querySelector('#phys-mem-grid')
      if (!grid) return
      grid.innerHTML = ''
      for (let i = 0; i < 32; i++) {
        const d = document.createElement('div')
        d.className = 'mem-frame'
        d.id = 'frame-' + i
        d.textContent = i.toString(16).toUpperCase().padStart(2,'0')
        d.addEventListener('click', () => {
          const pid = frameMap[i]
          const det = root.querySelector('#frame-detail')
          if (!det) return
          if (pid === null) {
            det.innerHTML = `<strong style="color:var(--green-light)">Çerçeve ${i.toString(16).toUpperCase()}</strong><br>Durum: <span style="color:var(--green-light)">Boş</span>`
          } else {
            const vpn = procFrames[pid].indexOf(i)
            det.innerHTML = `<strong style="color:${PROC_CLRS[pid]}">Çerçeve ${i.toString(16).toUpperCase().padStart(2,'0')}</strong><br>
              Sahibi: <span style="color:${PROC_CLRS[pid]}">${PROC_NAMES[pid]}</span><br>
              Sanal Sayfa No: <span style="color:var(--blue-light)">${vpn}</span><br>
              Fiziksel Adres: <span style="color:var(--yellow-light)">0x${(i*4096).toString(16).toUpperCase()}</span><br>
              <br><em style="color:var(--text-subtle)">Sanal adreste ${vpn*4096} görür,<br>gerçekte RAM'de ${i*4096} adresinde.</em>`
          }
        })
        grid.appendChild(d)
      }
    }

    const renderProcLegend = () => {
      const leg = root.querySelector('#proc-legend')
      if (!leg) return
      leg.innerHTML = ''
      for (let i = 0; i < procCount; i++) {
        const d = document.createElement('div')
        d.className = 'proc-item'
        d.innerHTML = `<div class="proc-dot" style="background:${PROC_CLRS[i]}"></div>
          <span>${PROC_NAMES[i]}</span>
          <span style="margin-left:auto;font-size:0.72rem;color:var(--text-muted)">${procFrames[i].length} çerçeve · ${procFrames[i].length*4} KB</span>`
        d.addEventListener('click', () => {
          for (let j = 0; j < 32; j++) root.querySelector('#frame-' + j)?.classList.remove('highlighted')
          procFrames[i].forEach(f => root.querySelector('#frame-' + f)?.classList.add('highlighted'))
        })
        leg.appendChild(d)
      }
    }

    const allocBtn = root.querySelector('#alloc-proc')
    if (allocBtn) {
      allocBtn.addEventListener('click', () => {
        if (procCount >= 4) { alert('Maksimum 4 process!'); return }
        const pid  = procCount++
        const size = 4 + Math.floor(Math.random() * 5)
        const free = []
        for (let i = 0; i < 32; i++) if (!frameMap[i]) free.push(i)
        if (free.length < size) { alert('Yeterli boş çerçeve yok!'); procCount--; return }
        const chosen = free.sort(() => Math.random()-0.5).slice(0, size)
        chosen.forEach(f => {
          frameMap[f] = pid
          procFrames[pid].push(f)
          const el = root.querySelector('#frame-' + f)
          if (el) { el.className = 'mem-frame ' + PROC_COLORS[pid]; el.textContent = 'P' + pid }
        })
        renderProcLegend()
      })
    }

    const resetMemBtn = root.querySelector('#reset-mem')
    if (resetMemBtn) {
      resetMemBtn.addEventListener('click', () => {
        frameMap = Array(32).fill(null)
        procFrames = [[],[],[],[]]
        procCount = 0
        initPhysMem()
        const leg = root.querySelector('#proc-legend')
        if (leg) leg.innerHTML = ''
        const det = root.querySelector('#frame-detail')
        if (det) det.textContent = 'Bir çerçeveye tıklayarak detaylarını gör.'
      })
    }

    initPhysMem()
  },

  destroy() {
    if (this._timers) {
      this._timers.forEach(t => { clearTimeout(t) })
      this._timers = []
    }
  }
}
