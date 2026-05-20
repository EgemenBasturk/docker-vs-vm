// ── Context Switch Module ─────────────────────────
export const contextSwitch = {
  template() {
    return `
<style>
.cpu-visual {
  background:var(--bg-card); border:2px solid var(--border); border-radius:var(--r-lg);
  padding:20px; margin-bottom:18px; text-align:center;
}
.cpu-visual h4 { font-size:0.75rem; color:var(--text-muted); margin-bottom:12px; text-transform:uppercase; letter-spacing:1px; }
.cpu-core {
  display:inline-flex; flex-direction:column; align-items:center;
  background:var(--bg-input); border:2px solid var(--border); border-radius:var(--r-lg);
  padding:16px 32px; min-width:200px; transition:all 0.4s;
}
.cpu-core.running { border-color:var(--yellow-light); box-shadow:0 0 24px rgba(246,173,85,0.25); }
.cpu-core.saving  { border-color:var(--red-light);    box-shadow:0 0 24px rgba(252,129,129,0.25); }
.cpu-core.loading { border-color:var(--green-light);  box-shadow:0 0 24px rgba(104,211,145,0.25); }
.cpu-icon { font-size:2rem; margin-bottom:6px; }
.cpu-lbl  { font-size:0.72rem; color:var(--text-muted); margin-bottom:4px; }
.cpu-proc { font-size:1rem; font-weight:700; font-family:var(--font-mono); min-height:24px; }
.cpu-state{ font-size:0.72rem; margin-top:4px; min-height:18px; color:var(--text-muted); }

.regs-row { display:flex; gap:5px; justify-content:center; flex-wrap:wrap; margin-top:14px; }
.reg {
  background:var(--bg-card); border:1px solid var(--border); border-radius:4px;
  padding:5px 9px; font-family:var(--font-mono); font-size:0.7rem; transition:all 0.4s; text-align:center;
}
.reg.changed { background:var(--green-b);  border-color:var(--green);  color:var(--green-light); }
.reg.saving  { background:var(--yellow-b); border-color:var(--yellow); color:var(--yellow-light); }
.reg label   { display:block; font-size:0.58rem; color:var(--text-muted); }

.proc-row { display:flex; gap:12px; margin-bottom:18px; justify-content:center; flex-wrap:wrap; }
.proc-card {
  background:var(--bg-card); border:2px solid var(--border); border-radius:var(--r-md);
  padding:12px 18px; min-width:150px; text-align:center; transition:all 0.4s;
}
.proc-card.running       { border-color:var(--yellow-light); background:rgba(246,173,85,0.08); }
.proc-card.ready         { border-color:var(--blue-light);   background:rgba(49,130,206,0.08); }
.proc-card.waiting       { border-color:var(--border);       opacity:0.55; }
.proc-card.switching-out { border-color:var(--red-light);    background:rgba(252,129,129,0.08); }
.proc-card.switching-in  { border-color:var(--green-light);  background:rgba(104,211,145,0.08); }
.proc-name { font-weight:700; font-size:0.92rem; margin-bottom:4px; }
.proc-state-lbl { font-size:0.68rem; padding:3px 8px; border-radius:10px; display:inline-block; margin:3px 0; }
.s-run  { background:var(--yellow-b); color:var(--yellow-light); }
.s-rdy  { background:var(--blue-b);   color:var(--blue-light); }
.s-wait { background:var(--border);   color:var(--text-muted); }
.s-out  { background:var(--red-b);    color:var(--red-light); }
.s-in   { background:var(--green-b);  color:var(--green-light); }
.proc-pc { font-size:0.68rem; color:var(--text-muted); font-family:var(--font-mono); margin-top:2px; }

.pcb-area { display:flex; gap:12px; margin-bottom:18px; justify-content:center; flex-wrap:wrap; }
.pcb-box { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-md); padding:14px; min-width:160px; transition:all 0.4s; }
.pcb-box.active-pcb { border-color:var(--purple); background:rgba(107,70,193,0.08); }
.pcb-box h5 { font-size:0.72rem; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px; }
.pcb-entry { background:var(--bg-card-2); border-radius:3px; padding:3px 7px; font-family:var(--font-mono); font-size:0.7rem; margin-bottom:3px; color:var(--text-muted); transition:all 0.3s; }
.pcb-entry.saved { background:var(--green-b); color:var(--green-light); }
.pcb-entry.fresh { background:var(--blue-b); color:var(--blue-light); animation:pulse 0.5s; }

/* Round Robin */
.queue-section { margin-bottom:16px; }
.queue-lbl { font-size:0.75rem; color:var(--text-muted); margin-bottom:6px; text-transform:uppercase; letter-spacing:0.8px; }
.queue-row { display:flex; gap:6px; flex-wrap:wrap; min-height:46px; padding:8px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-md); align-items:center; }
.q-proc { padding:6px 12px; border-radius:5px; font-size:0.78rem; font-weight:600; font-family:var(--font-mono); transition:all 0.4s; }
.q-run  { background:var(--yellow-b); color:var(--yellow-light); border:1px solid rgba(214,158,46,0.4); }
.q-rdy  { background:var(--blue-b);   color:var(--blue-light);   border:1px solid rgba(49,130,206,0.4); }
.q-done { background:var(--green-b);  color:var(--green-light);  border:1px solid rgba(56,161,105,0.4); }

.gantt-row { display:flex; height:30px; border-radius:6px; overflow:hidden; border:1px solid var(--border); }
.gantt-slot { height:100%; display:flex; align-items:center; justify-content:center; font-size:0.62rem; font-weight:700; font-family:var(--font-mono); border-right:1px solid rgba(0,0,0,0.25); opacity:0.3; transition:opacity 0.2s; }
.gantt-slot.lit { opacity:1; }
</style>

<div class="module-page">
  <div class="module-header">
    <div class="module-header-left">
      <div class="module-header-icon" style="background:var(--yellow-b)">🔄</div>
      <div>
        <h1>Context Switch Simülasyonu</h1>
        <p>CPU'nun processler arasında nasıl geçiş yaptığını adım adım izle</p>
      </div>
    </div>
    <span class="module-badge">İnteraktif</span>
  </div>

  <div class="module-tabs">
    <button class="tab-btn active" data-tab="cs-nedir">① Context Switch Nedir?</button>
    <button class="tab-btn" data-tab="cs-adimlar">② Adım Adım Simülasyon</button>
    <button class="tab-btn" data-tab="cs-scheduler">③ Round Robin Scheduler</button>
    <button class="tab-btn" data-tab="cs-karsilastir">④ VM vs Container</button>
  </div>

  <!-- TAB 1 -->
  <div id="cs-nedir" class="tab-panel active">
    <div class="panel-title">Context Switch Nedir?</div>
    <div class="panel-sub">CPU tek anda sadece bir process çalıştırabilir — peki nasıl "aynı anda" çalışıyor gibi görünür?</div>
    <div class="concept-grid">
      <div class="concept-card">
        <h3>⚡ Temel Fikir</h3>
        <p>CPU saniyede binlerce kez farklı processler arasında <span class="hl-y">hızla geçiş</span> yapar. O kadar hızlıdır ki "eş zamanlı çalışıyor" gibi görünür. Bu mekanizmaya <span class="hl-y">Context Switch</span> denir.</p>
      </div>
      <div class="concept-card">
        <h3>💾 Context (Bağlam) Nedir?</h3>
        <p>Bir processin o an ne yaptığına dair tüm bilgi: <span class="hl-p">Program Counter (PC)</span>, <span class="hl-g">register değerleri</span>, <span class="hl-b">stack pointer</span>, bellek haritası.</p>
      </div>
      <div class="concept-card">
        <h3>🔮 VM'de Context Switch</h3>
        <p>VM'de geçiş daha <span class="hl-y">maliyetlidir</span>. Hypervisor da araya girer. Guest OS context'i + Hypervisor state'i kaydedilir. Bu ekstra katman <span class="hl-y">10-100x daha fazla</span> zaman alabilir.</p>
      </div>
      <div class="concept-card">
        <h3>🐳 Container'da Context Switch</h3>
        <p>Container'lar <span class="hl-g">doğrudan Host Kernel</span> üzerinde çalışır. Araya giren Hypervisor yoktur. Context switch neredeyse <span class="hl-g">native process</span> kadar hızlıdır.</p>
      </div>
    </div>
    <div class="analogy-box">
      <h3>🎬 Sinema Analojisi</h3>
      <p>Bir film gösterimini düşün. Projektör (<strong style="color:var(--yellow-light)">CPU</strong>) tek bir sahneyi gösterebilir.
      Ama filmi saniyede 24 kare değiştirerek kesintisiz bir hareket hissi verir.
      Her kare değişiminde önceki karenin son hali kaydedilip (<strong style="color:var(--red-light)">context save</strong>)
      yeni kare yüklenir (<strong style="color:var(--green-light)">context load</strong>).
      VM'de arada bir de film şeridini kesen makasçı (<strong style="color:var(--purple-light)">Hypervisor</strong>) devreye girer.</p>
    </div>
  </div>

  <!-- TAB 2: Adım adım -->
  <div id="cs-adimlar" class="tab-panel">
    <div class="panel-title">Adım Adım Context Switch</div>
    <div class="panel-sub">Her butona bas, CPU'nun ne yaptığını adım adım izle</div>
    <div style="max-width:960px;margin:0 auto">

      <div class="cpu-visual">
        <h4>⚙️ CPU Çekirdeği</h4>
        <div class="cpu-core running" id="cpu-core">
          <div class="cpu-icon">🔲</div>
          <div class="cpu-lbl">Çalışan Process</div>
          <div class="cpu-proc" id="cpu-proc">Process A</div>
          <div class="cpu-state" id="cpu-state">Çalışıyor</div>
        </div>
        <div class="regs-row">
          <div class="reg" id="reg-pc"><label>PC</label><span id="rv-pc">0x1A40</span></div>
          <div class="reg" id="reg-sp"><label>SP</label><span id="rv-sp">0xFF80</span></div>
          <div class="reg" id="reg-r1"><label>R1</label><span id="rv-r1">0x12</span></div>
          <div class="reg" id="reg-r2"><label>R2</label><span id="rv-r2">0x34</span></div>
          <div class="reg" id="reg-r3"><label>R3</label><span id="rv-r3">0x7E</span></div>
          <div class="reg" id="reg-r4"><label>R4</label><span id="rv-r4">0x01</span></div>
        </div>
      </div>

      <div class="proc-row">
        <div class="proc-card running" id="pc-A">
          <div class="proc-name" style="color:var(--yellow-light)">Process A</div>
          <span class="proc-state-lbl s-run" id="ps-A">RUNNING</span>
          <div class="proc-pc" id="pp-A">PC: 0x1A40</div>
        </div>
        <div class="proc-card ready" id="pc-B">
          <div class="proc-name" style="color:var(--blue-light)">Process B</div>
          <span class="proc-state-lbl s-rdy" id="ps-B">READY</span>
          <div class="proc-pc" id="pp-B">PC: 0x3C20</div>
        </div>
        <div class="proc-card waiting" id="pc-C">
          <div class="proc-name" style="color:var(--green-light)">Process C</div>
          <span class="proc-state-lbl s-wait" id="ps-C">WAITING</span>
          <div class="proc-pc" id="pp-C">PC: 0x5F10</div>
        </div>
      </div>

      <div class="btn-row">
        <button class="btn btn-primary" id="step-btn">▶ Sonraki Adım</button>
        <button class="btn btn-ghost" id="reset-sim">🔄 Sıfırla</button>
        <span style="font-size:0.8rem;color:var(--text-muted);align-self:center" id="step-counter">Adım: 0 / 5</span>
      </div>

      <div class="pcb-area">
        <div class="pcb-box" id="pcb-A">
          <h5 style="color:var(--yellow-light)">PCB — Process A</h5>
          <div class="pcb-entry" id="pcba-pc">PC: 0x1A40</div>
          <div class="pcb-entry" id="pcba-sp">SP: 0xFF80</div>
          <div class="pcb-entry" id="pcba-r1">R1: 0x12</div>
          <div class="pcb-entry" id="pcba-r2">R2: 0x34</div>
        </div>
        <div class="pcb-box" id="pcb-B">
          <h5 style="color:var(--blue-light)">PCB — Process B</h5>
          <div class="pcb-entry" id="pcbb-pc">PC: 0x3C20</div>
          <div class="pcb-entry" id="pcbb-sp">SP: 0xEE40</div>
          <div class="pcb-entry" id="pcbb-r1">R1: 0xAB</div>
          <div class="pcb-entry" id="pcbb-r2">R2: 0xCD</div>
        </div>
        <div class="pcb-box">
          <h5 style="color:var(--text-muted)">Kernel Stack</h5>
          <div id="kernel-stack" style="font-size:0.7rem;color:var(--text-subtle);font-family:var(--font-mono)">boş</div>
        </div>
      </div>

      <div class="sim-log" id="cs-log"><span class="log-info">▶ "Sonraki Adım" butonuna bas ve context switch sürecini izle...</span></div>
    </div>
  </div>

  <!-- TAB 3: Round Robin -->
  <div id="cs-scheduler" class="tab-panel">
    <div class="panel-title">Round Robin Scheduler</div>
    <div class="panel-sub">CPU sırayla her processe söz hakkı verir — time quantum dolunca geçiş yapar</div>
    <div style="max-width:900px;margin:0 auto">
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:16px;flex-wrap:wrap">
        <label style="font-size:0.82rem;color:var(--text-muted)">Time Quantum:</label>
        <input type="range" min="1" max="5" value="2" id="quantum-slider" style="flex:1;max-width:200px">
        <span class="slider-val" id="quantum-val">2</span>
        <span style="font-size:0.78rem;color:var(--text-muted)">birim</span>
        <button class="btn btn-primary" id="run-scheduler" style="padding:7px 16px;font-size:0.8rem">▶ Simüle Et</button>
        <button class="btn btn-ghost"   id="reset-scheduler" style="padding:7px 16px;font-size:0.8rem">🔄 Sıfırla</button>
      </div>

      <div class="queue-section">
        <div class="queue-lbl">🟡 Çalışan</div>
        <div class="queue-row" id="running-queue"></div>
      </div>
      <div class="queue-section">
        <div class="queue-lbl">🔵 Hazır Kuyruğu</div>
        <div class="queue-row" id="ready-queue"></div>
      </div>
      <div class="queue-section">
        <div class="queue-lbl">✅ Tamamlanan</div>
        <div class="queue-row" id="done-queue"></div>
      </div>

      <div style="margin-top:12px">
        <div style="font-size:0.74rem;color:var(--text-muted);margin-bottom:6px">📊 Gantt Şeması</div>
        <div class="gantt-row" id="gantt-row"></div>
      </div>

      <div class="stats-row" id="sched-stats" style="margin-top:14px"></div>
    </div>
  </div>

  <!-- TAB 4: VM vs Container -->
  <div id="cs-karsilastir" class="tab-panel">
    <div class="panel-title">VM vs Container — Context Switch Maliyeti</div>
    <div class="panel-sub">Aynı geçiş VM'de kaç adım, Container'da kaç adım?</div>
    <div class="btn-row"><button class="btn btn-primary" id="run-compare">▶ Karşılaştırmayı Başlat</button></div>
    <div class="grid-2">
      <div class="panel-box">
        <div class="panel-box-header ph-purple">🔮 Sanal Makine <span id="vm-step-lbl" style="font-size:0.72rem">—</span></div>
        <div class="panel-box-body" id="vm-timeline">
          ${[
            ['Timer Interrupt (Donanım)', 'CPU timer donanımı interrupt üretir, Hypervisor\'a bildirir', '~50 ns', 'md'],
            ['VM Exit (Hypervisor\'a geçiş)', 'Guest OS → Hypervisor geçişi (VMEXIT). VM state flush edilir', '~500-1000 ns', 'hi'],
            ['Guest OS Context Kaydet', 'Hypervisor mevcut VM\'in tüm register + CPU state\'ini kaydeder', '~200-500 ns', 'hi'],
            ['Hypervisor Scheduler', 'Hangi VM / process\'in çalışacağına karar verir', '~100 ns', 'md'],
            ['Guest OS Context Yükle', 'Yeni process\'in tüm register + state\'i CPU\'ya yüklenir', '~200-500 ns', 'hi'],
            ['VM Entry (Guest\'e dönüş)', 'Hypervisor → Guest OS geçişi (VMENTRY). TLB flush gerekebilir', '~500-1000 ns', 'hi'],
            ['Process Çalışmaya Devam', 'Yeni process kaldığı yerden devam eder', '✓ Tamamlandı', 'lo'],
          ].map((s, i) => `
            <div class="timeline-step" id="vm-s${i+1}">
              <div class="step-num" style="background:var(--purple-b);color:var(--purple-light)">${i+1}</div>
              <div class="step-content">
                <div class="step-title">${s[0]}</div>
                <div class="step-desc">${s[1]}</div>
                <span class="step-cost cost-${s[3]}">${s[2]}</span>
              </div>
            </div>`).join('')}
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border-subtle)">
            <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:6px">Toplam Tahmini Süre</div>
            <div style="display:flex;justify-content:space-between;font-size:0.74rem;color:var(--text-muted);margin-bottom:4px">
              <span>VM Context Switch</span>
              <span style="color:var(--red-light);font-weight:700">~2–4 μs &nbsp;🔴 10× yavaş</span>
            </div>
            <div class="progress-bg"><div class="progress-fill" id="vm-comp-bar" style="width:0%;background:linear-gradient(90deg,var(--purple),var(--red-light))"></div></div>
          </div>
        </div>
      </div>
      <div class="panel-box">
        <div class="panel-box-header ph-blue">🐳 Docker Container <span id="docker-step-lbl" style="font-size:0.72rem">—</span></div>
        <div class="panel-box-body" id="docker-timeline">
          ${[
            ['Timer Interrupt (Donanım)', 'CPU timer interrupt, direkt Host Kernel\'a iletilir', '~50 ns', 'md'],
            ['Kernel Scheduler Devreye Girer', 'Linux CFS scheduler doğrudan kararını verir — Hypervisor yok', '~50 ns', 'lo'],
            ['Register\'ları Kaydet', 'Mevcut container process\'inin register\'ları kernel stack\'e kaydedilir', '~50-100 ns', 'lo'],
            ['Namespace Geçişi', 'PID/net namespace değiştirilir — Docker\'a özgü ek adım', '~10-50 ns', 'md'],
            ['Register\'ları Yükle & Devam', 'Yeni container process\'i yüklenir ve çalışmaya başlar', '✓ Tamamlandı', 'lo'],
          ].map((s, i) => `
            <div class="timeline-step" id="dk-s${i+1}">
              <div class="step-num" style="background:var(--blue-b);color:var(--blue-light)">${i+1}</div>
              <div class="step-content">
                <div class="step-title">${s[0]}</div>
                <div class="step-desc">${s[1]}</div>
                <span class="step-cost cost-${s[3]}">${s[2]}</span>
              </div>
            </div>`).join('')}
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border-subtle)">
            <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:6px">Toplam Tahmini Süre</div>
            <div style="display:flex;justify-content:space-between;font-size:0.74rem;color:var(--text-muted);margin-bottom:4px">
              <span>Container Context Switch</span>
              <span style="color:var(--green-light);font-weight:700">~0.2–0.5 μs &nbsp;🟢 10× hızlı</span>
            </div>
            <div class="progress-bg"><div class="progress-fill" id="dk-comp-bar" style="width:0%;background:linear-gradient(90deg,var(--blue),var(--green-light))"></div></div>
          </div>
        </div>
      </div>
    </div>
    <div id="cs-realdata" data-realdata="cs" style="padding:16px 0 4px"></div>
  </div>
</div>
`
  },

  init(root) {
    this._timers = []

    // Tab switching
    root.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        root.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
        root.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
        btn.classList.add('active')
        const panel = root.querySelector('#' + btn.dataset.tab)
        if (panel) panel.classList.add('active')
      })
    })

    // ── Tab 2: Adım adım ──
    const STEPS = [
      {
        log: '<span class="log-warn">⏰ [1] Timer Interrupt! Process A\'nın time quantum doldu.</span>',
        cpu: { text: 'INTERRUPT', state: 'Interrupt alındı — switch başlıyor', cls: 'saving' },
        procs: { A: 'running', B: 'ready', C: 'waiting' },
        regs: { pc:'0x1A40', sp:'0xFF80', r1:'0x12', r2:'0x34', r3:'0x7E', r4:'0x01' },
        kernel: 'interrupt_handler()'
      },
      {
        log: '<span class="log-miss">💾 [2] Process A\'nın context\'i kaydediliyor (PCB\'ye yazılıyor)...</span>',
        cpu: { text: 'SAVING A', state: 'Process A context kaydediliyor...', cls: 'saving' },
        procs: { A: 'switching-out', B: 'ready', C: 'waiting' },
        regs: { pc:'0x1A40', sp:'0xFF80', r1:'0x12', r2:'0x34', r3:'0x7E', r4:'0x01' },
        kernel: 'save_context(A)\nPC=0x1A40\nSP=0xFF80',
        pcbA: 'saved'
      },
      {
        log: '<span class="log-warn">📋 [3] Scheduler: sıradaki process seçiliyor → Process B</span>',
        cpu: { text: 'SCHEDULER', state: 'Scheduler: Process B seçildi', cls: '' },
        procs: { A: 'waiting', B: 'ready', C: 'waiting' },
        regs: { pc:'????', sp:'????', r1:'??', r2:'??', r3:'??', r4:'??' },
        kernel: 'schedule()\n→ next = B'
      },
      {
        log: '<span class="log-info">📥 [4] Process B\'nin context\'i yükleniyor (PCB\'den okunuyor)...</span>',
        cpu: { text: 'LOADING B', state: 'Process B context yükleniyor...', cls: 'loading' },
        procs: { A: 'waiting', B: 'switching-in', C: 'waiting' },
        regs: { pc:'0x3C20', sp:'0xEE40', r1:'0xAB', r2:'0xCD', r3:'0x55', r4:'0xEF' },
        kernel: 'load_context(B)\nPC=0x3C20\nSP=0xEE40',
        pcbB: 'loaded'
      },
      {
        log: '<span class="log-ok">✅ [5] Process B CPU\'da çalışmaya başladı!</span>',
        cpu: { text: 'Process B', state: 'Çalışıyor — kaldığı yerden devam', cls: 'running' },
        procs: { A: 'waiting', B: 'running', C: 'waiting' },
        regs: { pc:'0x3C22', sp:'0xEE40', r1:'0xAB', r2:'0xCE', r3:'0x55', r4:'0xEF' },
        kernel: 'ret_to_user(B)',
        pcbB: 'running'
      }
    ]

    let simStep = 0

    const stateMap = {
      running:       ['running',       's-run',  'RUNNING'],
      ready:         ['ready',         's-rdy',  'READY'],
      waiting:       ['waiting',       's-wait', 'WAITING'],
      'switching-out':['switching-out','s-out',  'SAVING...'],
      'switching-in': ['switching-in', 's-in',   'LOADING...']
    }

    const stepBtn  = root.querySelector('#step-btn')
    const resetBtn = root.querySelector('#reset-sim')

    const applyStep = (s) => {
      const log = root.querySelector('#cs-log')
      if (log) { log.innerHTML += '<br>' + s.log; log.scrollTop = log.scrollHeight }

      const core = root.querySelector('#cpu-core')
      if (core) {
        core.className = 'cpu-core ' + (s.cpu.cls || '')
        root.querySelector('#cpu-proc').textContent = s.cpu.text
        root.querySelector('#cpu-state').textContent = s.cpu.state
      }

      Object.entries(s.regs).forEach(([k, v]) => {
        const valEl = root.querySelector('#rv-' + k)
        const regEl = root.querySelector('#reg-' + k)
        if (valEl) valEl.textContent = v
        if (regEl) {
          regEl.classList.remove('changed','saving')
          regEl.classList.add(s.cpu.cls === 'saving' ? 'saving' : 'changed')
        }
      })

      ;['A','B','C'].forEach(p => {
        const st = s.procs[p]
        const [cardCls, lblCls, lblTxt] = stateMap[st]
        const card = root.querySelector('#pc-' + p)
        const lbl  = root.querySelector('#ps-' + p)
        if (card) card.className = 'proc-card ' + cardCls
        if (lbl)  { lbl.className = 'proc-state-lbl ' + lblCls; lbl.textContent = lblTxt }
      })

      const ks = root.querySelector('#kernel-stack')
      if (ks) ks.textContent = s.kernel || ''

      if (s.pcbA) ['pcba-pc','pcba-sp','pcba-r1','pcba-r2'].forEach(id => {
        const el = root.querySelector('#' + id)
        if (el) el.className = 'pcb-entry saved'
      })
      if (s.pcbB === 'loaded') ['pcbb-pc','pcbb-sp','pcbb-r1','pcbb-r2'].forEach(id => {
        const el = root.querySelector('#' + id)
        if (el) el.className = 'pcb-entry fresh'
      })
    }

    if (stepBtn) {
      stepBtn.addEventListener('click', () => {
        if (simStep >= STEPS.length) return
        applyStep(STEPS[simStep])
        simStep++
        const counter = root.querySelector('#step-counter')
        if (counter) counter.textContent = `Adım: ${simStep} / ${STEPS.length}`
        if (simStep >= STEPS.length) {
          stepBtn.disabled = true
          const log = root.querySelector('#cs-log')
          if (log) log.innerHTML += '<br><span class="log-ok">✅ Context switch tamamlandı!</span>'
        }
      })
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        simStep = 0
        if (stepBtn) stepBtn.disabled = false
        const log = root.querySelector('#cs-log')
        if (log) log.innerHTML = '<span class="log-info">▶ "Sonraki Adım" butonuna bas ve context switch sürecini izle...</span>'
        const core = root.querySelector('#cpu-core')
        if (core) {
          core.className = 'cpu-core running'
          root.querySelector('#cpu-proc').textContent = 'Process A'
          root.querySelector('#cpu-state').textContent = 'Çalışıyor'
        }
        const counter = root.querySelector('#step-counter')
        if (counter) counter.textContent = 'Adım: 0 / 5'
        const ks = root.querySelector('#kernel-stack')
        if (ks) ks.textContent = 'boş'
        ;['A','B','C'].forEach((p, i) => {
          const card = root.querySelector('#pc-' + p)
          const lbl  = root.querySelector('#ps-' + p)
          const clss = ['running','ready','waiting']
          const lblc = ['s-run','s-rdy','s-wait']
          const lblt = ['RUNNING','READY','WAITING']
          if (card) card.className = 'proc-card ' + clss[i]
          if (lbl)  { lbl.className = 'proc-state-lbl ' + lblc[i]; lbl.textContent = lblt[i] }
        })
        const regDefaults = { pc:'0x1A40', sp:'0xFF80', r1:'0x12', r2:'0x34', r3:'0x7E', r4:'0x01' }
        Object.entries(regDefaults).forEach(([k,v]) => {
          const valEl = root.querySelector('#rv-' + k)
          const regEl = root.querySelector('#reg-' + k)
          if (valEl) valEl.textContent = v
          if (regEl) regEl.className = 'reg'
        })
        ;['pcba-pc','pcba-sp','pcba-r1','pcba-r2','pcbb-pc','pcbb-sp','pcbb-r1','pcbb-r2'].forEach(id => {
          const el = root.querySelector('#' + id)
          if (el) el.className = 'pcb-entry'
        })
      })
    }

    // ── Tab 3: Compare ──
    const runCompare = root.querySelector('#run-compare')
    if (runCompare) {
      runCompare.addEventListener('click', () => {
        for (let i = 1; i <= 7; i++) root.querySelector('#vm-s' + i)?.classList.remove('active')
        for (let i = 1; i <= 5; i++) root.querySelector('#dk-s' + i)?.classList.remove('active')

        for (let i = 1; i <= 7; i++) {
          const t = setTimeout(() => {
            root.querySelector('#vm-s' + i)?.classList.add('active')
            const lbl = root.querySelector('#vm-step-lbl')
            if (lbl) lbl.textContent = `Adım ${i}/7`
          }, i * 450)
          this._timers.push(t)
        }
        for (let i = 1; i <= 5; i++) {
          const t = setTimeout(() => {
            root.querySelector('#dk-s' + i)?.classList.add('active')
            const lbl = root.querySelector('#docker-step-lbl')
            if (lbl) lbl.textContent = `Adım ${i}/5`
          }, i * 350)
          this._timers.push(t)
        }
        const t1 = setTimeout(() => {
          const bar = root.querySelector('#vm-comp-bar')
          if (bar) bar.style.width = '100%'
          const lbl = root.querySelector('#vm-step-lbl')
          if (lbl) lbl.textContent = '✓ ~2-4 μs'
        }, 7 * 450 + 200)
        const t2 = setTimeout(() => {
          const bar = root.querySelector('#dk-comp-bar')
          if (bar) bar.style.width = '10%'
          const lbl = root.querySelector('#docker-step-lbl')
          if (lbl) lbl.textContent = '✓ ~0.2-0.5 μs'
        }, 5 * 350 + 200)
        this._timers.push(t1, t2)
      })
    }

    // ── Tab 4: Round Robin ──
    const PROC_COLORS_RR = { P1:'#f6ad55', P2:'#63b3ed', P3:'#68d391', P4:'#b794f4' }
    const PROC_BG_RR     = { P1:'#744210', P2:'#1a365d', P3:'#1a3a1a', P4:'#2d1b4e' }
    const BURST_TIMES    = { P1:6, P2:4, P3:8, P4:3 }

    const quantumSlider = root.querySelector('#quantum-slider')
    const quantumVal    = root.querySelector('#quantum-val')
    if (quantumSlider) {
      quantumSlider.addEventListener('input', () => {
        if (quantumVal) quantumVal.textContent = quantumSlider.value
      })
    }

    const runSched = root.querySelector('#run-scheduler')
    if (runSched) {
      runSched.addEventListener('click', () => {
        const quantum = parseInt(quantumSlider?.value || '2')
        const procs   = Object.entries(BURST_TIMES).map(([name, burst]) => ({ name, burst, remaining: burst }))
        const gantt   = []
        let queue     = [...procs]
        let time      = 0
        const compTimes = {}

        while (queue.length > 0) {
          const p = queue.shift()
          const run = Math.min(quantum, p.remaining)
          for (let i = 0; i < run; i++) gantt.push(p.name)
          time += run
          p.remaining -= run
          if (p.remaining > 0) queue.push(p)
          else compTimes[p.name] = time
        }

        const readyQ   = root.querySelector('#ready-queue')
        const runQ     = root.querySelector('#running-queue')
        const doneQ    = root.querySelector('#done-queue')
        const ganttRow = root.querySelector('#gantt-row')
        if (!ganttRow) return

        readyQ.innerHTML = ''; runQ.innerHTML = ''; doneQ.innerHTML = ''

        procs.forEach(p => {
          const el = document.createElement('div')
          el.className = 'q-proc q-rdy'
          el.textContent = p.name + ' (' + p.burst + ')'
          el.style.cssText = `background:${PROC_BG_RR[p.name]};color:${PROC_COLORS_RR[p.name]};border-color:${PROC_COLORS_RR[p.name]}44`
          readyQ.appendChild(el)
        })

        ganttRow.innerHTML = ''
        gantt.forEach(name => {
          const slot = document.createElement('div')
          slot.className = 'gantt-slot'
          slot.style.cssText = `width:${100/gantt.length}%;background:${PROC_BG_RR[name]};color:${PROC_COLORS_RR[name]}`
          slot.textContent = name
          ganttRow.appendChild(slot)
        })

        const statsEl = root.querySelector('#sched-stats')
        if (statsEl) {
          statsEl.innerHTML = ''
          Object.entries(compTimes).forEach(([name, ct]) => {
            const chip = document.createElement('div')
            chip.className = 'stat-chip'
            chip.style.borderColor = PROC_COLORS_RR[name] + '44'
            chip.innerHTML = `<div style="color:${PROC_COLORS_RR[name]}">${name}</div><strong style="color:${PROC_COLORS_RR[name]}">${ct}</strong><div style="font-size:0.66rem;color:var(--text-muted)">turnaround</div>`
            statsEl.appendChild(chip)
          })
          const switches = gantt.filter((g,i) => i > 0 && g !== gantt[i-1]).length
          const chip = document.createElement('div')
          chip.className = 'stat-chip'
          chip.style.borderColor = 'var(--red-light)44'
          chip.innerHTML = `<div style="color:var(--red-light)">Context Switch</div><strong style="color:var(--red-light)">${switches}</strong><div style="font-size:0.66rem;color:var(--text-muted)">toplam geçiş</div>`
          statsEl.appendChild(chip)
        }

        const doneProcNames = new Set()
        let gi = 0
        const interval = setInterval(() => {
          if (gi >= gantt.length) { clearInterval(interval); runQ.innerHTML = ''; return }
          const name = gantt[gi]
          runQ.innerHTML = ''
          const el = document.createElement('div')
          el.className = 'q-proc q-run'
          el.textContent = name
          el.style.cssText = `background:${PROC_BG_RR[name]};color:${PROC_COLORS_RR[name]};border-color:${PROC_COLORS_RR[name]}44`
          runQ.appendChild(el)
          if (ganttRow.children[gi]) ganttRow.children[gi].classList.add('lit')

          if (!doneProcNames.has(name) && gi + 1 === compTimes[name]) {
            doneProcNames.add(name)
            const doneEl = document.createElement('div')
            doneEl.className = 'q-proc q-done'
            doneEl.textContent = name + ' ✓'
            doneEl.style.cssText = `background:${PROC_BG_RR[name]};color:${PROC_COLORS_RR[name]};border-color:${PROC_COLORS_RR[name]}44`
            doneQ.appendChild(doneEl)
          }

          gi++
        }, 280)
        this._timers.push(interval)
      })
    }

    const resetSched = root.querySelector('#reset-scheduler')
    if (resetSched) {
      resetSched.addEventListener('click', () => {
        ;['running-queue','ready-queue','done-queue'].forEach(id => {
          const el = root.querySelector('#' + id)
          if (el) el.innerHTML = ''
        })
        const gr = root.querySelector('#gantt-row')
        if (gr) gr.innerHTML = ''
        const se = root.querySelector('#sched-stats')
        if (se) se.innerHTML = ''
      })
    }

    // Gerçek veri paneli
    const renderCsReal = () => window.renderRealDataPanel?.('cs-realdata', m => [
      { value: m.context_switch.ctxt_per_sec.toLocaleString(), label: 'Context switch/s' },
      { value: m.context_switch.processes_per_sec,             label: 'Yeni process/s' },
      { value: m.context_switch.running,                       label: 'Çalışan process' },
      { value: m.context_switch.blocked,                       label: 'Bloklu process' },
    ])
    window['_rdFn_cs'] = renderCsReal
    renderCsReal()
  },

  destroy() {
    if (this._timers) {
      this._timers.forEach(t => { clearInterval(t); clearTimeout(t) })
      this._timers = []
    }
  }
}
