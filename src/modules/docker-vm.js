// ── Docker vs VM Module ───────────────────────────
export const dockerVm = {
  template() {
    return `
<style>
.dvm-diagram-grid { display:grid; grid-template-columns:1fr 1fr; gap:32px; max-width:960px; margin:0 auto; }
.diagram-title { font-size:1rem; font-weight:700; text-align:center; margin-bottom:14px; padding:10px; border-radius:8px; }
.dt-vm     { background:var(--purple-b); color:var(--purple-light); }
.dt-docker { background:var(--blue-b);   color:var(--blue-light); }
.layer-stack { display:flex; flex-direction:column; gap:5px; }
.layer {
  padding:13px 18px; border-radius:8px; text-align:center; font-size:0.82rem; font-weight:500;
  cursor:pointer; transition:all 0.2s; border:2px solid transparent; position:relative;
}
.layer:hover { transform:scale(1.02); border-color:rgba(255,255,255,0.2); }
.layer.hardware    { background:#1e2533; color:#a0aec0; }
.layer.hypervisor  { background:var(--purple-b); color:var(--purple-light); }
.layer.vm-kernel   { background:#3d2b72; color:#e9d8fd; }
.layer.vm-app      { background:#4a33a0; color:#faf5ff; }
.layer.host-os     { background:var(--blue-b); color:var(--blue-light); }
.layer.docker-eng  { background:#1e4a7a; color:#bee3f8; }
.layer.container   { background:#1a4a82; color:#ebf8ff; }
.layer.shared-k    { background:#0f2a4a; color:var(--blue-light); font-size:0.75rem; border:1px dashed rgba(99,179,237,0.4)!important; }
.arrow-down { text-align:center; color:var(--text-subtle); font-size:1rem; line-height:1; padding:1px 0; }
.info-detail {
  margin-top:18px; padding:16px; background:var(--bg-card); border:1px solid var(--border);
  border-radius:var(--r-md); font-size:0.8rem; color:var(--text-muted); min-height:80px; transition:all 0.3s;
}
.info-detail h4 { color:var(--text); margin-bottom:6px; font-size:0.88rem; }

.boot-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; max-width:960px; margin:0 auto; }
.boot-panel { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; }
.boot-log {
  font-family:var(--font-mono); font-size:0.76rem; padding:16px; min-height:220px;
  color:var(--green-light); background:var(--bg-input); line-height:1.8; overflow-y:auto;
}
.boot-log .step { color:var(--yellow-light); }
.boot-log .done { color:var(--green-light); }
.boot-progress { height:3px; background:var(--border); }
.boot-bar { height:100%; width:0%; transition:width 0.3s; }
.boot-time { padding:10px 16px; text-align:center; font-size:0.78rem; color:var(--text-muted); }
.boot-time span { font-weight:700; font-size:1rem; }

.resource-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; max-width:1000px; margin:0 auto; }
.resource-panel { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-lg); padding:20px; }
.resource-panel h3 { margin-bottom:16px; font-size:0.95rem; }
.ram-grid { display:grid; grid-template-columns:repeat(8,1fr); gap:3px; margin-bottom:12px; }
.ram-block { aspect-ratio:1; border-radius:3px; background:var(--border); border:1px solid var(--border-active); transition:all 0.3s; }
.ram-block.vm-used        { background:#553c9a; border-color:#6b46c1; }
.ram-block.container-used { background:#2a69ac; border-color:#3182ce; }
.ram-block.overhead       { background:#744210; border-color:#975a16; }
.slider-row { display:flex; align-items:center; gap:12px; margin-top:14px; }
.slider-row label { font-size:0.8rem; color:var(--text-muted); min-width:110px; }
input[type=range] { flex:1; accent-color:var(--blue); }
.slider-val { font-size:0.88rem; font-weight:700; color:var(--text); min-width:28px; }
.legend { display:flex; gap:10px; flex-wrap:wrap; margin:8px 0; }
.legend-item { display:flex; align-items:center; gap:5px; font-size:0.74rem; color:var(--text-muted); }
.legend-dot { width:11px; height:11px; border-radius:2px; }

.ns-host { background:var(--bg-card); border:2px solid var(--border); border-radius:var(--r-lg); padding:20px; max-width:900px; margin:0 auto; }
.ns-kernel-bar { background:var(--blue-b); border:2px solid var(--blue); border-radius:var(--r-md); padding:10px 16px; text-align:center; margin-bottom:16px; font-weight:700; color:var(--blue-light); }
.ns-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:10px; }
.ns-box {
  background:var(--bg-card-2); border:1px solid var(--border); border-radius:var(--r-md);
  padding:14px; text-align:center; transition:all 0.3s; cursor:pointer;
}
.ns-box:hover { border-color:var(--blue); background:var(--blue-b); }
.ns-box.active { border-color:var(--blue); background:var(--blue-b); box-shadow:0 0 16px rgba(49,130,206,0.25); }
.ns-box .ns-icon { font-size:1.6rem; margin-bottom:6px; }
.ns-box .ns-name { font-size:0.78rem; font-weight:600; color:var(--blue-light); margin-bottom:3px; }
.ns-box .ns-desc { font-size:0.68rem; color:var(--text-muted); }
.ns-detail { margin-top:18px; padding:14px; background:var(--bg-card-2); border:1px solid var(--border); border-radius:var(--r-md); font-size:0.8rem; color:var(--text-muted); min-height:70px; }
.ns-detail h4 { color:var(--blue-light); margin-bottom:6px; }
</style>

<div class="module-page">
  <div class="module-header">
    <div class="module-header-left">
      <div class="module-header-icon" style="background:var(--blue-b)">🐳</div>
      <div>
        <h1>Docker vs Sanal Makine</h1>
        <p>Donanım Düzeyinde Karşılaştırma — Bilgisayar Organizasyonu</p>
      </div>
    </div>
    <span class="module-badge">İnteraktif</span>
  </div>

  <div class="module-tabs">
    <button class="tab-btn active" data-tab="dvm-katmanlar">① Katman Mimarisi</button>
    <button class="tab-btn" data-tab="dvm-boot">② Boot Süreci</button>
    <button class="tab-btn" data-tab="dvm-kaynak">③ RAM Kullanımı</button>
    <button class="tab-btn" data-tab="dvm-namespace">④ Kernel Namespace</button>
  </div>

  <!-- TAB 1: Katmanlar -->
  <div id="dvm-katmanlar" class="tab-panel active">
    <div class="panel-title">Donanım Katmanı Mimarisi</div>
    <div class="panel-sub">Bir katmana tıkla → ne işe yaradığını öğren</div>
    <div class="dvm-diagram-grid">
      <div>
        <div class="diagram-title dt-vm">🔮 Sanal Makine (VM)</div>
        <div class="layer-stack">
          <div class="layer vm-app"    data-ltype="vm" data-lkey="app">🧩 Uygulama (App)</div>
          <div class="arrow-down">↓</div>
          <div class="layer vm-kernel" data-ltype="vm" data-lkey="kernel">⚙️ Guest OS Kernel</div>
          <div class="arrow-down">↓</div>
          <div class="layer vm-app" style="background:#4a33a0aa" data-ltype="vm" data-lkey="guestos">🖥️ Guest OS (tam işletim sistemi)</div>
          <div class="arrow-down">↓</div>
          <div class="layer hypervisor" data-ltype="vm" data-lkey="hypervisor">🔷 Hypervisor (VMware / KVM)</div>
          <div class="arrow-down">↓</div>
          <div class="layer hardware"  data-ltype="vm" data-lkey="hardware">💾 Fiziksel Donanım (CPU, RAM, Disk)</div>
        </div>
        <div class="info-detail" id="vm-info">
          <h4>💡 Bir katmana tıkla</h4>
          Sanal makinenin her katmanının ne işe yaradığını görmek için yukarıdan bir kutuya tıkla.
        </div>
      </div>
      <div>
        <div class="diagram-title dt-docker">🐳 Docker (Container)</div>
        <div class="layer-stack">
          <div class="layer container"  data-ltype="docker" data-lkey="app">🧩 Uygulama (App)</div>
          <div class="arrow-down">↓</div>
          <div class="layer container" style="background:#1a4a82aa" data-ltype="docker" data-lkey="libs">📦 Kütüphaneler + Bağımlılıklar</div>
          <div class="arrow-down">↓</div>
          <div class="layer docker-eng" data-ltype="docker" data-lkey="engine">🐳 Docker Engine</div>
          <div class="arrow-down">↓</div>
          <div class="layer host-os"   data-ltype="docker" data-lkey="hostos">🖥️ Host OS (tek işletim sistemi)</div>
          <div class="arrow-down">↓</div>
          <div class="layer shared-k"  data-ltype="docker" data-lkey="kernel">⚙️ Paylaşılan Host Kernel</div>
          <div class="arrow-down">↓</div>
          <div class="layer hardware"  data-ltype="docker" data-lkey="hardware">💾 Fiziksel Donanım (CPU, RAM, Disk)</div>
        </div>
        <div class="info-detail" id="docker-info">
          <h4>💡 Bir katmana tıkla</h4>
          Docker'ın her katmanının ne işe yaradığını görmek için yukarıdan bir kutuya tıkla.
        </div>
      </div>
    </div>
  </div>

  <!-- TAB 2: Boot -->
  <div id="dvm-boot" class="tab-panel">
    <div class="panel-title">Boot Süreci Simülasyonu</div>
    <div class="panel-sub">VM ve Container'ın başlatılma adımlarını gerçek zamanlı izle</div>
    <div class="btn-row">
      <button class="btn btn-primary" id="boot-btn">▶ Simülasyonu Başlat</button>
    </div>
    <div class="boot-grid">
      <div class="boot-panel">
        <div class="panel-box-header ph-purple">
          <span>🔮 Sanal Makine Boot</span>
          <span id="vm-timer">0.0s</span>
        </div>
        <div class="boot-progress"><div class="boot-bar" id="vm-bar" style="background:var(--purple-light)"></div></div>
        <div class="boot-log" id="vm-log">$ _</div>
        <div class="boot-time" style="color:var(--purple-light)">Süre: <span id="vm-final">—</span></div>
      </div>
      <div class="boot-panel">
        <div class="panel-box-header ph-blue">
          <span>🐳 Docker Container Start</span>
          <span id="docker-timer">0.0s</span>
        </div>
        <div class="boot-progress"><div class="boot-bar" id="docker-bar" style="background:var(--blue-light)"></div></div>
        <div class="boot-log" id="docker-log">$ _</div>
        <div class="boot-time" style="color:var(--blue-light)">Süre: <span id="docker-final">—</span></div>
      </div>
    </div>
  </div>

  <!-- TAB 3: Kaynak -->
  <div id="dvm-kaynak" class="tab-panel">
    <div class="panel-title">RAM Kaynak Kullanımı</div>
    <div class="panel-sub">Kaç VM veya Container çalıştırılabilir? Kaydırıcıyla değiştir.</div>
    <div class="resource-grid">
      <div class="resource-panel">
        <h3 style="color:var(--purple-light)">🔮 Sanal Makine RAM</h3>
        <div class="ram-grid" id="vm-ram-grid"></div>
        <div class="legend">
          <div class="legend-item"><div class="legend-dot" style="background:#553c9a"></div> VM Belleği</div>
          <div class="legend-item"><div class="legend-dot" style="background:#744210"></div> Overhead</div>
          <div class="legend-item"><div class="legend-dot" style="background:var(--border)"></div> Boş</div>
        </div>
        <div class="slider-row">
          <label>VM Sayısı:</label>
          <input type="range" min="0" max="4" value="2" id="vm-count">
          <span class="slider-val" id="vm-count-val">2</span>
        </div>
        <div style="margin-top:14px">
          <div class="stat-row"><span class="stat-lbl">Her VM RAM</span><span style="color:var(--purple-light);font-weight:600">2 GB</span></div>
          <div class="stat-row"><span class="stat-lbl">Her VM Overhead</span><span style="color:var(--yellow-light);font-weight:600">1 GB</span></div>
          <div class="stat-row"><span class="stat-lbl">Toplam</span><span id="vm-total" style="color:var(--purple-light);font-weight:700">—</span></div>
        </div>
      </div>
      <div class="resource-panel">
        <h3 style="color:var(--blue-light)">🐳 Container RAM</h3>
        <div class="ram-grid" id="docker-ram-grid"></div>
        <div class="legend">
          <div class="legend-item"><div class="legend-dot" style="background:#2a69ac"></div> Container</div>
          <div class="legend-item"><div class="legend-dot" style="background:var(--border)"></div> Boş</div>
        </div>
        <div class="slider-row">
          <label>Container Sayısı:</label>
          <input type="range" min="0" max="12" value="4" id="docker-count">
          <span class="slider-val" id="docker-count-val">4</span>
        </div>
        <div style="margin-top:14px">
          <div class="stat-row"><span class="stat-lbl">Her Container RAM</span><span style="color:var(--blue-light);font-weight:600">512 MB</span></div>
          <div class="stat-row"><span class="stat-lbl">Overhead</span><span style="color:var(--green-light);font-weight:600">~0 (paylaşımlı)</span></div>
          <div class="stat-row"><span class="stat-lbl">Toplam</span><span id="docker-total" style="color:var(--blue-light);font-weight:700">—</span></div>
        </div>
      </div>
    </div>
  </div>

  <!-- TAB 4: Namespace -->
  <div id="dvm-namespace" class="tab-panel">
    <div class="panel-title">Kernel Namespace İzolasyonu</div>
    <div class="panel-sub">Docker'ın Linux kernel namespace'lerini nasıl kullandığını keşfet</div>
    <div class="ns-host">
      <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px">🖥️ Host Makine — Linux Kernel</div>
      <div class="ns-kernel-bar">⚙️ Linux Kernel — Tüm Container'lar Bunu Paylaşır</div>
      <div class="ns-grid">
        <div class="ns-box" data-ns="pid">
          <div class="ns-icon">🔢</div>
          <div class="ns-name">PID Namespace</div>
          <div class="ns-desc">Process izolasyonu</div>
        </div>
        <div class="ns-box" data-ns="net">
          <div class="ns-icon">🌐</div>
          <div class="ns-name">Network Namespace</div>
          <div class="ns-desc">Ağ izolasyonu</div>
        </div>
        <div class="ns-box" data-ns="mnt">
          <div class="ns-icon">💾</div>
          <div class="ns-name">Mount Namespace</div>
          <div class="ns-desc">Dosya sistemi izolasyonu</div>
        </div>
        <div class="ns-box" data-ns="uts">
          <div class="ns-icon">🏷️</div>
          <div class="ns-name">UTS Namespace</div>
          <div class="ns-desc">Hostname izolasyonu</div>
        </div>
        <div class="ns-box" data-ns="ipc">
          <div class="ns-icon">📨</div>
          <div class="ns-name">IPC Namespace</div>
          <div class="ns-desc">Mesaj kuyruğu izolasyonu</div>
        </div>
        <div class="ns-box" data-ns="user">
          <div class="ns-icon">👤</div>
          <div class="ns-name">User Namespace</div>
          <div class="ns-desc">Kullanıcı ID izolasyonu</div>
        </div>
      </div>
      <div class="ns-detail" id="ns-detail">
        <h4>💡 Bir namespace'e tıkla</h4>
        Docker, sanal bir OS çalıştırmak yerine Linux kernel'ın namespace mekanizmasını kullanarak izolasyon sağlar.
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
        root.getElementById
        const panel = root.querySelector('#' + btn.dataset.tab)
        if (panel) panel.classList.add('active')
      })
    })

    // ── Tab 1: Layer info ──
    const layerInfo = {
      vm: {
        app:       { title: '🧩 Uygulama', text: 'Kullanıcının çalıştırdığı asıl program. VM içinde çalışır, Host OS\'ten tamamen izole edilmiştir. Donanıma doğrudan erişemez.' },
        kernel:    { title: '⚙️ Guest OS Kernel', text: 'VM içindeki sanal işletim sisteminin çekirdeği. Disk, RAM ve CPU\'ya erişimi Hypervisor üzerinden yapar. Bu ek katman gecikme yaratır.' },
        guestos:   { title: '🖥️ Guest OS', text: 'Sanal makinenin tam kopyası olan işletim sistemi. Kendi boot süreci, kendi kullanıcı alanı ve kendi kernel\'ı vardır. Bu yüzden VM\'ler GB\'larca RAM tüketir.' },
        hypervisor:{ title: '🔷 Hypervisor', text: 'Fiziksel donanımı sanallaştıran yazılım. VMware, VirtualBox, KVM bu kategoriye girer. CPU ve RAM\'i sanal makineler arasında paylaştırır.' },
        hardware:  { title: '💾 Fiziksel Donanım', text: 'Gerçek CPU, RAM ve disk. VM, donanıma hiçbir zaman doğrudan erişemez — her istek Hypervisor üzerinden geçer.' }
      },
      docker: {
        app:     { title: '🧩 Uygulama', text: 'Container içinde çalışan uygulama. Namespace izolasyonu sayesinde diğer container\'lardan haberi yoktur, ama aynı kernel\'ı paylaşır.' },
        libs:    { title: '📦 Kütüphaneler', text: 'Uygulamanın ihtiyaç duyduğu tüm bağımlılıklar image içine paketlenir. Bu sayede "bende çalışıyor" sorunu ortadan kalkar.' },
        engine:  { title: '🐳 Docker Engine', text: 'Container\'ları yöneten daemon. Image indirme, container başlatma, network ve volume yönetimini üstlenir.' },
        hostos:  { title: '🖥️ Host OS', text: 'Tek bir işletim sistemi tüm container\'lara hizmet eder. VM\'deki gibi her uygulama için ayrı OS yoktur. Büyük verimlilik farkı yaratır.' },
        kernel:  { title: '⚙️ Paylaşılan Host Kernel', text: 'Tüm container\'lar aynı Linux kernel\'ını paylaşır. Namespace mekanizması ile her container kendi kernel\'ı varmış gibi hisseder. Bu yüzden container\'lar MB boyutundadır, GB değil.' },
        hardware:{ title: '💾 Fiziksel Donanım', text: 'Host OS üzerinden erişilir. VM\'e kıyasla donanıma çok daha az overhead ile ulaşılır — Docker performansı neredeyse native düzeyindedir.' }
      }
    }

    root.querySelectorAll('[data-ltype]').forEach(el => {
      el.addEventListener('click', () => {
        const { ltype, lkey } = el.dataset
        const d = layerInfo[ltype]?.[lkey]
        if (!d) return
        const box = root.querySelector(`#${ltype}-info`)
        if (box) box.innerHTML = `<h4>${d.title}</h4>${d.text}`
      })
    })

    // ── Tab 2: Boot ──
    const vmSteps = [
      { text: 'BIOS/UEFI POST kontrolü...', delay: 600 },
      { text: 'Sanal disk okunuyor...', delay: 700 },
      { text: 'Bootloader yükleniyor (GRUB)...', delay: 600 },
      { text: 'Linux kernel decompress ediliyor...', delay: 900 },
      { text: 'initramfs yükleniyor...', delay: 700 },
      { text: 'Sanal donanım sürücüleri başlatılıyor...', delay: 800 },
      { text: 'systemd init başlatılıyor...', delay: 600 },
      { text: 'Servisler başlatılıyor (network, ssh...)...', delay: 1000 },
      { text: 'Login prompt hazır ✓', delay: 400, done: true },
    ]
    const dockerSteps = [
      { text: 'docker run komutu alındı...', delay: 100 },
      { text: 'Image katmanları kontrol ediliyor...', delay: 200 },
      { text: 'Namespace\'ler oluşturuluyor...', delay: 200 },
      { text: 'cgroup\'lar yapılandırılıyor...', delay: 150 },
      { text: 'Network interface bağlanıyor...', delay: 150 },
      { text: 'Container başlatıldı ✓', delay: 100, done: true },
    ]

    const bootBtn = root.querySelector('#boot-btn')
    if (bootBtn) {
      bootBtn.addEventListener('click', () => {
        bootBtn.disabled = true
        root.querySelector('#vm-log').innerHTML = ''
        root.querySelector('#docker-log').innerHTML = ''
        root.querySelector('#vm-final').textContent = '—'
        root.querySelector('#docker-final').textContent = '—'
        root.querySelector('#vm-bar').style.width = '0%'
        root.querySelector('#docker-bar').style.width = '0%'
        this._runBoot(root, 'vm', vmSteps, () => {
          const done = this._runBoot(root, 'docker', dockerSteps, () => {
            bootBtn.disabled = false
          })
        })
        this._runBoot(root, 'docker', dockerSteps, () => {})
      })
    }

    // ── Tab 3: Resources ──
    const vmCountEl     = root.querySelector('#vm-count')
    const dockerCountEl = root.querySelector('#docker-count')
    if (vmCountEl) {
      vmCountEl.addEventListener('input', () => this._updateResources(root))
      dockerCountEl.addEventListener('input', () => this._updateResources(root))
      this._updateResources(root)
    }

    // ── Tab 4: Namespace ──
    const nsInfo = {
      pid:  { title: '🔢 PID Namespace', text: 'Her container kendi PID numaralandırmasına sahiptir. Container içindeki ilk process her zaman PID 1\'dir. Host OS\'te ise farklı bir PID numarasıyla görünür.' },
      net:  { title: '🌐 Network Namespace', text: 'Her container\'a sanal bir ağ arayüzü (eth0) atanır. Kendi IP adresi, routing tablosu ve firewall kuralları vardır. Docker Engine bu sanal ağları bridge ile host ağına bağlar.' },
      mnt:  { title: '💾 Mount Namespace', text: 'Her container kendi dosya sistemi görünümüne sahiptir. Image katmanları UnionFS ile üst üste bindirilir. Container silindiğinde değişiklikler gider, image değişmez.' },
      uts:  { title: '🏷️ UTS Namespace', text: 'Her container\'ın kendi hostname\'i olabilir. "hostname" komutu çalıştırıldığında container kendi adını görür, host makineninki değil.' },
      ipc:  { title: '📨 IPC Namespace', text: 'Shared memory, message queue ve semaphore gibi IPC mekanizmalarını izole eder. Bir container\'ın IPC nesneleri diğerinden görünmez.' },
      user: { title: '👤 User Namespace', text: 'Container içinde root (UID 0) olan kullanıcı, host OS\'te farklı bir UID\'ye map edilebilir. "Rootless container" güvenliğinin temelidir.' }
    }

    root.querySelectorAll('[data-ns]').forEach(el => {
      el.addEventListener('click', () => {
        root.querySelectorAll('[data-ns]').forEach(b => b.classList.remove('active'))
        el.classList.add('active')
        const d = nsInfo[el.dataset.ns]
        const detail = root.querySelector('#ns-detail')
        if (d && detail) detail.innerHTML = `<h4>${d.title}</h4>${d.text}`
      })
    })
  },

  _runBoot(root, type, steps, onDone) {
    let elapsed = 0
    const logEl   = root.querySelector(`#${type}-log`)
    const barEl   = root.querySelector(`#${type}-bar`)
    const timerEl = root.querySelector(`#${type}-timer`)
    const finalEl = root.querySelector(`#${type}-final`)
    if (!logEl) return

    const ticker = setInterval(() => {
      elapsed += 100
      timerEl.textContent = (elapsed / 1000).toFixed(1) + 's'
    }, 100)
    this._timers.push(ticker)

    const runStep = (i) => {
      if (i >= steps.length) {
        clearInterval(ticker)
        finalEl.textContent = (elapsed / 1000).toFixed(1) + 's'
        onDone()
        return
      }
      const s = steps[i]
      barEl.style.width = Math.round(((i + 1) / steps.length) * 100) + '%'
      const line = document.createElement('div')
      line.className = s.done ? 'done' : 'step'
      line.textContent = '> ' + s.text
      logEl.appendChild(line)
      logEl.scrollTop = logEl.scrollHeight
      const t = setTimeout(() => runStep(i + 1), s.delay)
      this._timers.push(t)
    }
    runStep(0)
  },

  _updateResources(root) {
    const vmCount     = parseInt(root.querySelector('#vm-count').value)
    const dockerCount = parseInt(root.querySelector('#docker-count').value)
    root.querySelector('#vm-count-val').textContent = vmCount
    root.querySelector('#docker-count-val').textContent = dockerCount

    const vmGrid = root.querySelector('#vm-ram-grid')
    vmGrid.innerHTML = ''
    const vmBlocks  = vmCount * 2
    const overBlocks = vmCount
    for (let i = 0; i < 24; i++) {
      const b = document.createElement('div')
      b.className = 'ram-block'
      if (i < vmBlocks) b.classList.add('vm-used')
      else if (i < vmBlocks + overBlocks) b.classList.add('overhead')
      vmGrid.appendChild(b)
    }
    root.querySelector('#vm-total').textContent = (vmCount * 3) + ' GB / 8 GB'

    const dockerGrid = root.querySelector('#docker-ram-grid')
    dockerGrid.innerHTML = ''
    const full = Math.floor(dockerCount / 2)
    for (let i = 0; i < 24; i++) {
      const b = document.createElement('div')
      b.className = 'ram-block'
      if (i < full) b.classList.add('container-used')
      dockerGrid.appendChild(b)
    }
    const mb = dockerCount * 512
    root.querySelector('#docker-total').textContent = mb >= 1024 ? (mb / 1024).toFixed(1) + ' GB / 8 GB' : mb + ' MB / 8 GB'
  },

  destroy() {
    if (this._timers) {
      this._timers.forEach(t => { clearInterval(t); clearTimeout(t) })
      this._timers = []
    }
  }
}
