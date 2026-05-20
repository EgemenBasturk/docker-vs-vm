export const liveDashboard = {
  template() {
    return `
<style>
  .cmp-page     { max-width:1000px; margin:0 auto; padding-bottom:40px; }

  /* Hero karşılaştırma kartları */
  .cmp-hero     { display:grid; grid-template-columns:1fr auto 1fr; gap:0; margin-bottom:28px;
                  background:var(--bg-card); border:1px solid var(--border); border-radius:16px;
                  overflow:hidden; }
  .cmp-side     { padding:28px 24px; }
  .cmp-side.docker { border-right:1px solid var(--border); }
  .cmp-divider  { display:flex; flex-direction:column; align-items:center; justify-content:center;
                  padding:0 16px; background:var(--bg-root); gap:8px; }
  .cmp-vs       { font-size:.7rem; font-weight:800; color:var(--text-muted);
                  letter-spacing:.1em; writing-mode:vertical-rl; }
  .cmp-side-icon{ font-size:2.2rem; margin-bottom:10px; }
  .cmp-side-title{ font-size:1.05rem; font-weight:800; color:var(--text-bright); margin-bottom:6px; }
  .cmp-side-sub { font-size:.78rem; color:var(--text-muted); line-height:1.5; }
  .cmp-side-pills{ display:flex; flex-wrap:wrap; gap:6px; margin-top:12px; }
  .cmp-pill     { font-size:.68rem; font-weight:700; padding:3px 9px; border-radius:20px; }
  .pill-green   { background:var(--green-b); color:var(--green-light); }
  .pill-blue    { background:var(--blue-b);  color:var(--blue-light);  }
  .pill-red     { background:var(--red-b);   color:var(--red-light);   }
  .pill-yellow  { background:var(--yellow-b);color:var(--yellow-light);}
  .pill-purple  { background:var(--purple-b);color:var(--purple-light);}

  /* Bar chart bölümü */
  .cmp-section  { background:var(--bg-card); border:1px solid var(--border);
                  border-radius:14px; padding:22px 24px; margin-bottom:16px; }
  .cmp-section-title { font-size:.82rem; font-weight:700; color:var(--text-muted);
                       text-transform:uppercase; letter-spacing:.07em; margin-bottom:18px;
                       display:flex; align-items:center; gap:8px; }
  .cmp-section-title::after { content:''; flex:1; height:1px; background:var(--border); }

  .bar-row      { display:grid; grid-template-columns:160px 1fr 1fr; gap:12px;
                  align-items:center; margin-bottom:14px; }
  .bar-label    { font-size:.78rem; color:var(--text-muted); font-weight:600; }
  .bar-wrap     { display:flex; flex-direction:column; gap:4px; }
  .bar-track    { height:22px; background:var(--bg-root); border-radius:6px; overflow:hidden;
                  position:relative; }
  .bar-fill     { height:100%; border-radius:6px; display:flex; align-items:center;
                  padding-left:8px; font-size:.7rem; font-weight:700;
                  transition:width 1.2s cubic-bezier(.22,.61,.36,1); white-space:nowrap; }
  .bar-name     { font-size:.68rem; color:var(--text-subtle); margin-top:2px; }
  .bar-unit     { font-size:.65rem; color:var(--text-subtle); margin-left:auto;
                  padding-right:8px; position:absolute; right:0; top:50%; transform:translateY(-50%); }

  /* Karşılaştırma tablosu */
  .cmp-table    { width:100%; border-collapse:collapse; font-size:.8rem; }
  .cmp-table th { padding:10px 14px; text-align:left; font-size:.7rem; font-weight:700;
                  color:var(--text-muted); text-transform:uppercase; letter-spacing:.07em;
                  border-bottom:1px solid var(--border); }
  .cmp-table td { padding:11px 14px; border-bottom:1px solid rgba(255,255,255,.04);
                  vertical-align:middle; }
  .cmp-table tr:last-child td { border-bottom:none; }
  .cmp-table tr:hover td { background:rgba(255,255,255,.02); }
  .td-feature   { color:var(--text-bright); font-weight:600; }
  .td-docker    { color:var(--green-light); }
  .td-vm        { color:var(--blue-light); }
  .win-badge    { display:inline-block; font-size:.62rem; font-weight:800; padding:2px 7px;
                  border-radius:10px; margin-left:6px; vertical-align:middle; }
  .win-d        { background:var(--green-b); color:var(--green-light); }
  .win-v        { background:var(--blue-b);  color:var(--blue-light);  }
  .win-tie      { background:var(--border);  color:var(--text-muted);  }

  /* Mimari özet */
  .arch-grid    { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .arch-card    { background:var(--bg-root); border:1px solid var(--border);
                  border-radius:10px; padding:16px; }
  .arch-title   { font-size:.8rem; font-weight:700; margin-bottom:10px; }
  .arch-layer   { display:flex; align-items:center; gap:8px; padding:7px 10px;
                  border-radius:6px; margin-bottom:4px; font-size:.75rem; font-weight:600; }
  .arch-arrow   { text-align:center; font-size:.7rem; color:var(--text-subtle); padding:1px 0; }

  @keyframes barIn { from { width:0 } }
  .bar-fill { animation: barIn 1.2s cubic-bezier(.22,.61,.36,1) both; }
</style>

<div class="module-page">
  <div class="module-header">
    <div class="module-badge" style="background:var(--purple-b);color:var(--purple-light);">Karşılaştırma</div>
    <h2>📊 Docker vs VM — Performans Karşılaştırması</h2>
    <p>Gerçek benchmark verileriyle Docker container ve Sanal Makine arasındaki farklar.</p>
  </div>

  <div class="cmp-page">

    <!-- Hero -->
    <div class="cmp-hero">
      <div class="cmp-side docker">
        <div class="cmp-side-icon">🐳</div>
        <div class="cmp-side-title">Docker Container</div>
        <div class="cmp-side-sub">Host kernel'i paylaşır. Namespace ve cgroup ile izolasyon sağlar. Hypervisor katmanı yoktur.</div>
        <div class="cmp-side-pills">
          <span class="cmp-pill pill-green">Düşük overhead</span>
          <span class="cmp-pill pill-blue">Native kernel</span>
          <span class="cmp-pill pill-green">Hızlı boot</span>
          <span class="cmp-pill pill-yellow">OverlayFS</span>
        </div>
      </div>
      <div class="cmp-divider">
        <span class="cmp-vs">VS</span>
      </div>
      <div class="cmp-side vm">
        <div class="cmp-side-icon">🖥️</div>
        <div class="cmp-side-title">Sanal Makine (KVM/Hyper-V)</div>
        <div class="cmp-side-sub">Tam donanım sanallaştırması. Hypervisor üzerinde ayrı kernel çalıştırır. Güçlü izolasyon sağlar.</div>
        <div class="cmp-side-pills">
          <span class="cmp-pill pill-blue">Tam izolasyon</span>
          <span class="cmp-pill pill-purple">Ayrı kernel</span>
          <span class="cmp-pill pill-red">VMEXIT maliyeti</span>
          <span class="cmp-pill pill-yellow">EPT/NPT</span>
        </div>
      </div>
    </div>

    <!-- Bar charts — Performans -->
    <div class="cmp-section">
      <div class="cmp-section-title">⚡ Performans Metrikleri</div>

      <div class="bar-row">
        <div class="bar-label">Boot Süresi</div>
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:1.1%;background:var(--green-light);color:#000">0.5s</div>
          </div>
          <div class="bar-name">🐳 Docker</div>
        </div>
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:100%;background:var(--blue-light);color:#000;animation-delay:.1s">45s</div>
          </div>
          <div class="bar-name">🖥️ VM (KVM)</div>
        </div>
      </div>

      <div class="bar-row">
        <div class="bar-label">Context Switch</div>
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:10%;background:var(--green-light);color:#000">~200 ns</div>
          </div>
          <div class="bar-name">🐳 Docker (namespace geçişi)</div>
        </div>
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:100%;background:var(--red-light);color:#000;animation-delay:.15s">~2000 ns</div>
          </div>
          <div class="bar-name">🖥️ VM (VMEXIT + register flush)</div>
        </div>
      </div>

      <div class="bar-row">
        <div class="bar-label">Disk I/O Overhead</div>
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:13%;background:var(--green-light);color:#000">+2%</div>
          </div>
          <div class="bar-name">🐳 Docker (OverlayFS)</div>
        </div>
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:100%;background:var(--yellow-light);color:#000;animation-delay:.2s">+15%</div>
          </div>
          <div class="bar-name">🖥️ VM (virtio disk katmanı)</div>
        </div>
      </div>

      <div class="bar-row">
        <div class="bar-label">Ağ Gecikmesi</div>
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:20%;background:var(--green-light);color:#000">+5%</div>
          </div>
          <div class="bar-name">🐳 Docker (bridge/overlay)</div>
        </div>
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:100%;background:var(--yellow-light);color:#000;animation-delay:.25s">+25%</div>
          </div>
          <div class="bar-name">🖥️ VM (virtio-net + NAT)</div>
        </div>
      </div>
    </div>

    <!-- Bar charts — Kaynak -->
    <div class="cmp-section">
      <div class="cmp-section-title">💾 Kaynak Kullanımı</div>

      <div class="bar-row">
        <div class="bar-label">RAM Overhead</div>
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:1%;background:var(--green-light);color:#000;min-width:36px">~5 MB</div>
          </div>
          <div class="bar-name">🐳 Docker (sadece proses)</div>
        </div>
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:100%;background:var(--blue-light);color:#000;animation-delay:.1s">512 MB+</div>
          </div>
          <div class="bar-name">🖥️ VM (min. guest OS + kernel)</div>
        </div>
      </div>

      <div class="bar-row">
        <div class="bar-label">Depolama Boyutu</div>
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:12%;background:var(--green-light);color:#000">100 MB</div>
          </div>
          <div class="bar-name">🐳 Docker image (alpine tabanlı)</div>
        </div>
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:100%;background:var(--blue-light);color:#000;animation-delay:.15s">8 GB+</div>
          </div>
          <div class="bar-name">🖥️ VM disk image (işletim sistemi)</div>
        </div>
      </div>

      <div class="bar-row">
        <div class="bar-label">CPU Hypervisor Payı</div>
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:2.5%;background:var(--green-light);color:#000;min-width:36px">0.2%</div>
          </div>
          <div class="bar-name">🐳 Docker (hypervisor yok)</div>
        </div>
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:100%;background:var(--red-light);color:#000;animation-delay:.2s">8%</div>
          </div>
          <div class="bar-name">🖥️ VM (KVM/Hyper-V overhead)</div>
        </div>
      </div>

      <div class="bar-row">
        <div class="bar-label">Sayfa Tablosu Katmanı</div>
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:50%;background:var(--green-light);color:#000">1 katman</div>
          </div>
          <div class="bar-name">🐳 Docker (host page table)</div>
        </div>
        <div class="bar-wrap">
          <div class="bar-track">
            <div class="bar-fill" style="width:100%;background:var(--purple-light);color:#000;animation-delay:.25s">2 katman</div>
          </div>
          <div class="bar-name">🖥️ VM (guest PT + EPT/NPT)</div>
        </div>
      </div>
    </div>

    <!-- Detaylı tablo -->
    <div class="cmp-section">
      <div class="cmp-section-title">📋 Özellik Karşılaştırması</div>
      <table class="cmp-table">
        <thead>
          <tr>
            <th style="width:30%">Özellik</th>
            <th>🐳 Docker</th>
            <th>🖥️ Sanal Makine</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="td-feature">İzolasyon seviyesi</td>
            <td class="td-docker">Namespace (pid, net, mnt, uts)</td>
            <td class="td-vm">Tam donanım izolasyonu <span class="win-badge win-v">VM ✓</span></td>
          </tr>
          <tr>
            <td class="td-feature">Kernel paylaşımı</td>
            <td class="td-docker">Host kernel paylaşılır <span class="win-badge win-d">🐳 ✓</span></td>
            <td class="td-vm">Ayrı guest kernel çalışır</td>
          </tr>
          <tr>
            <td class="td-feature">Syscall yolu</td>
            <td class="td-docker">Doğrudan host kernel<span class="win-badge win-d">🐳 ✓</span></td>
            <td class="td-vm">Guest kernel → VMEXIT → Host</td>
          </tr>
          <tr>
            <td class="td-feature">Bellek yönetimi</td>
            <td class="td-docker">Tek sayfa tablosu katmanı <span class="win-badge win-d">🐳 ✓</span></td>
            <td class="td-vm">EPT/NPT (çift katmanlı)</td>
          </tr>
          <tr>
            <td class="td-feature">Güvenlik</td>
            <td class="td-docker">seccomp + AppArmor</td>
            <td class="td-vm">Tam donanım izolasyonu <span class="win-badge win-v">VM ✓</span></td>
          </tr>
          <tr>
            <td class="td-feature">Taşınabilirlik</td>
            <td class="td-docker">Image tabanlı, her yerde çalışır <span class="win-badge win-d">🐳 ✓</span></td>
            <td class="td-vm">Disk image büyük, yavaş taşınır</td>
          </tr>
          <tr>
            <td class="td-feature">Windows/macOS uyumu</td>
            <td class="td-docker">WSL2 veya VM gerekir</td>
            <td class="td-vm">Farklı OS çalıştırabilir <span class="win-badge win-v">VM ✓</span></td>
          </tr>
          <tr>
            <td class="td-feature">Ölçeklenebilirlik</td>
            <td class="td-docker">Saniyeler içinde 100+ container <span class="win-badge win-d">🐳 ✓</span></td>
            <td class="td-vm">Her VM GB RAM gerektirir</td>
          </tr>
          <tr>
            <td class="td-feature">Orchestration</td>
            <td class="td-docker">Kubernetes, Docker Swarm <span class="win-badge win-d">🐳 ✓</span></td>
            <td class="td-vm">VMware vSphere, Proxmox</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mimari katman karşılaştırması -->
    <div class="cmp-section">
      <div class="cmp-section-title">🏗️ Mimari Katmanlar</div>
      <div class="arch-grid">

        <div class="arch-card">
          <div class="arch-title" style="color:var(--green-light)">🐳 Docker</div>
          <div class="arch-layer" style="background:var(--green-b);color:var(--green-light)">📦 Container (App + Libs)</div>
          <div class="arch-arrow">↓ namespace/cgroup</div>
          <div class="arch-layer" style="background:rgba(99,179,237,.15);color:var(--blue-light)">🐧 Docker Engine (containerd)</div>
          <div class="arch-arrow">↓ syscall direkt</div>
          <div class="arch-layer" style="background:var(--purple-b);color:var(--purple-light)">🛡️ Host Kernel (Ring 0)</div>
          <div class="arch-arrow">↓</div>
          <div class="arch-layer" style="background:var(--border);color:var(--text-muted)">⚙️ Donanım</div>
        </div>

        <div class="arch-card">
          <div class="arch-title" style="color:var(--blue-light)">🖥️ Sanal Makine</div>
          <div class="arch-layer" style="background:var(--blue-b);color:var(--blue-light)">📦 Uygulama</div>
          <div class="arch-arrow">↓ syscall</div>
          <div class="arch-layer" style="background:rgba(159,122,234,.2);color:var(--purple-light)">🐧 Guest Kernel + Guest OS</div>
          <div class="arch-arrow">↓ VMEXIT (pahalı!)</div>
          <div class="arch-layer" style="background:var(--red-b);color:var(--red-light)">🔴 Hypervisor (KVM / Hyper-V)</div>
          <div class="arch-arrow">↓</div>
          <div class="arch-layer" style="background:var(--purple-b);color:var(--purple-light)">🛡️ Host Kernel (Ring 0)</div>
          <div class="arch-arrow">↓</div>
          <div class="arch-layer" style="background:var(--border);color:var(--text-muted)">⚙️ Donanım</div>
        </div>

      </div>
    </div>

    <!-- Ne zaman hangisi -->
    <div class="cmp-section">
      <div class="cmp-section-title">🎯 Ne Zaman Hangisini Kullanmalı?</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div>
          <div style="font-size:.82rem;font-weight:700;color:var(--green-light);margin-bottom:10px">🐳 Docker Tercih Et</div>
          <div style="font-size:.78rem;color:var(--text-muted);line-height:1.9">
            ✓ Mikro servis mimarisi<br>
            ✓ CI/CD pipeline'ları<br>
            ✓ Hızlı geliştirme ortamları<br>
            ✓ Yüksek yoğunluklu dağıtım (100+ instance)<br>
            ✓ Kubernetes orchestration<br>
            ✓ Uygulama aynı OS kernel'i paylaşabiliyorsa
          </div>
        </div>
        <div>
          <div style="font-size:.82rem;font-weight:700;color:var(--blue-light);margin-bottom:10px">🖥️ VM Tercih Et</div>
          <div style="font-size:.78rem;color:var(--text-muted);line-height:1.9">
            ✓ Farklı işletim sistemi gerekiyorsa (Windows, BSD)<br>
            ✓ Tam güvenlik izolasyonu kritikse<br>
            ✓ Kernel-level exploit riski varsa<br>
            ✓ Legacy uygulama uyumluluğu<br>
            ✓ Dedicated donanım kaynağı gereken iş yükleri<br>
            ✓ Compliance / yasal gereksinimler
          </div>
        </div>
      </div>
    </div>

  </div>
</div>`
  },

  init() {},
  destroy() {},
}
