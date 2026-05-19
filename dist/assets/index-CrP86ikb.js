(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))p(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&p(c)}).observe(document,{childList:!0,subtree:!0});function r(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function p(a){if(a.ep)return;a.ep=!0;const s=r(a);fetch(a.href,s)}})();const D={template(){return`
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
`},init(e){this._timers=[],e.querySelectorAll(".tab-btn").forEach(l=>{l.addEventListener("click",()=>{e.querySelectorAll(".tab-btn").forEach(i=>i.classList.remove("active")),e.querySelectorAll(".tab-panel").forEach(i=>i.classList.remove("active")),l.classList.add("active"),e.getElementById;const o=e.querySelector("#"+l.dataset.tab);o&&o.classList.add("active")})});const t={vm:{app:{title:"🧩 Uygulama",text:"Kullanıcının çalıştırdığı asıl program. VM içinde çalışır, Host OS'ten tamamen izole edilmiştir. Donanıma doğrudan erişemez."},kernel:{title:"⚙️ Guest OS Kernel",text:"VM içindeki sanal işletim sisteminin çekirdeği. Disk, RAM ve CPU'ya erişimi Hypervisor üzerinden yapar. Bu ek katman gecikme yaratır."},guestos:{title:"🖥️ Guest OS",text:"Sanal makinenin tam kopyası olan işletim sistemi. Kendi boot süreci, kendi kullanıcı alanı ve kendi kernel'ı vardır. Bu yüzden VM'ler GB'larca RAM tüketir."},hypervisor:{title:"🔷 Hypervisor",text:"Fiziksel donanımı sanallaştıran yazılım. VMware, VirtualBox, KVM bu kategoriye girer. CPU ve RAM'i sanal makineler arasında paylaştırır."},hardware:{title:"💾 Fiziksel Donanım",text:"Gerçek CPU, RAM ve disk. VM, donanıma hiçbir zaman doğrudan erişemez — her istek Hypervisor üzerinden geçer."}},docker:{app:{title:"🧩 Uygulama",text:"Container içinde çalışan uygulama. Namespace izolasyonu sayesinde diğer container'lardan haberi yoktur, ama aynı kernel'ı paylaşır."},libs:{title:"📦 Kütüphaneler",text:'Uygulamanın ihtiyaç duyduğu tüm bağımlılıklar image içine paketlenir. Bu sayede "bende çalışıyor" sorunu ortadan kalkar.'},engine:{title:"🐳 Docker Engine",text:"Container'ları yöneten daemon. Image indirme, container başlatma, network ve volume yönetimini üstlenir."},hostos:{title:"🖥️ Host OS",text:"Tek bir işletim sistemi tüm container'lara hizmet eder. VM'deki gibi her uygulama için ayrı OS yoktur. Büyük verimlilik farkı yaratır."},kernel:{title:"⚙️ Paylaşılan Host Kernel",text:"Tüm container'lar aynı Linux kernel'ını paylaşır. Namespace mekanizması ile her container kendi kernel'ı varmış gibi hisseder. Bu yüzden container'lar MB boyutundadır, GB değil."},hardware:{title:"💾 Fiziksel Donanım",text:"Host OS üzerinden erişilir. VM'e kıyasla donanıma çok daha az overhead ile ulaşılır — Docker performansı neredeyse native düzeyindedir."}}};e.querySelectorAll("[data-ltype]").forEach(l=>{l.addEventListener("click",()=>{const{ltype:o,lkey:i}=l.dataset,m=t[o]?.[i];if(!m)return;const S=e.querySelector(`#${o}-info`);S&&(S.innerHTML=`<h4>${m.title}</h4>${m.text}`)})});const r=[{text:"BIOS/UEFI POST kontrolü...",delay:600},{text:"Sanal disk okunuyor...",delay:700},{text:"Bootloader yükleniyor (GRUB)...",delay:600},{text:"Linux kernel decompress ediliyor...",delay:900},{text:"initramfs yükleniyor...",delay:700},{text:"Sanal donanım sürücüleri başlatılıyor...",delay:800},{text:"systemd init başlatılıyor...",delay:600},{text:"Servisler başlatılıyor (network, ssh...)...",delay:1e3},{text:"Login prompt hazır ✓",delay:400,done:!0}],p=[{text:"docker run komutu alındı...",delay:100},{text:"Image katmanları kontrol ediliyor...",delay:200},{text:"Namespace'ler oluşturuluyor...",delay:200},{text:"cgroup'lar yapılandırılıyor...",delay:150},{text:"Network interface bağlanıyor...",delay:150},{text:"Container başlatıldı ✓",delay:100,done:!0}],a=e.querySelector("#boot-btn");a&&a.addEventListener("click",()=>{a.disabled=!0,e.querySelector("#vm-log").innerHTML="",e.querySelector("#docker-log").innerHTML="",e.querySelector("#vm-final").textContent="—",e.querySelector("#docker-final").textContent="—",e.querySelector("#vm-bar").style.width="0%",e.querySelector("#docker-bar").style.width="0%",this._runBoot(e,"vm",r,()=>{this._runBoot(e,"docker",p,()=>{a.disabled=!1})}),this._runBoot(e,"docker",p,()=>{})});const s=e.querySelector("#vm-count"),c=e.querySelector("#docker-count");s&&(s.addEventListener("input",()=>this._updateResources(e)),c.addEventListener("input",()=>this._updateResources(e)),this._updateResources(e));const d={pid:{title:"🔢 PID Namespace",text:"Her container kendi PID numaralandırmasına sahiptir. Container içindeki ilk process her zaman PID 1'dir. Host OS'te ise farklı bir PID numarasıyla görünür."},net:{title:"🌐 Network Namespace",text:"Her container'a sanal bir ağ arayüzü (eth0) atanır. Kendi IP adresi, routing tablosu ve firewall kuralları vardır. Docker Engine bu sanal ağları bridge ile host ağına bağlar."},mnt:{title:"💾 Mount Namespace",text:"Her container kendi dosya sistemi görünümüne sahiptir. Image katmanları UnionFS ile üst üste bindirilir. Container silindiğinde değişiklikler gider, image değişmez."},uts:{title:"🏷️ UTS Namespace",text:`Her container'ın kendi hostname'i olabilir. "hostname" komutu çalıştırıldığında container kendi adını görür, host makineninki değil.`},ipc:{title:"📨 IPC Namespace",text:"Shared memory, message queue ve semaphore gibi IPC mekanizmalarını izole eder. Bir container'ın IPC nesneleri diğerinden görünmez."},user:{title:"👤 User Namespace",text:`Container içinde root (UID 0) olan kullanıcı, host OS'te farklı bir UID'ye map edilebilir. "Rootless container" güvenliğinin temelidir.`}};e.querySelectorAll("[data-ns]").forEach(l=>{l.addEventListener("click",()=>{e.querySelectorAll("[data-ns]").forEach(m=>m.classList.remove("active")),l.classList.add("active");const o=d[l.dataset.ns],i=e.querySelector("#ns-detail");o&&i&&(i.innerHTML=`<h4>${o.title}</h4>${o.text}`)})})},_runBoot(e,t,r,p){let a=0;const s=e.querySelector(`#${t}-log`),c=e.querySelector(`#${t}-bar`),d=e.querySelector(`#${t}-timer`),l=e.querySelector(`#${t}-final`);if(!s)return;const o=setInterval(()=>{a+=100,d.textContent=(a/1e3).toFixed(1)+"s"},100);this._timers.push(o);const i=m=>{if(m>=r.length){clearInterval(o),l.textContent=(a/1e3).toFixed(1)+"s",p();return}const S=r[m];c.style.width=Math.round((m+1)/r.length*100)+"%";const q=document.createElement("div");q.className=S.done?"done":"step",q.textContent="> "+S.text,s.appendChild(q),s.scrollTop=s.scrollHeight;const z=setTimeout(()=>i(m+1),S.delay);this._timers.push(z)};i(0)},_updateResources(e){const t=parseInt(e.querySelector("#vm-count").value),r=parseInt(e.querySelector("#docker-count").value);e.querySelector("#vm-count-val").textContent=t,e.querySelector("#docker-count-val").textContent=r;const p=e.querySelector("#vm-ram-grid");p.innerHTML="";const a=t*2,s=t;for(let o=0;o<24;o++){const i=document.createElement("div");i.className="ram-block",o<a?i.classList.add("vm-used"):o<a+s&&i.classList.add("overhead"),p.appendChild(i)}e.querySelector("#vm-total").textContent=t*3+" GB / 8 GB";const c=e.querySelector("#docker-ram-grid");c.innerHTML="";const d=Math.floor(r/2);for(let o=0;o<24;o++){const i=document.createElement("div");i.className="ram-block",o<d&&i.classList.add("container-used"),c.appendChild(i)}const l=r*512;e.querySelector("#docker-total").textContent=l>=1024?(l/1024).toFixed(1)+" GB / 8 GB":l+" MB / 8 GB"},destroy(){this._timers&&(this._timers.forEach(e=>{clearInterval(e),clearTimeout(e)}),this._timers=[])}},H={template(){return`
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
`},init(e){this._timers=[],e.querySelectorAll(".tab-btn").forEach(n=>{n.addEventListener("click",()=>{e.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active")),e.querySelectorAll(".tab-panel").forEach(b=>b.classList.remove("active")),n.classList.add("active");const v=e.querySelector("#"+n.dataset.tab);v&&v.classList.add("active")})});const t=[5,12,3,9,1,14,7,2,11,4,13,6,15,0,8,10];let r=[0,0,1,0,0,1,1,0];const p=()=>{const n=e.querySelector("#virtual-bits");n&&(n.innerHTML="",r.forEach((v,b)=>{const y=document.createElement("div");y.className="bit "+(b<4?"page-bit":"offset-bit"),y.textContent=v;const u=document.createElement("span");u.className="bit-lbl",u.textContent=`b${7-b}`,y.appendChild(u),y.addEventListener("click",()=>{r[b]^=1,p()}),n.appendChild(y)}))},a=()=>{const n=e.querySelector("#page-table");n&&(n.innerHTML="",t.forEach((v,b)=>{const y=document.createElement("div");y.className="pt-entry",y.id="pt-"+b,y.innerHTML=`<div class="vpn">VPN ${b}</div><div class="pfn">${v.toString(16).padStart(2,"0").toUpperCase()}</div>`,n.appendChild(y)}))},s=e.querySelector("#translate-btn");s&&(s.addEventListener("click",()=>{const n=parseInt(r.slice(0,4).join(""),2),v=parseInt(r.slice(4).join(""),2),b=t[n],y=b<<4|v;["fb-virtual","fb-vpn","fb-pt","fb-pfn","fb-phys"].forEach(h=>{const L=e.querySelector("#"+h);L&&L.classList.remove("active","done")}),e.querySelectorAll(".pt-entry").forEach(h=>h.classList.remove("hit")),e.querySelector("#fv-virtual").textContent=r.join(""),e.querySelector("#fv-vpn").textContent=n.toString(2).padStart(4,"0"),e.querySelector("#fv-pt").textContent="PT["+n+"]",e.querySelector("#fv-pfn").textContent=b.toString(2).padStart(4,"0"),e.querySelector("#fv-phys").textContent=y.toString(2).padStart(8,"0");const u=["fb-virtual","fb-vpn","fb-pt","fb-pfn","fb-phys"];u.forEach((h,L)=>{const E=setTimeout(()=>{if(L>0&&e.querySelector("#"+u[L-1])?.classList.replace("active","done"),e.querySelector("#"+h)?.classList.add("active"),h==="fb-pt"&&e.querySelector("#pt-"+n)?.classList.add("hit"),L===u.length-1){const A=setTimeout(()=>e.querySelector("#"+h)?.classList.replace("active","done"),600);this._timers.push(A)}},L*500);this._timers.push(E)})}),p(),a());const c={1:8,3:2,5:14,7:6,9:11,11:4};let d={},l=0,o=0;const i=()=>{const n=e.querySelector("#tlb-body");if(!n)return;n.innerHTML="";const v=Object.entries(d);if(!v.length){n.innerHTML='<tr><td colspan="3" style="color:var(--text-subtle);text-align:center;padding:12px">Boş</td></tr>';return}v.forEach(([b,y])=>{const u=document.createElement("tr");u.id="tlb-row-"+b,u.innerHTML=`<td>${b}</td><td>${y}</td><td style="color:var(--green-light)">✓</td>`,n.appendChild(u)})},m=()=>{const n=e.querySelector("#pt-body");n&&(n.innerHTML="",Object.entries(c).forEach(([v,b])=>{const y=document.createElement("tr");y.id="pt-row-"+v,y.innerHTML=`<td>${v}</td><td>${b}</td>`,n.appendChild(y)}))},S=n=>{const v=e.querySelector("#tlb-log");if(!v)return;let b="";if(d[n]!==void 0){l++,e.querySelector("#tlb-hit-count").textContent="Hit: "+l,b=`<div class="log-hit">✅ TLB HIT — Sayfa ${n} → Çerçeve ${d[n]} (hızlı, 1 çevrim)</div>`;const y=e.querySelector("#tlb-row-"+n);y&&(y.classList.add("row-active"),setTimeout(()=>y.classList.remove("row-active"),1200))}else{o++,e.querySelector("#tlb-miss-count").textContent="Miss: "+o;const y=c[n];if(y===void 0)b=`<div class="log-miss">❌ HATA — Sayfa ${n} sayfa tablosunda yok! (Page Fault)</div>`;else{d[n]=y,i(),b=`<div class="log-miss">⚠️ TLB MISS — Sayfa ${n} TLB'de yok</div>
                 <div class="log-info">   → Sayfa tablosuna bakıldı: Sayfa ${n} → Çerçeve ${y}</div>
                 <div class="log-info">   → TLB'ye eklendi (sonraki erişim HIT olacak)</div>`;const u=e.querySelector("#pt-row-"+n);u&&(u.classList.add("row-active"),setTimeout(()=>u.classList.remove("row-active"),1200))}}v.innerHTML+=b,v.scrollTop=v.scrollHeight};e.querySelectorAll("[data-tlb-page]").forEach(n=>{n.addEventListener("click",()=>S(parseInt(n.dataset.tlbPage)))});const q=e.querySelector("#reset-tlb");q&&q.addEventListener("click",()=>{d={},l=0,o=0,e.querySelector("#tlb-hit-count").textContent="Hit: 0",e.querySelector("#tlb-miss-count").textContent="Miss: 0",e.querySelector("#tlb-log").innerHTML='<span class="log-info">▶ TLB sıfırlandı. Tekrar dene...</span>',i()}),m(),i();const z=["used-p0","used-p1","used-p2","used-p3"],k=["Process A","Process B","Process C","Process D"],f=["#6b46c1","#2f6e4e","#975a16","#2a5f8a"];let g=Array(32).fill(null),x=[[],[],[],[]],w=0;const C=()=>{const n=e.querySelector("#phys-mem-grid");if(n){n.innerHTML="";for(let v=0;v<32;v++){const b=document.createElement("div");b.className="mem-frame",b.id="frame-"+v,b.textContent=v.toString(16).toUpperCase().padStart(2,"0"),b.addEventListener("click",()=>{const y=g[v],u=e.querySelector("#frame-detail");if(u)if(y===null)u.innerHTML=`<strong style="color:var(--green-light)">Çerçeve ${v.toString(16).toUpperCase()}</strong><br>Durum: <span style="color:var(--green-light)">Boş</span>`;else{const h=x[y].indexOf(v);u.innerHTML=`<strong style="color:${f[y]}">Çerçeve ${v.toString(16).toUpperCase().padStart(2,"0")}</strong><br>
              Sahibi: <span style="color:${f[y]}">${k[y]}</span><br>
              Sanal Sayfa No: <span style="color:var(--blue-light)">${h}</span><br>
              Fiziksel Adres: <span style="color:var(--yellow-light)">0x${(v*4096).toString(16).toUpperCase()}</span><br>
              <br><em style="color:var(--text-subtle)">Sanal adreste ${h*4096} görür,<br>gerçekte RAM'de ${v*4096} adresinde.</em>`}}),n.appendChild(b)}}},M=()=>{const n=e.querySelector("#proc-legend");if(n){n.innerHTML="";for(let v=0;v<w;v++){const b=document.createElement("div");b.className="proc-item",b.innerHTML=`<div class="proc-dot" style="background:${f[v]}"></div>
          <span>${k[v]}</span>
          <span style="margin-left:auto;font-size:0.72rem;color:var(--text-muted)">${x[v].length} çerçeve · ${x[v].length*4} KB</span>`,b.addEventListener("click",()=>{for(let y=0;y<32;y++)e.querySelector("#frame-"+y)?.classList.remove("highlighted");x[v].forEach(y=>e.querySelector("#frame-"+y)?.classList.add("highlighted"))}),n.appendChild(b)}}},T=e.querySelector("#alloc-proc");T&&T.addEventListener("click",()=>{if(w>=4){alert("Maksimum 4 process!");return}const n=w++,v=4+Math.floor(Math.random()*5),b=[];for(let u=0;u<32;u++)g[u]||b.push(u);if(b.length<v){alert("Yeterli boş çerçeve yok!"),w--;return}b.sort(()=>Math.random()-.5).slice(0,v).forEach(u=>{g[u]=n,x[n].push(u);const h=e.querySelector("#frame-"+u);h&&(h.className="mem-frame "+z[n],h.textContent="P"+n)}),M()});const R=e.querySelector("#reset-mem");R&&R.addEventListener("click",()=>{g=Array(32).fill(null),x=[[],[],[],[]],w=0,C();const n=e.querySelector("#proc-legend");n&&(n.innerHTML="");const v=e.querySelector("#frame-detail");v&&(v.textContent="Bir çerçeveye tıklayarak detaylarını gör.")}),C()},destroy(){this._timers&&(this._timers.forEach(e=>{clearTimeout(e)}),this._timers=[])}},N={template(){return`
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
    <button class="tab-btn" data-tab="cs-karsilastir">③ VM vs Container</button>
    <button class="tab-btn" data-tab="cs-scheduler">④ Round Robin Scheduler</button>
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

  <!-- TAB 3: VM vs Container -->
  <div id="cs-karsilastir" class="tab-panel">
    <div class="panel-title">VM vs Container — Context Switch Maliyeti</div>
    <div class="panel-sub">Aynı geçiş VM'de kaç adım, Container'da kaç adım?</div>
    <div class="btn-row"><button class="btn btn-primary" id="run-compare">▶ Karşılaştırmayı Başlat</button></div>
    <div class="grid-2">
      <div class="panel-box">
        <div class="panel-box-header ph-purple">🔮 Sanal Makine <span id="vm-step-lbl" style="font-size:0.72rem">—</span></div>
        <div class="panel-box-body" id="vm-timeline">
          ${[["Timer Interrupt (Donanım)","CPU timer donanımı interrupt üretir, Hypervisor'a bildirir","~50 ns","md"],["VM Exit (Hypervisor'a geçiş)","Guest OS → Hypervisor geçişi (VMEXIT). VM state flush edilir","~500-1000 ns","hi"],["Guest OS Context Kaydet","Hypervisor mevcut VM'in tüm register + CPU state'ini kaydeder","~200-500 ns","hi"],["Hypervisor Scheduler","Hangi VM / process'in çalışacağına karar verir","~100 ns","md"],["Guest OS Context Yükle","Yeni process'in tüm register + state'i CPU'ya yüklenir","~200-500 ns","hi"],["VM Entry (Guest'e dönüş)","Hypervisor → Guest OS geçişi (VMENTRY). TLB flush gerekebilir","~500-1000 ns","hi"],["Process Çalışmaya Devam","Yeni process kaldığı yerden devam eder","✓ Tamamlandı","lo"]].map((e,t)=>`
            <div class="timeline-step" id="vm-s${t+1}">
              <div class="step-num" style="background:var(--purple-b);color:var(--purple-light)">${t+1}</div>
              <div class="step-content">
                <div class="step-title">${e[0]}</div>
                <div class="step-desc">${e[1]}</div>
                <span class="step-cost cost-${e[3]}">${e[2]}</span>
              </div>
            </div>`).join("")}
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border-subtle)">
            <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:6px">Toplam Tahmini Süre</div>
            <div style="display:flex;justify-content:space-between;font-size:0.74rem;color:var(--text-muted);margin-bottom:4px"><span>VM Context Switch</span><span>~2-4 μs</span></div>
            <div class="progress-bg"><div class="progress-fill" id="vm-comp-bar" style="width:0%;background:linear-gradient(90deg,var(--purple),var(--purple-light))"></div></div>
          </div>
        </div>
      </div>
      <div class="panel-box">
        <div class="panel-box-header ph-blue">🐳 Docker Container <span id="docker-step-lbl" style="font-size:0.72rem">—</span></div>
        <div class="panel-box-body" id="docker-timeline">
          ${[["Timer Interrupt (Donanım)","CPU timer interrupt, direkt Host Kernel'a iletilir","~50 ns","md"],["Kernel Scheduler Devreye Girer","Linux CFS scheduler doğrudan kararını verir — Hypervisor yok","~50 ns","lo"],["Register'ları Kaydet","Mevcut container process'inin register'ları kernel stack'e kaydedilir","~50-100 ns","lo"],["Namespace Geçişi","PID/net namespace değiştirilir — Docker'a özgü ek adım","~10-50 ns","md"],["Register'ları Yükle & Devam","Yeni container process'i yüklenir ve çalışmaya başlar","✓ Tamamlandı","lo"]].map((e,t)=>`
            <div class="timeline-step" id="dk-s${t+1}">
              <div class="step-num" style="background:var(--blue-b);color:var(--blue-light)">${t+1}</div>
              <div class="step-content">
                <div class="step-title">${e[0]}</div>
                <div class="step-desc">${e[1]}</div>
                <span class="step-cost cost-${e[3]}">${e[2]}</span>
              </div>
            </div>`).join("")}
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border-subtle)">
            <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:6px">Toplam Tahmini Süre</div>
            <div style="display:flex;justify-content:space-between;font-size:0.74px;color:var(--text-muted);margin-bottom:4px"><span>Container Context Switch</span><span>~0.2-0.5 μs</span></div>
            <div class="progress-bg"><div class="progress-fill" id="dk-comp-bar" style="width:0%;background:linear-gradient(90deg,var(--blue),var(--blue-light))"></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- TAB 4: Round Robin -->
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
</div>
`},init(e){this._timers=[],e.querySelectorAll(".tab-btn").forEach(k=>{k.addEventListener("click",()=>{e.querySelectorAll(".tab-btn").forEach(g=>g.classList.remove("active")),e.querySelectorAll(".tab-panel").forEach(g=>g.classList.remove("active")),k.classList.add("active");const f=e.querySelector("#"+k.dataset.tab);f&&f.classList.add("active")})});const t=[{log:`<span class="log-warn">⏰ [1] Timer Interrupt! Process A'nın time quantum doldu.</span>`,cpu:{text:"INTERRUPT",state:"Interrupt alındı — switch başlıyor",cls:"saving"},procs:{A:"running",B:"ready",C:"waiting"},regs:{pc:"0x1A40",sp:"0xFF80",r1:"0x12",r2:"0x34",r3:"0x7E",r4:"0x01"},kernel:"interrupt_handler()"},{log:`<span class="log-miss">💾 [2] Process A'nın context'i kaydediliyor (PCB'ye yazılıyor)...</span>`,cpu:{text:"SAVING A",state:"Process A context kaydediliyor...",cls:"saving"},procs:{A:"switching-out",B:"ready",C:"waiting"},regs:{pc:"0x1A40",sp:"0xFF80",r1:"0x12",r2:"0x34",r3:"0x7E",r4:"0x01"},kernel:`save_context(A)
PC=0x1A40
SP=0xFF80`,pcbA:"saved"},{log:'<span class="log-warn">📋 [3] Scheduler: sıradaki process seçiliyor → Process B</span>',cpu:{text:"SCHEDULER",state:"Scheduler: Process B seçildi",cls:""},procs:{A:"waiting",B:"ready",C:"waiting"},regs:{pc:"????",sp:"????",r1:"??",r2:"??",r3:"??",r4:"??"},kernel:`schedule()
→ next = B`},{log:`<span class="log-info">📥 [4] Process B'nin context'i yükleniyor (PCB'den okunuyor)...</span>`,cpu:{text:"LOADING B",state:"Process B context yükleniyor...",cls:"loading"},procs:{A:"waiting",B:"switching-in",C:"waiting"},regs:{pc:"0x3C20",sp:"0xEE40",r1:"0xAB",r2:"0xCD",r3:"0x55",r4:"0xEF"},kernel:`load_context(B)
PC=0x3C20
SP=0xEE40`,pcbB:"loaded"},{log:`<span class="log-ok">✅ [5] Process B CPU'da çalışmaya başladı!</span>`,cpu:{text:"Process B",state:"Çalışıyor — kaldığı yerden devam",cls:"running"},procs:{A:"waiting",B:"running",C:"waiting"},regs:{pc:"0x3C22",sp:"0xEE40",r1:"0xAB",r2:"0xCE",r3:"0x55",r4:"0xEF"},kernel:"ret_to_user(B)",pcbB:"running"}];let r=0;const p={running:["running","s-run","RUNNING"],ready:["ready","s-rdy","READY"],waiting:["waiting","s-wait","WAITING"],"switching-out":["switching-out","s-out","SAVING..."],"switching-in":["switching-in","s-in","LOADING..."]},a=e.querySelector("#step-btn"),s=e.querySelector("#reset-sim"),c=k=>{const f=e.querySelector("#cs-log");f&&(f.innerHTML+="<br>"+k.log,f.scrollTop=f.scrollHeight);const g=e.querySelector("#cpu-core");g&&(g.className="cpu-core "+(k.cpu.cls||""),e.querySelector("#cpu-proc").textContent=k.cpu.text,e.querySelector("#cpu-state").textContent=k.cpu.state),Object.entries(k.regs).forEach(([w,C])=>{const M=e.querySelector("#rv-"+w),T=e.querySelector("#reg-"+w);M&&(M.textContent=C),T&&(T.classList.remove("changed","saving"),T.classList.add(k.cpu.cls==="saving"?"saving":"changed"))}),["A","B","C"].forEach(w=>{const C=k.procs[w],[M,T,R]=p[C],n=e.querySelector("#pc-"+w),v=e.querySelector("#ps-"+w);n&&(n.className="proc-card "+M),v&&(v.className="proc-state-lbl "+T,v.textContent=R)});const x=e.querySelector("#kernel-stack");x&&(x.textContent=k.kernel||""),k.pcbA&&["pcba-pc","pcba-sp","pcba-r1","pcba-r2"].forEach(w=>{const C=e.querySelector("#"+w);C&&(C.className="pcb-entry saved")}),k.pcbB==="loaded"&&["pcbb-pc","pcbb-sp","pcbb-r1","pcbb-r2"].forEach(w=>{const C=e.querySelector("#"+w);C&&(C.className="pcb-entry fresh")})};a&&a.addEventListener("click",()=>{if(r>=t.length)return;c(t[r]),r++;const k=e.querySelector("#step-counter");if(k&&(k.textContent=`Adım: ${r} / ${t.length}`),r>=t.length){a.disabled=!0;const f=e.querySelector("#cs-log");f&&(f.innerHTML+='<br><span class="log-ok">✅ Context switch tamamlandı!</span>')}}),s&&s.addEventListener("click",()=>{r=0,a&&(a.disabled=!1);const k=e.querySelector("#cs-log");k&&(k.innerHTML='<span class="log-info">▶ "Sonraki Adım" butonuna bas ve context switch sürecini izle...</span>');const f=e.querySelector("#cpu-core");f&&(f.className="cpu-core running",e.querySelector("#cpu-proc").textContent="Process A",e.querySelector("#cpu-state").textContent="Çalışıyor");const g=e.querySelector("#step-counter");g&&(g.textContent="Adım: 0 / 5");const x=e.querySelector("#kernel-stack");x&&(x.textContent="boş"),["A","B","C"].forEach((C,M)=>{const T=e.querySelector("#pc-"+C),R=e.querySelector("#ps-"+C),n=["running","ready","waiting"],v=["s-run","s-rdy","s-wait"],b=["RUNNING","READY","WAITING"];T&&(T.className="proc-card "+n[M]),R&&(R.className="proc-state-lbl "+v[M],R.textContent=b[M])}),Object.entries({pc:"0x1A40",sp:"0xFF80",r1:"0x12",r2:"0x34",r3:"0x7E",r4:"0x01"}).forEach(([C,M])=>{const T=e.querySelector("#rv-"+C),R=e.querySelector("#reg-"+C);T&&(T.textContent=M),R&&(R.className="reg")}),["pcba-pc","pcba-sp","pcba-r1","pcba-r2","pcbb-pc","pcbb-sp","pcbb-r1","pcbb-r2"].forEach(C=>{const M=e.querySelector("#"+C);M&&(M.className="pcb-entry")})});const d=e.querySelector("#run-compare");d&&d.addEventListener("click",()=>{for(let g=1;g<=7;g++)e.querySelector("#vm-s"+g)?.classList.remove("active");for(let g=1;g<=5;g++)e.querySelector("#dk-s"+g)?.classList.remove("active");for(let g=1;g<=7;g++){const x=setTimeout(()=>{e.querySelector("#vm-s"+g)?.classList.add("active");const w=e.querySelector("#vm-step-lbl");w&&(w.textContent=`Adım ${g}/7`)},g*450);this._timers.push(x)}for(let g=1;g<=5;g++){const x=setTimeout(()=>{e.querySelector("#dk-s"+g)?.classList.add("active");const w=e.querySelector("#docker-step-lbl");w&&(w.textContent=`Adım ${g}/5`)},g*350);this._timers.push(x)}const k=setTimeout(()=>{const g=e.querySelector("#vm-comp-bar");g&&(g.style.width="88%");const x=e.querySelector("#vm-step-lbl");x&&(x.textContent="✓ ~2-4 μs")},7*450+200),f=setTimeout(()=>{const g=e.querySelector("#dk-comp-bar");g&&(g.style.width="22%");const x=e.querySelector("#docker-step-lbl");x&&(x.textContent="✓ ~0.2-0.5 μs")},5*350+200);this._timers.push(k,f)});const l={P1:"#f6ad55",P2:"#63b3ed",P3:"#68d391",P4:"#b794f4"},o={P1:"#744210",P2:"#1a365d",P3:"#1a3a1a",P4:"#2d1b4e"},i={P1:6,P2:4,P3:8,P4:3},m=e.querySelector("#quantum-slider"),S=e.querySelector("#quantum-val");m&&m.addEventListener("input",()=>{S&&(S.textContent=m.value)});const q=e.querySelector("#run-scheduler");q&&q.addEventListener("click",()=>{const k=parseInt(m?.value||"2"),f=Object.entries(i).map(([u,h])=>({name:u,burst:h,remaining:h})),g=[];let x=[...f],w=0;const C={};for(;x.length>0;){const u=x.shift(),h=Math.min(k,u.remaining);for(let L=0;L<h;L++)g.push(u.name);w+=h,u.remaining-=h,u.remaining>0?x.push(u):C[u.name]=w}const M=e.querySelector("#ready-queue"),T=e.querySelector("#running-queue"),R=e.querySelector("#done-queue"),n=e.querySelector("#gantt-row");if(!n)return;M.innerHTML="",T.innerHTML="",R.innerHTML="",f.forEach(u=>{const h=document.createElement("div");h.className="q-proc q-rdy",h.textContent=u.name+" ("+u.burst+")",h.style.cssText=`background:${o[u.name]};color:${l[u.name]};border-color:${l[u.name]}44`,M.appendChild(h)}),n.innerHTML="",g.forEach(u=>{const h=document.createElement("div");h.className="gantt-slot",h.style.cssText=`width:${100/g.length}%;background:${o[u]};color:${l[u]}`,h.textContent=u,n.appendChild(h)});const v=e.querySelector("#sched-stats");if(v){v.innerHTML="",Object.entries(C).forEach(([L,E])=>{const A=document.createElement("div");A.className="stat-chip",A.style.borderColor=l[L]+"44",A.innerHTML=`<div style="color:${l[L]}">${L}</div><strong style="color:${l[L]}">${E}</strong><div style="font-size:0.66rem;color:var(--text-muted)">turnaround</div>`,v.appendChild(A)});const u=g.filter((L,E)=>E>0&&L!==g[E-1]).length,h=document.createElement("div");h.className="stat-chip",h.style.borderColor="var(--red-light)44",h.innerHTML=`<div style="color:var(--red-light)">Context Switch</div><strong style="color:var(--red-light)">${u}</strong><div style="font-size:0.66rem;color:var(--text-muted)">toplam geçiş</div>`,v.appendChild(h)}let b=0;const y=setInterval(()=>{if(b>=g.length){clearInterval(y);return}const u=g[b];T.innerHTML="";const h=document.createElement("div");h.className="q-proc q-run",h.textContent=u+" ("+(b+1)+")",h.style.cssText=`background:${o[u]};color:${l[u]};border-color:${l[u]}44`,T.appendChild(h),n.children[b]&&n.children[b].classList.add("lit"),b++},280);this._timers.push(y)});const z=e.querySelector("#reset-scheduler");z&&z.addEventListener("click",()=>{["running-queue","ready-queue","done-queue"].forEach(g=>{const x=e.querySelector("#"+g);x&&(x.innerHTML="")});const k=e.querySelector("#gantt-row");k&&(k.innerHTML="");const f=e.querySelector("#sched-stats");f&&(f.innerHTML="")})},destroy(){this._timers&&(this._timers.forEach(e=>{clearInterval(e),clearTimeout(e)}),this._timers=[])}},O={template(){return`
<style>
.ring-wrap { max-width:860px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:32px; }
.ring-diagram { position:relative; display:flex; align-items:center; justify-content:center; width:320px; height:320px; margin:0 auto; }
.ring-circle {
  position:absolute; border-radius:50%; display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:all 0.3s; border:2px solid transparent;
}
.ring-circle:hover { filter:brightness(1.2); }
.ring-circle.active { filter:brightness(1.3); box-shadow:0 0 24px rgba(255,255,255,0.15); }
.r0 { width:110px; height:110px; background:radial-gradient(circle,#7b2d8b,var(--purple-b)); border-color:var(--purple-light); z-index:4; }
.r1 { width:170px; height:170px; background:radial-gradient(circle,#2a4a7a,var(--blue-b)); border-color:var(--blue-light); z-index:3; }
.r2 { width:230px; height:230px; background:radial-gradient(circle,#1a3a2a,var(--green-b)); border-color:var(--green-light); z-index:2; }
.r3 { width:310px; height:310px; background:radial-gradient(circle,#2a2a1a,var(--yellow-b)); border-color:var(--yellow-light); z-index:1; }
.ring-label { text-align:center; pointer-events:none; }
.ring-label .rnum { font-size:0.72rem; font-weight:800; letter-spacing:1px; }
.ring-label .rname { font-size:0.52rem; color:rgba(255,255,255,0.65); margin-top:2px; }

.ring-info-panel { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-lg); padding:20px; min-height:300px; }
.ring-info-panel h3 { font-size:0.95rem; margin-bottom:10px; }
.ring-info-panel p { font-size:0.8rem; color:var(--text-muted); line-height:1.65; margin-bottom:10px; }
.perm-list { list-style:none; }
.perm-list li { font-size:0.76rem; padding:5px 0; border-bottom:1px solid var(--border-subtle); display:flex; gap:8px; }
.perm-list li:last-child { border:none; }

.priv-meter { padding:10px 14px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-md); margin-top:14px; }
.priv-meter label { font-size:0.7rem; color:var(--text-muted); display:block; margin-bottom:6px; }

/* Syscall */
.syscall-scene {
  display:grid; grid-template-columns:1fr 54px 1fr; gap:0;
  background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-lg);
  overflow:hidden; margin-bottom:18px;
}
.scene-side { padding:18px; min-height:320px; }
.ring3-side  { background:#1a200a; border-right:1px solid var(--border); }
.ring0-side  { background:#1a0a2a; }
.scene-title { font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; display:flex; align-items:center; gap:6px; }
.scene-center {
  background:var(--bg-input); display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:6px; position:relative;
}
.barrier-line {
  width:2px; height:100%; position:absolute;
  background:repeating-linear-gradient(to bottom,var(--border) 0px,var(--border) 6px,transparent 6px,transparent 12px);
}
.sc-arrow { font-size:1.4rem; z-index:2; transition:all 0.4s; }
.sc-arrow-lbl { font-size:0.58rem; color:var(--text-muted); z-index:2; text-align:center; }
.sc-btns { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-bottom:16px; }
.sc-btn {
  padding:8px 16px; border-radius:var(--r-md); border:1px solid var(--border);
  font-size:0.78rem; cursor:pointer; color:var(--text); background:var(--bg-card);
  transition:all 0.2s; font-family:var(--font-mono);
}
.sc-btn:hover { background:var(--bg-card-2); border-color:var(--border-active); }
.sc-btn.active-sc { background:var(--purple-b); border-color:var(--purple); color:var(--purple-light); }

/* VM Ring layers */
.vm-layer {
  padding:11px 16px; border-radius:7px; font-size:0.8rem; font-weight:500;
  display:flex; justify-content:space-between; align-items:center;
  transition:all 0.3s; cursor:pointer; border:1px solid transparent; margin-bottom:4px;
}
.vm-layer:hover { filter:brightness(1.12); border-color:rgba(255,255,255,0.12); }
.vl-app    { background:#1a200a; color:var(--green-light); }
.vl-guestos{ background:var(--blue-b); color:var(--blue-light); }
.vl-hyp    { background:var(--purple-b); color:var(--purple-light); }
.vl-hw     { background:var(--yellow-b); color:var(--yellow-light); }
.ring-badge { font-size:0.62rem; padding:2px 7px; border-radius:8px; font-weight:700; }
.rb-r0 { background:var(--purple-b); color:var(--purple-light); }
.rb-r1 { background:var(--blue-b);   color:var(--blue-light); }
.rb-r3 { background:var(--yellow-b); color:var(--yellow-light); }
.layer-detail { margin-top:14px; padding:13px; background:var(--bg-card-2); border:1px solid var(--border); border-radius:var(--r-md); font-size:0.78rem; color:var(--text-muted); min-height:65px; line-height:1.6; }
.layer-detail h4 { color:var(--text); margin-bottom:5px; }
</style>

<div class="module-page">
  <div class="module-header">
    <div class="module-header-left">
      <div class="module-header-icon" style="background:var(--purple-b)">🛡️</div>
      <div>
        <h1>CPU Privilege Ring'leri</h1>
        <p>Ring 0 (Kernel Mode) vs Ring 3 (User Mode) — Donanım Düzeyinde Koruma</p>
      </div>
    </div>
    <span class="module-badge">İnteraktif</span>
  </div>

  <div class="module-tabs">
    <button class="tab-btn active" data-tab="cr-nedir">① Ring Nedir?</button>
    <button class="tab-btn" data-tab="cr-diagram">② Ring Diyagramı</button>
    <button class="tab-btn" data-tab="cr-syscall">③ Syscall Simülasyonu</button>
    <button class="tab-btn" data-tab="cr-vmring">④ VM vs Container Ring</button>
    <button class="tab-btn" data-tab="cr-quiz">⑤ Mini Quiz</button>
  </div>

  <!-- TAB 1 -->
  <div id="cr-nedir" class="tab-panel active">
    <div class="panel-title">CPU Privilege Ring'leri Nedir?</div>
    <div class="panel-sub">Donanım, yazılımın ne yapabileceğini seviyelere göre kısıtlar</div>
    <div class="concept-grid">
      <div class="concept-card">
        <h3>🛡️ Neden Gerekli?</h3>
        <p>Bir uygulama kazara <span class="hl-r">donanıma doğrudan erişse</span> sistemi çökertebilir. CPU, hangi kodun ne yapabileceğini donanım seviyesinde kısıtlar. Ring (halka) mimarisiyle sağlanır.</p>
      </div>
      <div class="concept-card">
        <h3>💍 4 Ring Seviyesi</h3>
        <p>x86 mimarisinde <span class="hl-p">Ring 0'dan Ring 3'e</span> kadar 4 seviye. <span class="hl-r">Ring 0 en yetkili</span> (kernel), <span class="hl-g">Ring 3 en kısıtlı</span> (kullanıcı uygulamaları). Pratikte çoğu OS yalnızca 0 ve 3'ü kullanır.</p>
      </div>
      <div class="concept-card">
        <h3>⚙️ Ring 0 — Kernel Mode</h3>
        <p>İşletim sistemi çekirdeği burada çalışır. <span class="hl-r">Tüm donanıma doğrudan erişim</span> var: RAM, disk, CPU register'ları, I/O portları. Bir hata tüm sistemi çökertebilir.</p>
      </div>
      <div class="concept-card">
        <h3>👤 Ring 3 — User Mode</h3>
        <p>Tüm uygulamalar burada çalışır. <span class="hl-g">Donanıma doğrudan erişim yasak.</span> Bir şey yapmak isterlerse <span class="hl-y">Sistem Çağrısı (Syscall)</span> ile kernel'dan ricada bulunurlar.</p>
      </div>
      <div class="concept-card">
        <h3>🔄 Ring Geçişi (Syscall)</h3>
        <p>Uygulama disk okumak istediğinde: <span class="hl-g">Ring 3</span> → <span class="hl-y">TRAP/INT</span> → <span class="hl-r">Ring 0</span> (kernel işlemi yapar) → <span class="hl-y">return</span> → <span class="hl-g">Ring 3</span>. Bu geçiş <span class="hl-y">yüzlerce nanosaniye</span> sürer.</p>
      </div>
      <div class="concept-card">
        <h3>🔮 VM'de Ring'ler</h3>
        <p>VM'de Guest OS Ring 0'da çalışmak ister ama Hypervisor buna izin vermez. <span class="hl-p">Hypervisor gerçek Ring 0'dadır.</span> Her ayrıcalıklı komut ekstra <span class="hl-y">VMEXIT</span> maliyeti yaratır.</p>
      </div>
    </div>
    <div class="info-callout" style="background:#1a0a0a;border:1px solid rgba(197,48,48,0.3)">
      <h3 style="color:var(--red-light)">🚦 Trafik Işığı Analojisi</h3>
      <p>Şehirde herkes araba kullanabilir (<strong style="color:var(--green-light)">Ring 3</strong>) ama kırmızı ışıkta durmak zorunda.
      Ambulans (<strong style="color:var(--red-light)">Ring 0 / Kernel</strong>) tüm kurallara rağmen ışığı geçebilir.
      Normal sürücü (<strong style="color:var(--green-light)">uygulama</strong>) ambulans çağırmak isterse (<strong style="color:var(--yellow-light)">syscall</strong>)
      112'yi arar, ambulans gelir işi halleder, geri döner. Direksiyonu kendisi alamaz.</p>
    </div>
  </div>

  <!-- TAB 2: Ring Diyagramı -->
  <div id="cr-diagram" class="tab-panel">
    <div class="panel-title">Ring Mimarisi Diyagramı</div>
    <div class="panel-sub">Bir ring'e tıkla — ne çalışır, ne yapabilir?</div>
    <div class="ring-wrap">
      <div style="display:flex;align-items:center;justify-content:center">
        <div class="ring-diagram">
          <div class="ring-circle r3" data-ring="3">
            <div style="width:230px;height:230px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:16px">
              <div class="ring-label">
                <div class="rnum" style="color:var(--yellow-light)">RING 3</div>
                <div class="rname">User Mode</div>
              </div>
            </div>
          </div>
          <div class="ring-circle r2" data-ring="2">
            <div style="width:170px;height:170px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:12px">
              <div class="ring-label">
                <div class="rnum" style="color:var(--green-light)">RING 2</div>
                <div class="rname">Device Drivers</div>
              </div>
            </div>
          </div>
          <div class="ring-circle r1" data-ring="1">
            <div style="width:110px;height:110px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:10px">
              <div class="ring-label">
                <div class="rnum" style="color:var(--blue-light)">RING 1</div>
                <div class="rname">OS Services</div>
              </div>
            </div>
          </div>
          <div class="ring-circle r0" data-ring="0">
            <div class="ring-label">
              <div class="rnum" style="color:var(--purple-light)">RING 0</div>
              <div class="rname">Kernel</div>
            </div>
          </div>
        </div>
      </div>
      <div class="ring-info-panel" id="ring-info-panel">
        <h3 style="color:var(--text-muted)">💡 Bir ring'e tıkla</h3>
        <p>Diyagramdaki halkalara tıklayarak her seviyenin ne çalıştırdığını, hangi izinlere sahip olduğunu öğren.</p>
      </div>
    </div>
    <div style="max-width:860px;margin:20px auto 0">
      <div class="priv-meter">
        <label>Ayrıcalık Seviyesi (Privilege Level) — seçili ring için</label>
        <div class="progress-bg"><div class="progress-fill" id="priv-bar" style="width:0%;background:var(--text-subtle)"></div></div>
      </div>
    </div>
  </div>

  <!-- TAB 3: Syscall -->
  <div id="cr-syscall" class="tab-panel">
    <div class="panel-title">Sistem Çağrısı (Syscall) Simülasyonu</div>
    <div class="panel-sub">Uygulama bir şey yapmak istediğinde Ring 3 → Ring 0 geçişi nasıl olur?</div>
    <div style="max-width:900px;margin:0 auto">
      <div class="sc-btns">
        <button class="sc-btn" data-syscall="read">📖 read()</button>
        <button class="sc-btn" data-syscall="write">✏️ write()</button>
        <button class="sc-btn" data-syscall="malloc">🧠 malloc()</button>
        <button class="sc-btn" data-syscall="fork">🍴 fork()</button>
        <button class="sc-btn" data-syscall="socket">🌐 socket()</button>
      </div>
      <div class="syscall-scene">
        <div class="scene-side ring3-side">
          <div class="scene-title" style="color:var(--green-light)">👤 RING 3 — User Space</div>
          <div class="code-block" id="user-code">
            <div class="code-line cm">// Uygulama kodu</div>
            <div class="code-line"><span class="kw">int</span> main() {</div>
            <div class="code-line">  <span class="cm">// syscall seç →</span></div>
            <div class="code-line">}</div>
          </div>
          <div style="font-size:0.72rem;color:var(--text-subtle);margin-top:8px">CPU Privilege: <span style="color:var(--yellow-light);font-weight:700">CPL = 3</span></div>
        </div>
        <div class="scene-center">
          <div class="barrier-line"></div>
          <div class="sc-arrow" id="sc-up" style="opacity:0.2">⬆</div>
          <div class="sc-arrow-lbl">TRAP /<br>SYSENTER</div>
          <div class="sc-arrow" id="sc-down" style="opacity:0.2">⬇</div>
          <div class="sc-arrow-lbl">IRET /<br>SYSEXIT</div>
        </div>
        <div class="scene-side ring0-side">
          <div class="scene-title" style="color:var(--purple-light)">⚙️ RING 0 — Kernel Space</div>
          <div class="code-block" id="kernel-code">
            <div class="code-line cm">// Kernel kodu</div>
            <div class="code-line cm">// bekleniyor...</div>
          </div>
          <div style="font-size:0.72rem;color:var(--text-subtle);margin-top:8px">CPU Privilege: <span style="color:var(--purple-light);font-weight:700">CPL = 0</span></div>
        </div>
      </div>
      <div class="sim-log" id="sc-log"><span style="color:var(--text-subtle)">▶ Yukarıdan bir sistem çağrısı seç...</span></div>
    </div>
  </div>

  <!-- TAB 4: VM vs Container Ring -->
  <div id="cr-vmring" class="tab-panel">
    <div class="panel-title">VM vs Container — Ring Seviyeleri</div>
    <div class="panel-sub">Katmanlara tıkla — hangi ring'de çalışıyor, neden farklı?</div>
    <div style="max-width:960px;margin:0 auto">
      <div class="grid-2" style="margin-bottom:20px">
        <div>
          <div style="font-size:1rem;font-weight:700;text-align:center;padding:10px;border-radius:8px;background:var(--purple-b);color:var(--purple-light);margin-bottom:10px">🔮 Sanal Makine</div>
          <div class="vm-layer vl-app"    data-vring="vm-app">    <span>🧩 Guest Uygulama</span>          <span class="ring-badge rb-r3">Ring 3</span></div>
          <div style="text-align:center;color:var(--text-subtle);font-size:0.76rem;padding:2px 0">↓ syscall</div>
          <div class="vm-layer vl-guestos" data-vring="vm-guestos"><span>🖥️ Guest OS Kernel</span>        <span class="ring-badge rb-r1">Ring 1 / vRing 0</span></div>
          <div style="text-align:center;color:var(--text-subtle);font-size:0.76rem;padding:2px 0">↓ VMEXIT</div>
          <div class="vm-layer vl-hyp"    data-vring="vm-hyp">    <span>🔷 Hypervisor</span>              <span class="ring-badge rb-r0">Ring 0</span></div>
          <div style="text-align:center;color:var(--text-subtle);font-size:0.76rem;padding:2px 0">↓ doğrudan</div>
          <div class="vm-layer vl-hw"     data-vring="vm-hw">     <span>💾 Fiziksel Donanım</span>        <span class="ring-badge" style="background:var(--yellow-b);color:var(--yellow-light)">HW</span></div>
          <div class="layer-detail" id="vm-ring-detail"><h4>💡 Bir katmana tıkla</h4>VM mimarisinde hangi yazılımın hangi ring seviyesinde çalıştığını görmek için tıkla.</div>
        </div>
        <div>
          <div style="font-size:1rem;font-weight:700;text-align:center;padding:10px;border-radius:8px;background:var(--blue-b);color:var(--blue-light);margin-bottom:10px">🐳 Docker Container</div>
          <div class="vm-layer vl-app"    data-vring="dk-app">    <span>🧩 Container Uygulaması</span>    <span class="ring-badge rb-r3">Ring 3</span></div>
          <div style="text-align:center;color:var(--text-subtle);font-size:0.76rem;padding:2px 0">↓ syscall (doğrudan)</div>
          <div class="vm-layer vl-guestos" data-vring="dk-hostos"> <span>⚙️ Host OS Kernel</span>          <span class="ring-badge rb-r0">Ring 0</span></div>
          <div style="text-align:center;color:var(--text-subtle);font-size:0.76rem;padding:2px 0">↓ doğrudan</div>
          <div class="vm-layer vl-hw"     data-vring="dk-hw">     <span>💾 Fiziksel Donanım</span>        <span class="ring-badge" style="background:var(--yellow-b);color:var(--yellow-light)">HW</span></div>
          <div class="layer-detail" id="dk-ring-detail"><h4>💡 Bir katmana tıkla</h4>Docker mimarisinde ek Hypervisor katmanı yoktur — syscall doğrudan Host Kernel'a gider.</div>
        </div>
      </div>
      <div class="info-callout" style="background:var(--bg-card);border:1px solid var(--border)">
        <h4 style="color:var(--yellow-light);margin-bottom:8px">⚡ Kritik Fark: VMEXIT Maliyeti</h4>
        <p style="font-size:0.82rem;color:var(--text-muted);line-height:1.7">
          VM'de Guest OS bir syscall yaptığında önce <strong style="color:var(--purple-light)">kendi Ring 0'ına</strong> (vRing 0) gider,
          sonra Hypervisor araya girerek <strong style="color:var(--red-light)">VMEXIT</strong> üretir.
          Bu çift geçiş <strong style="color:var(--red-light)">~500-2000 ns</strong> ekstra maliyet demektir.
          Docker'da böyle bir katman yoktur — syscall <strong style="color:var(--green-light)">tek seferde doğrudan</strong> Host Kernel'a ulaşır.
        </p>
      </div>
    </div>
  </div>

  <!-- TAB 5: Quiz -->
  <div id="cr-quiz" class="tab-panel">
    <div class="panel-title">Mini Quiz — Ring Mimarisi</div>
    <div class="panel-sub">Ne kadar anladın?</div>
    <div id="quiz-wrap"></div>
  </div>
</div>
`},init(e){this._timers=[],e.querySelectorAll(".tab-btn").forEach(c=>{c.addEventListener("click",()=>{e.querySelectorAll(".tab-btn").forEach(l=>l.classList.remove("active")),e.querySelectorAll(".tab-panel").forEach(l=>l.classList.remove("active")),c.classList.add("active");const d=e.querySelector("#"+c.dataset.tab);d&&d.classList.add("active")})});const t={0:{title:"⚙️ Ring 0 — Kernel Mode",color:"var(--purple-light)",priv:100,desc:"En yüksek ayrıcalık seviyesi. İşletim sistemi çekirdeği burada çalışır. CPU'nun tüm komutlarına ve tüm bellek adreslerine doğrudan erişim hakkı vardır.",perms:[["✅","Tüm CPU komutlarını çalıştırabilir"],["✅","Fiziksel belleğe doğrudan erişebilir"],["✅","I/O portlarını kullanabilir"],["✅","Interrupt tablolarını değiştirebilir"],["⚠️","Hata tüm sistemi çökertebilir (BSoD)"]]},1:{title:"🔵 Ring 1 — OS Servisleri",color:"var(--blue-light)",priv:65,desc:"Teorik olarak OS servisleri için. Pratikte modern OS'ler bunu kullanmaz. Bazı Hypervisor'lar Guest OS'i burada çalıştırır.",perms:[["✅","Çoğu CPU komutunu çalıştırabilir"],["⚠️","Bazı I/O işlemleri kısıtlı"],["❌","Tüm fiziksel belleğe erişemez"],["💡","VM'de Guest OS bazen burada çalışır"]]},2:{title:"🟢 Ring 2 — Aygıt Sürücüleri",color:"var(--green-light)",priv:35,desc:"Teorik olarak device driver'lar için. Modern Linux ve Windows bu seviyeyi kullanmaz.",perms:[["✅","Kullanıcı modu komutları çalışır"],["⚠️","Bazı ayrıcalıklı komutlara kısıtlı erişim"],["❌","Doğrudan donanım erişimi yok"],["💡","Günümüzde neredeyse kullanılmıyor"]]},3:{title:"👤 Ring 3 — User Mode",color:"var(--yellow-light)",priv:10,desc:"En düşük ayrıcalık seviyesi. Tüm kullanıcı uygulamaları burada çalışır. Donanıma doğrudan erişemezler.",perms:[["✅","Normal hesaplama yapabilir"],["✅","Kendi bellek alanını okuyabilir/yazabilir"],["❌","I/O portlarına erişemez"],["❌","Ayrıcalıklı CPU komutlarını çalıştıramaz"],["🔄","Syscall ile kernel'dan yardım alır"]]}};e.querySelectorAll("[data-ring]").forEach(c=>{c.addEventListener("click",()=>{e.querySelectorAll("[data-ring]").forEach(i=>i.classList.remove("active")),c.classList.add("active");const d=t[parseInt(c.dataset.ring)],l=e.querySelector("#ring-info-panel");l&&(l.innerHTML=`
          <h3 style="color:${d.color};margin-bottom:10px">${d.title}</h3>
          <p>${d.desc}</p>
          <ul class="perm-list">${d.perms.map(([i,m])=>`<li><span>${i}</span><span>${m}</span></li>`).join("")}</ul>`);const o=e.querySelector("#priv-bar");o&&(o.style.width=d.priv+"%",o.style.background=d.priv>70?"var(--purple-light)":d.priv>40?"var(--blue-light)":d.priv>20?"var(--green-light)":"var(--yellow-light)")})});const r={read:{userCode:['<span class="cm">// Dosya açma</span>','<span class="kw">int</span> fd = <span class="fn">open</span>(<span class="str">"veri.txt"</span>, O_RDONLY);','<span class="kw">char</span> buf[<span class="num">128</span>];','<span class="fn active">read</span>(fd, buf, <span class="num">128</span>);  <span class="cm">← syscall!</span>','<span class="cm">// Ring 3 bekliyor...</span>'],kernelCode:['<span class="cm">// sys_read() çağrıldı</span>','<span class="fn">verify_fd</span>(fd);','<span class="fn">check_permissions</span>(file);','<span class="fn">disk_read</span>(file, buf, <span class="num">128</span>);','<span class="fn">copy_to_user</span>(buf);'],steps:['<span class="log-app">[Ring 3] read() çağrıldı → TRAP komutu üretiliyor</span>','<span class="log-trap">[TRAP]  CPU Ring 3 → Ring 0 geçişi (CPL: 3→0)</span>','<span class="log-kern">[Ring 0] sys_read() — dosya izinleri kontrol ediliyor</span>',`<span class="log-kern">[Ring 0] Disk'ten veri okunuyor — DMA transfer başlatılıyor</span>`,`<span class="log-kern">[Ring 0] Veri user space buffer'ına kopyalanıyor</span>`,'<span class="log-ret">[IRET]  CPU Ring 0 → Ring 3 dönüyor (CPL: 0→3) — veri hazır</span>']},write:{userCode:['<span class="cm">// Ekrana yazma</span>','<span class="kw">char</span>* msg = <span class="str">"Merhaba!"</span>;','<span class="fn active">write</span>(STDOUT, msg, <span class="num">8</span>);  <span class="cm">← syscall!</span>','<span class="cm">// Ring 3 bekliyor...</span>'],kernelCode:['<span class="cm">// sys_write() çağrıldı</span>','<span class="fn">verify_fd</span>(STDOUT);','<span class="fn">copy_from_user</span>(msg);','<span class="fn">terminal_write</span>(msg, <span class="num">8</span>);',`<span class="cm">// STDOUT'a yazıldı ✓</span>`],steps:['<span class="log-app">[Ring 3] write() çağrıldı → SYSENTER komutu</span>','<span class="log-trap">[TRAP]  Ring 3 → Ring 0 geçişi (CPL: 3→0)</span>','<span class="log-kern">[Ring 0] sys_write() — STDOUT geçerli mi kontrol et</span>',`<span class="log-kern">[Ring 0] Mesaj User Space'den Kernel'e kopyalanıyor</span>`,'<span class="log-kern">[Ring 0] Terminal sürücüsüne yazılıyor</span>','<span class="log-ret">[SYSEXIT] Ring 0 → Ring 3 dönüş (CPL: 0→3)</span>']},malloc:{userCode:['<span class="cm">// Bellek tahsisi</span>','<span class="kw">int</span>* arr = (<span class="kw">int</span>*) <span class="fn active">malloc</span>(<span class="num">1024</span>);','<span class="cm">// malloc → brk() syscall!</span>','<span class="cm">// Ring 3 bekliyor...</span>'],kernelCode:['<span class="cm">// sys_brk() çağrıldı</span>','<span class="fn">find_free_pages</span>(<span class="num">1024</span>);','<span class="fn">update_page_table</span>(pid);','<span class="fn">map_virtual_pages</span>();','<span class="cm">// Sanal bellek haritalandı ✓</span>'],steps:['<span class="log-app">[Ring 3] malloc() çağrıldı — C kütüphanesi devreye giriyor</span>',`<span class="log-app">[Ring 3] Yeterli alan yoksa brk() syscall'ı yapılıyor</span>`,'<span class="log-trap">[TRAP]  Ring 3 → Ring 0 geçişi</span>','<span class="log-kern">[Ring 0] sys_brk() — boş fiziksel sayfa aranıyor</span>','<span class="log-kern">[Ring 0] Sayfa tablosu güncelleniyor</span>',`<span class="log-ret">[SYSEXIT] Yeni bellek adresi Ring 3'e döndürülüyor</span>`]},fork:{userCode:['<span class="cm">// Yeni process oluştur</span>','<span class="kw">pid_t</span> pid = <span class="fn active">fork</span>();  <span class="cm">← syscall!</span>','<span class="kw">if</span> (pid == <span class="num">0</span>) {','  <span class="cm">// child process</span>',"}"],kernelCode:['<span class="cm">// sys_fork() çağrıldı</span>','<span class="fn">copy_process</span>(current);','<span class="fn">copy_page_tables</span>();  <span class="cm">← CoW</span>','<span class="fn">copy_file_descriptors</span>();','<span class="fn">add_to_runqueue</span>(child);'],steps:['<span class="log-app">[Ring 3] fork() çağrıldı</span>','<span class="log-trap">[TRAP]  Ring 3 → Ring 0 geçişi</span>','<span class="log-kern">[Ring 0] Mevcut process kopyalanıyor (PCB kopyası)</span>','<span class="log-kern">[Ring 0] Sayfa tabloları kopyalanıyor (Copy-on-Write)</span>','<span class="log-kern">[Ring 0] Child process ready kuyruğuna ekleniyor</span>',`<span class="log-ret">[SYSEXIT] İki kez dönüyor: parent'a child PID, child'a 0</span>`]},socket:{userCode:['<span class="cm">// Ağ soketi oluştur</span>','<span class="kw">int</span> s = <span class="fn active">socket</span>(AF_INET,','         SOCK_STREAM, <span class="num">0</span>);','<span class="cm">// Ring 3 bekliyor...</span>'],kernelCode:['<span class="cm">// sys_socket() çağrıldı</span>','<span class="fn">inet_create</span>(sock);','<span class="fn">alloc_socket_buffer</span>();','<span class="fn">init_tcp_stack</span>(sock);','<span class="fn">return_fd</span>();'],steps:['<span class="log-app">[Ring 3] socket() çağrıldı — TCP bağlantısı isteniyor</span>','<span class="log-trap">[TRAP]  Ring 3 → Ring 0 geçişi</span>','<span class="log-kern">[Ring 0] Ağ protokol stack başlatılıyor</span>',`<span class="log-kern">[Ring 0] Socket buffer'ları kernel heap'te ayrılıyor</span>`,'<span class="log-kern">[Ring 0] TCP/IP stack yapılandırılıyor</span>',`<span class="log-ret">[SYSEXIT] Socket file descriptor Ring 3'e döndürülüyor</span>`]}};e.querySelectorAll("[data-syscall]").forEach(c=>{c.addEventListener("click",()=>{this._timers.forEach(q=>clearTimeout(q)),this._timers=[],e.querySelectorAll("[data-syscall]").forEach(q=>q.classList.remove("active-sc")),c.classList.add("active-sc");const d=r[c.dataset.syscall];if(!d)return;const l=e.querySelector("#user-code"),o=e.querySelector("#kernel-code"),i=e.querySelector("#sc-log"),m=e.querySelector("#sc-up"),S=e.querySelector("#sc-down");i&&(i.innerHTML=""),l&&(l.innerHTML=d.userCode.map(q=>`<div class="code-line">${q}</div>`).join("")),o&&(o.innerHTML='<div class="code-line cm">// bekleniyor...</div>'),m&&(m.style.opacity="0.2",m.style.color="var(--text-muted)"),S&&(S.style.opacity="0.2",S.style.color="var(--text-muted)"),d.steps.forEach((q,z)=>{const k=setTimeout(()=>{if(i&&(i.innerHTML+=q+`
`,i.scrollTop=i.scrollHeight),z===0&&m&&(m.style.opacity="1",m.style.color="var(--yellow-light)"),z===1&&(m&&(m.style.color="var(--red-light)"),o&&(o.innerHTML=d.kernelCode.map(f=>`<div class="code-line">${f}</div>`).join(""))),z>=2&&z<d.steps.length-1){const f=z-2;o?.querySelectorAll(".code-line").forEach((g,x)=>g.classList.toggle("active",x===f))}z===d.steps.length-1&&(S&&(S.style.opacity="1",S.style.color="var(--green-light)"),m&&(m.style.opacity="0.3"),i&&(i.innerHTML+=`<span class="log-ok">✅ Syscall tamamlandı</span>
`))},z*600);this._timers.push(k)})})});const p={"vm-app":{title:"🧩 Guest Uygulama — Ring 3",text:"VM içindeki uygulama Ring 3'te çalışır. Bir şey yapmak istediğinde Guest OS'e syscall gönderir. VM içinde olduğunu bilmez."},"vm-guestos":{title:"🖥️ Guest OS Kernel — Ring 1 / vRing 0",text:`Guest OS normalde Ring 0'da çalışmak ister. Hypervisor gerçek Ring 0'ı tutar. VT-x ile "sanal Ring 0"da çalışır. Her ayrıcalıklı komut VMEXIT üretir.`},"vm-hyp":{title:"🔷 Hypervisor — Gerçek Ring 0",text:"Hypervisor sistemdeki en yetkili yazılımdır. Guest OS'lerin donanıma erişim taleplerini karşılar, aralarındaki izolasyonu sağlar."},"vm-hw":{title:"💾 Fiziksel Donanım",text:"Sadece Hypervisor (Ring 0) doğrudan erişebilir. Guest OS her zaman Hypervisor üzerinden geçmek zorundadır."},"dk-app":{title:"🧩 Container Uygulaması — Ring 3",text:"Container uygulaması da Ring 3'te çalışır. Namespace izolasyonu sayesinde diğer container'lardan haberi yoktur ama aynı kernel'ı paylaşır."},"dk-hostos":{title:"⚙️ Host OS Kernel — Ring 0",text:"Tüm container'ların paylaştığı tek kernel. Container uygulaması syscall yaptığında Hypervisor yoktur — doğrudan bu kernel'a ulaşır."},"dk-hw":{title:"💾 Fiziksel Donanım",text:"Host OS Kernel (Ring 0) doğrudan erişir. Araya giren Hypervisor katmanı yoktur."}};e.querySelectorAll("[data-vring]").forEach(c=>{c.addEventListener("click",()=>{const d=p[c.dataset.vring];if(!d)return;const l=c.dataset.vring.startsWith("vm")?"#vm-ring-detail":"#dk-ring-detail",o=e.querySelector(l);o&&(o.innerHTML=`<h4>${d.title}</h4>${d.text}`)})});const a=[{q:"Hangi ring seviyesinde işletim sistemi çekirdeği çalışır?",opts:["Ring 3","Ring 2","Ring 1","Ring 0"],correct:3,explain:"Ring 0 en yüksek ayrıcalık seviyesidir ve OS kernel'i burada çalışır."},{q:"Bir uygulama dosya okumak istediğinde ne yapar?",opts:["Doğrudan diske erişir","Syscall yaparak kernel'dan yardım ister","Başka bir uygulamadan ister","Hypervisor'a bağlanır"],correct:1,explain:"Ring 3'teki uygulamalar donanıma erişemez. Syscall (TRAP) ile Ring 0'a geçerek kernel'dan yardım alırlar."},{q:`VM'de "VMEXIT" neden maliyetlidir?`,opts:["Uygulamalar yavaş yazıldığı için","Guest OS Ring 0 → Hypervisor Ring 0 geçişi ekstra zaman alır","Docker daha fazla bellek kullandığı için","Sadece TLB temizlenmesi gerektiği için"],correct:1,explain:"Guest OS'in her ayrıcalıklı işleminde CPU durumu kaydedilip Hypervisor'a geçiş yapılır. Bu ~500-2000 ns ekstra maliyet demektir."},{q:"Docker container'larında syscall VM'e kıyasla neden daha hızlıdır?",opts:["Container'lar daha az bellek kullanır","Docker daha iyi yazılmıştır","Hypervisor katmanı yoktur, syscall doğrudan Host Kernel'a gider","Container'lar Ring 0'da çalışır"],correct:2,explain:"Docker'da araya giren Hypervisor yoktur. Syscall Ring 3'ten doğrudan Host Kernel'ın Ring 0'ına ulaşır."},{q:"x86 mimarisinde kaç ring seviyesi vardır?",opts:["2","3","4","8"],correct:2,explain:"x86'da Ring 0'dan Ring 3'e kadar 4 seviye vardır. Modern OS'ler yalnızca Ring 0 (kernel) ve Ring 3 (user) kullanır."}],s=e.querySelector("#quiz-wrap");if(s){const c={};a.forEach((l,o)=>{const i=document.createElement("div");i.className="quiz-card",i.innerHTML=`<div class="quiz-q">${o+1}. ${l.q}</div>
          <div class="quiz-opts">${l.opts.map((m,S)=>`<button class="quiz-opt" data-qi="${o}" data-oi="${S}">${m}</button>`).join("")}</div>
          <div class="quiz-result" id="qres-${o}" style="display:none"></div>`,s.appendChild(i)});const d=document.createElement("div");d.className="quiz-score",d.id="quiz-score",d.style.display="none",s.appendChild(d),s.addEventListener("click",l=>{const o=l.target.closest(".quiz-opt");if(!o)return;const i=parseInt(o.dataset.qi),m=parseInt(o.dataset.oi);if(c[i]!==void 0)return;c[i]=m;const S=a[i];s.querySelectorAll(`[data-qi="${i}"]`).forEach(z=>z.classList.add("answered")),s.querySelector(`[data-qi="${i}"][data-oi="${S.correct}"]`)?.classList.add("correct"),m!==S.correct&&o.classList.add("wrong");const q=e.querySelector(`#qres-${i}`);if(q&&(q.style.display="block",q.className="quiz-result "+(m===S.correct?"result-ok":"result-fail"),q.textContent=(m===S.correct?"✅ Doğru! ":"❌ Yanlış. ")+S.explain),Object.keys(c).length===a.length){const z=Object.entries(c).filter(([f,g])=>a[f].correct===parseInt(g)).length,k=e.querySelector("#quiz-score");k&&(k.style.display="block",k.innerHTML=`${z===a.length?"🏆":z>=3?"👍":"📚"}
              Sonuç: <strong style="color:${z>=4?"var(--green-light)":z>=3?"var(--yellow-light)":"var(--red-light)"}">${z} / ${a.length}</strong>
              <div style="font-size:0.8rem;color:var(--text-muted);margin-top:6px">
                ${z===a.length?"Mükemmel! Ring mimarisini tam anladın.":z>=3?"İyi iş! Birkaç konuyu tekrar gözden geçir.":"Simülasyonları tekrar incele ve dene."}
              </div>`)}})}},destroy(){this._timers&&(this._timers.forEach(e=>{clearTimeout(e)}),this._timers=[])}},I={_timers:[],template(){return`
<style>
  .dma-scene { display:flex; gap:16px; align-items:center; justify-content:center; flex-wrap:wrap; margin:16px 0; }
  .dma-box { background:var(--bg-card); border:2px solid var(--border); border-radius:12px; padding:20px 28px; text-align:center; min-width:110px; transition:all .3s; }
  .dma-box.active { border-color:var(--blue-light); box-shadow:0 0 20px var(--blue-dim); }
  .dma-box.cpu-active { border-color:var(--red-light); box-shadow:0 0 20px var(--red-b); }
  .dma-box.done { border-color:var(--green-light); box-shadow:0 0 12px color-mix(in srgb, var(--green-light) 30%, transparent); }
  .dma-icon { font-size:2rem; margin-bottom:6px; }
  .dma-label { font-size:.75rem; color:var(--text-muted); margin-top:4px; }
  .dma-arrow { font-size:1.5rem; color:var(--text-dim); transition:color .3s; }
  .dma-arrow.active { color:var(--blue-light); }
  .dma-arrow.cpu-active { color:var(--red-light); }
  .dma-progress { height:6px; background:var(--bg-root); border-radius:3px; margin-top:8px; overflow:hidden; }
  .dma-bar { height:100%; width:0%; border-radius:3px; transition:width .4s; }

  .overlay-stack { display:flex; flex-direction:column; gap:6px; max-width:380px; margin:0 auto; }
  .overlay-layer { padding:14px 18px; border-radius:10px; cursor:pointer; border:2px solid transparent; transition:all .2s; font-size:.85rem; font-weight:600; }
  .overlay-layer:hover { transform:translateX(4px); }
  .overlay-layer.selected { border-color: currentColor; transform:translateX(6px); }
  .overlay-layer-detail { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:18px; margin-top:12px; font-size:.85rem; line-height:1.7; }

  .cow-scene { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:16px 0; }
  .cow-box { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:16px; }
  .cow-file { display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:8px; margin:6px 0; font-size:.82rem; font-weight:600; transition:all .3s; cursor:default; }

  .io-compare { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:16px 0; }
  .io-col { background:var(--bg-card); border-radius:14px; padding:18px; }
  .io-step { display:flex; align-items:center; gap:10px; padding:10px 12px; margin:6px 0; border-radius:8px; font-size:.82rem; opacity:0; transform:translateY(10px); transition:all .4s; }
  .io-step.visible { opacity:1; transform:none; }
  .io-step-num { min-width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.72rem; font-weight:700; }

  .layer-journey { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin:16px 0; }
  .journey-col { background:var(--bg-card); border-radius:14px; padding:16px; }
  .journey-step { display:flex; align-items:center; gap:10px; padding:10px 14px; margin:6px 0; border-radius:8px; font-size:.82rem; cursor:default; opacity:0; transform:translateY(8px); transition:all .35s; border-left:3px solid transparent; }
  .journey-step.visible { opacity:1; transform:none; }
  .journey-step:hover { background:var(--bg-root); }
  .journey-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }

  .mode-btns { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px; }
  .mode-btn { padding:8px 18px; border-radius:8px; border:none; cursor:pointer; font-size:.82rem; font-weight:600; transition:all .2s; }
  .mode-btn.active { transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,.3); }
</style>

<div class="module-page">
  <div class="module-header">
    <div class="module-badge">Modül 5</div>
    <h2>💾 Disk I/O & DMA</h2>
    <p>I/O katman yolculuğu, OverlayFS ve Copy-on-Write simülasyonu, DMA transferi ve VM vs Container karşılaştırması.</p>
  </div>

  <div class="module-tabs">
    <button class="tab-btn active" data-tab="tab-nedir">① Disk I/O Nedir?</button>
    <button class="tab-btn" data-tab="tab-katman">② Katman Yolculuğu</button>
    <button class="tab-btn" data-tab="tab-overlay">③ Overlay Filesystem</button>
    <button class="tab-btn" data-tab="tab-dma">④ DMA Simülasyonu</button>
    <button class="tab-btn" data-tab="tab-compare">⑤ VM vs Container I/O</button>
  </div>

  <!-- ① Disk I/O Nedir? -->
  <div class="tab-panel active" id="tab-nedir">
    <div class="concept-grid">
      <div class="concept-card border-blue">
        <div class="concept-icon">💾</div>
        <div class="concept-title">Disk I/O Nedir?</div>
        <div class="concept-body">Disk I/O (Input/Output), işlemcinin depolama aygıtlarıyla (HDD, SSD, NVMe) veri okuma/yazma işlemlerinin bütünüdür. RAM'den yüzlerce kat yavaştır.</div>
      </div>
      <div class="concept-card border-green">
        <div class="concept-icon">📚</div>
        <div class="concept-title">Buffer Cache</div>
        <div class="concept-body">Kernel, sık erişilen disk bloklarını RAM'de önbelleğe alır. Aynı dosyaya ikinci erişimde disk okuma yapmaz, RAM'den döner. Page Cache de denir.</div>
      </div>
      <div class="concept-card border-yellow">
        <div class="concept-icon">🔄</div>
        <div class="concept-title">Blok Aygıtları</div>
        <div class="concept-body">Diskler "blok aygıtları"dır — veriyi sabit boyutlu bloklarda (512B – 4KB) okur/yazar. Karakter aygıtları (fare, terminal) ise byte-byte çalışır.</div>
      </div>
      <div class="concept-card border-purple">
        <div class="concept-icon">⚡</div>
        <div class="concept-title">I/O Scheduler</div>
        <div class="concept-body">Linux çekirdeği CFQ, Deadline veya NONE schedulerlarıyla disk isteklerini sıralar. SSD'lerde NONE (passthrough), HDD'lerde Deadline tercih edilir.</div>
      </div>
      <div class="concept-card border-red">
        <div class="concept-icon">🚦</div>
        <div class="concept-title">Blocking vs Non-Blocking</div>
        <div class="concept-body">Klasik read() sistem çağrısı senkrondur — disk yanıtlayana kadar proses bekler (blocked). O_NONBLOCK veya io_uring ile asenkron I/O mümkündür.</div>
      </div>
      <div class="concept-card border-orange">
        <div class="concept-icon">🗂️</div>
        <div class="concept-title">VFS Katmanı</div>
        <div class="concept-body">Virtual File System, uygulamalar ile gerçek dosya sistemleri (ext4, btrfs, overlay) arasında soyutlama katmanıdır. open/read/write hepsi VFS'e gider.</div>
      </div>
    </div>

    <div class="panel-box" style="margin-top:20px;">
      <h3 style="margin:0 0 14px;font-size:1rem;color:var(--text-bright)">📖 Analoji: Kütüphane Sistemi</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <div style="background:var(--bg-root);border-radius:10px;padding:14px;font-size:.83rem;line-height:1.7;">
          <div style="color:var(--blue-light);font-weight:700;margin-bottom:8px;">💡 Gerçek Kütüphane</div>
          <div>📚 <strong>Kitap rafları</strong> → Disk (kalıcı, yavaş)</div>
          <div>🗃️ <strong>Masa</strong> → RAM (hızlı, geçici)</div>
          <div>📋 <strong>Kütüphaneci</strong> → I/O Scheduler</div>
          <div>📝 <strong>Ödünç defteri</strong> → File Descriptor</div>
          <div>🔖 <strong>Fotokopi</strong> → Copy-on-Write</div>
        </div>
        <div style="background:var(--bg-root);border-radius:10px;padding:14px;font-size:.83rem;line-height:1.7;">
          <div style="color:var(--green-light);font-weight:700;margin-bottom:8px;">⚡ Hız Karşılaştırması</div>
          <div>L1 Cache: <strong style="color:var(--green-light)">~1 ns</strong></div>
          <div>RAM: <strong style="color:var(--blue-light)">~100 ns</strong></div>
          <div>SSD: <strong style="color:var(--yellow-light)">~100 µs</strong></div>
          <div>HDD: <strong style="color:var(--orange-light)">~10 ms</strong></div>
          <div>Network: <strong style="color:var(--red-light)">~150 ms</strong></div>
        </div>
      </div>
    </div>
  </div>

  <!-- ② Katman Yolculuğu -->
  <div class="tab-panel" id="tab-katman">
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px;">
      <button class="btn btn-blue" id="btn-start-journey">▶ Animasyonu Başlat</button>
      <button class="btn btn-outline" id="btn-reset-journey">↺ Sıfırla</button>
    </div>

    <div class="layer-journey">
      <div class="journey-col">
        <div style="text-align:center;margin-bottom:12px;">
          <span style="font-size:1.1rem;font-weight:700;color:var(--blue-light)">🖥️ VM'de read() Yolculuğu</span>
          <div style="font-size:.75rem;color:var(--text-muted);margin-top:4px;">7 katman geçer</div>
        </div>
        <div class="journey-step" data-journey="vm" style="border-left-color:var(--purple-light)">
          <div class="journey-dot" style="background:var(--purple-light)"></div>
          <div><strong>User Space</strong><br><span style="color:var(--text-muted);font-size:.78rem">read(fd, buf, size) çağrısı</span></div>
        </div>
        <div class="journey-step" data-journey="vm" style="border-left-color:var(--blue-light)">
          <div class="journey-dot" style="background:var(--blue-light)"></div>
          <div><strong>glibc / syscall</strong><br><span style="color:var(--text-muted);font-size:.78rem">Ring 3 → Ring 0 geçişi</span></div>
        </div>
        <div class="journey-step" data-journey="vm" style="border-left-color:var(--green-light)">
          <div class="journey-dot" style="background:var(--green-light)"></div>
          <div><strong>Guest Kernel VFS</strong><br><span style="color:var(--text-muted);font-size:.78rem">vfs_read() → dosya sistemi</span></div>
        </div>
        <div class="journey-step" data-journey="vm" style="border-left-color:var(--yellow-light)">
          <div class="journey-dot" style="background:var(--yellow-light)"></div>
          <div><strong>Guest Block Layer</strong><br><span style="color:var(--text-muted);font-size:.78rem">virtio-blk sürücüsü</span></div>
        </div>
        <div class="journey-step" data-journey="vm" style="border-left-color:var(--orange-light)">
          <div class="journey-dot" style="background:var(--orange-light)"></div>
          <div><strong>VMEXIT → Hypervisor</strong><br><span style="color:var(--text-muted);font-size:.78rem">KVM/QEMU kontrolü alır</span></div>
        </div>
        <div class="journey-step" data-journey="vm" style="border-left-color:var(--red-light)">
          <div class="journey-dot" style="background:var(--red-light)"></div>
          <div><strong>Host Kernel VFS</strong><br><span style="color:var(--text-muted);font-size:.78rem">Host dosya sistemine iner</span></div>
        </div>
        <div class="journey-step" data-journey="vm" style="border-left-color:var(--purple-light)">
          <div class="journey-dot" style="background:var(--purple-light)"></div>
          <div><strong>Fiziksel Disk</strong><br><span style="color:var(--text-muted);font-size:.78rem">Gerçek okuma / DMA</span></div>
        </div>
      </div>

      <div class="journey-col">
        <div style="text-align:center;margin-bottom:12px;">
          <span style="font-size:1.1rem;font-weight:700;color:var(--green-light)">🐳 Container'da read() Yolculuğu</span>
          <div style="font-size:.75rem;color:var(--text-muted);margin-top:4px;">5 katman geçer</div>
        </div>
        <div class="journey-step" data-journey="docker" style="border-left-color:var(--purple-light)">
          <div class="journey-dot" style="background:var(--purple-light)"></div>
          <div><strong>User Space</strong><br><span style="color:var(--text-muted);font-size:.78rem">read(fd, buf, size) çağrısı</span></div>
        </div>
        <div class="journey-step" data-journey="docker" style="border-left-color:var(--blue-light)">
          <div class="journey-dot" style="background:var(--blue-light)"></div>
          <div><strong>glibc / syscall</strong><br><span style="color:var(--text-muted);font-size:.78rem">Ring 3 → Ring 0 (host kernel)</span></div>
        </div>
        <div class="journey-step" data-journey="docker" style="border-left-color:var(--green-light)">
          <div class="journey-dot" style="background:var(--green-light)"></div>
          <div><strong>Host Kernel VFS</strong><br><span style="color:var(--text-muted);font-size:.78rem">OverlayFS → ext4</span></div>
        </div>
        <div class="journey-step" data-journey="docker" style="border-left-color:var(--yellow-light)">
          <div class="journey-dot" style="background:var(--yellow-light)"></div>
          <div><strong>Block Layer</strong><br><span style="color:var(--text-muted);font-size:.78rem">NVMe / SCSI sürücüsü</span></div>
        </div>
        <div class="journey-step" data-journey="docker" style="border-left-color:var(--orange-light)">
          <div class="journey-dot" style="background:var(--orange-light)"></div>
          <div><strong>Fiziksel Disk</strong><br><span style="color:var(--text-muted);font-size:.78rem">Gerçek okuma / DMA</span></div>
        </div>
        <div style="margin-top:16px;padding:14px;background:var(--green-b);border-radius:10px;font-size:.82rem;color:var(--green-light);">
          ✅ <strong>2 katman daha az</strong> — VMEXIT ve Guest Block Layer yok. Container doğrudan host kernel üzerinde çalışır.
        </div>
      </div>
    </div>
  </div>

  <!-- ③ Overlay Filesystem -->
  <div class="tab-panel" id="tab-overlay">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
      <div>
        <h3 style="font-size:.95rem;color:var(--text-bright);margin-bottom:12px;">📦 OverlayFS Katmanları</h3>
        <div class="overlay-stack">
          <div class="overlay-layer" data-ol="container" style="background:var(--blue-b);color:var(--blue-light);">
            🔵 Container Layer (upperdir)
          </div>
          <div class="overlay-layer" data-ol="app" style="background:var(--green-b);color:var(--green-light);">
            🟢 App Image Layer
          </div>
          <div class="overlay-layer" data-ol="runtime" style="background:var(--yellow-b);color:var(--yellow-light);">
            🟡 Runtime Layer
          </div>
          <div class="overlay-layer" data-ol="base" style="background:var(--purple-b);color:var(--purple-light);">
            🟣 Base OS Layer (lowerdir)
          </div>
          <div class="overlay-layer" data-ol="merged" style="background:var(--orange-b);color:var(--orange-light);">
            🟠 Merged View (container görür)
          </div>
        </div>
        <div class="overlay-layer-detail" id="ol-detail">
          👆 <span style="color:var(--text-muted)">Bir katmana tıkla</span>
        </div>
      </div>

      <div>
        <h3 style="font-size:.95rem;color:var(--text-bright);margin-bottom:12px;">📝 Copy-on-Write Simülasyonu</h3>
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
          <button class="btn btn-green" id="btn-cow-write">✏️ Dosyayı Değiştir</button>
          <button class="btn btn-outline" id="btn-cow-reset">↺ Sıfırla</button>
        </div>
        <div class="cow-scene">
          <div class="cow-box">
            <div style="font-size:.78rem;color:var(--text-muted);margin-bottom:8px;font-weight:600;">BASE LAYER (lowerdir — read-only)</div>
            <div class="cow-file" id="cow-base-config" style="background:var(--green-b);color:var(--green-light);">📄 config.json</div>
            <div class="cow-file" style="background:var(--green-b);color:var(--green-light);">📄 app.py</div>
            <div class="cow-file" style="background:var(--green-b);color:var(--green-light);">📄 requirements.txt</div>
          </div>
          <div class="cow-box">
            <div style="font-size:.78rem;color:var(--text-muted);margin-bottom:8px;font-weight:600;">CONTAINER LAYER (upperdir — writable)</div>
            <div id="cow-upper-area" style="min-height:80px;display:flex;flex-direction:column;gap:6px;">
              <div style="font-size:.78rem;color:var(--text-dim);font-style:italic;padding:8px;">boş — henüz değişiklik yok</div>
            </div>
          </div>
        </div>
        <div id="cow-log" style="background:var(--bg-root);border-radius:8px;padding:12px;font-size:.78rem;font-family:var(--mono);color:var(--text-dim);min-height:60px;line-height:1.7;"></div>
      </div>
    </div>
  </div>

  <!-- ④ DMA Simülasyonu -->
  <div class="tab-panel" id="tab-dma">
    <div class="mode-btns">
      <button class="mode-btn active" id="btn-mode-polling" style="background:var(--red-b);color:var(--red-light);">⚙️ CPU Polling Modu</button>
      <button class="mode-btn" id="btn-mode-dma" style="background:var(--blue-b);color:var(--blue-light);">⚡ DMA Modu</button>
    </div>

    <div class="dma-scene" id="dma-scene">
      <div class="dma-box" id="dma-cpu">
        <div class="dma-icon">🧠</div>
        <div style="font-weight:700;font-size:.88rem;">CPU</div>
        <div class="dma-label" id="dma-cpu-label">Hazır</div>
        <div class="dma-progress"><div class="dma-bar" id="dma-cpu-bar" style="background:var(--red-light)"></div></div>
      </div>
      <div class="dma-arrow" id="arr-cpu-ram">→</div>
      <div class="dma-box" id="dma-ram">
        <div class="dma-icon">💾</div>
        <div style="font-weight:700;font-size:.88rem;">RAM</div>
        <div class="dma-label" id="dma-ram-label">Boş</div>
        <div class="dma-progress"><div class="dma-bar" id="dma-ram-bar" style="background:var(--green-light)"></div></div>
      </div>
      <div class="dma-arrow" id="arr-ram-disk">→</div>
      <div class="dma-box" id="dma-disk">
        <div class="dma-icon">💿</div>
        <div style="font-weight:700;font-size:.88rem;">Disk</div>
        <div class="dma-label" id="dma-disk-label">Hazır</div>
        <div class="dma-progress"><div class="dma-bar" id="dma-disk-bar" style="background:var(--blue-light)"></div></div>
      </div>
    </div>

    <div style="text-align:center;margin:12px 0;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
      <button class="btn btn-blue" id="btn-dma-start">▶ Simülasyonu Başlat</button>
      <button class="btn btn-outline" id="btn-dma-reset">↺ Sıfırla</button>
    </div>

    <div id="dma-log" class="sim-log" style="height:160px;margin-top:8px;"></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;">
      <div class="panel-box" style="border-color:var(--red-b);">
        <h4 style="color:var(--red-light);margin:0 0 10px;font-size:.9rem;">⚙️ CPU Polling</h4>
        <div style="font-size:.82rem;line-height:1.7;color:var(--text-dim);">
          CPU disk hazır olana kadar sürekli durum sorgular.<br>
          <strong style="color:var(--red-light)">Busy-wait</strong> — CPU transfer süresince bloklanır, başka iş yapamaz.
          Basit donanımda yaygın, modern sistemlerde nadiren kullanılır.
        </div>
      </div>
      <div class="panel-box" style="border-color:var(--blue-b);">
        <h4 style="color:var(--blue-light);margin:0 0 10px;font-size:.9rem;">⚡ DMA (Direct Memory Access)</h4>
        <div style="font-size:.82rem;line-height:1.7;color:var(--text-dim);">
          DMA Controller transfer esnasında CPU'yu serbest bırakır.<br>
          CPU başka işlere devam eder, transfer bitince <strong style="color:var(--blue-light)">interrupt</strong> gelir.
          Modern sistemlerin tamamında kullanılır.
        </div>
      </div>
    </div>
  </div>

  <!-- ⑤ VM vs Container I/O -->
  <div class="tab-panel" id="tab-compare">
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;">
      <button class="btn btn-blue" id="btn-io-anim">▶ Adım Adım Göster</button>
      <button class="btn btn-outline" id="btn-io-reset">↺ Sıfırla</button>
    </div>

    <div class="io-compare">
      <div class="io-col">
        <div style="text-align:center;margin-bottom:14px;">
          <span style="font-size:1rem;font-weight:700;color:var(--orange-light)">🖥️ VM I/O Yolu</span>
          <div style="font-size:.75rem;color:var(--text-muted);">~150-400 µs gecikme</div>
        </div>
        <div class="io-step" data-iostep="vm" style="background:var(--purple-b);">
          <div class="io-step-num" style="background:var(--purple-light);color:#000;">1</div>
          <div><strong>User Space read()</strong><br><span style="font-size:.75rem;color:var(--text-muted);">uygulama sistem çağrısı yapar</span></div>
        </div>
        <div class="io-step" data-iostep="vm" style="background:var(--blue-b);">
          <div class="io-step-num" style="background:var(--blue-light);color:#000;">2</div>
          <div><strong>Guest Kernel VFS</strong><br><span style="font-size:.75rem;color:var(--text-muted);">sanal dosya sistemi katmanı</span></div>
        </div>
        <div class="io-step" data-iostep="vm" style="background:var(--red-b);">
          <div class="io-step-num" style="background:var(--red-light);color:#000;">3</div>
          <div><strong>VMEXIT (kritik!)</strong><br><span style="font-size:.75rem;color:var(--text-muted);">hypervisor'a geçiş, ~5-10 µs</span></div>
        </div>
        <div class="io-step" data-iostep="vm" style="background:var(--yellow-b);">
          <div class="io-step-num" style="background:var(--yellow-light);color:#000;">4</div>
          <div><strong>Hypervisor Emülasyon</strong><br><span style="font-size:.75rem;color:var(--text-muted);">QEMU/KVM disk emülasyonu</span></div>
        </div>
        <div class="io-step" data-iostep="vm" style="background:var(--green-b);">
          <div class="io-step-num" style="background:var(--green-light);color:#000;">5</div>
          <div><strong>Host Kernel VFS</strong><br><span style="font-size:.75rem;color:var(--text-muted);">gerçek dosya sistemi</span></div>
        </div>
        <div class="io-step" data-iostep="vm" style="background:var(--blue-b);">
          <div class="io-step-num" style="background:var(--blue-light);color:#000;">6</div>
          <div><strong>Block Driver</strong><br><span style="font-size:.75rem;color:var(--text-muted);">NVMe/SCSI sürücüsü</span></div>
        </div>
        <div class="io-step" data-iostep="vm" style="background:var(--purple-b);">
          <div class="io-step-num" style="background:var(--purple-light);color:#000;">7</div>
          <div><strong>Fiziksel Disk (DMA)</strong><br><span style="font-size:.75rem;color:var(--text-muted);">gerçek okuma tamamlandı</span></div>
        </div>
      </div>

      <div class="io-col">
        <div style="text-align:center;margin-bottom:14px;">
          <span style="font-size:1rem;font-weight:700;color:var(--green-light)">🐳 Container I/O Yolu</span>
          <div style="font-size:.75rem;color:var(--text-muted);">~50-100 µs gecikme</div>
        </div>
        <div class="io-step" data-iostep="docker" style="background:var(--purple-b);">
          <div class="io-step-num" style="background:var(--purple-light);color:#000;">1</div>
          <div><strong>User Space read()</strong><br><span style="font-size:.75rem;color:var(--text-muted);">aynı sistem çağrısı</span></div>
        </div>
        <div class="io-step" data-iostep="docker" style="background:var(--green-b);">
          <div class="io-step-num" style="background:var(--green-light);color:#000;">2</div>
          <div><strong>Host Kernel VFS</strong><br><span style="font-size:.75rem;color:var(--text-muted);">OverlayFS katmanı</span></div>
        </div>
        <div class="io-step" data-iostep="docker" style="background:var(--blue-b);">
          <div class="io-step-num" style="background:var(--blue-light);color:#000;">3</div>
          <div><strong>OverlayFS Lookup</strong><br><span style="font-size:.75rem;color:var(--text-muted);">upper/lower katman tarama</span></div>
        </div>
        <div class="io-step" data-iostep="docker" style="background:var(--yellow-b);">
          <div class="io-step-num" style="background:var(--yellow-light);color:#000;">4</div>
          <div><strong>Block Driver</strong><br><span style="font-size:.75rem;color:var(--text-muted);">NVMe/SCSI sürücüsü</span></div>
        </div>
        <div class="io-step" data-iostep="docker" style="background:var(--purple-b);">
          <div class="io-step-num" style="background:var(--purple-light);color:#000;">5</div>
          <div><strong>Fiziksel Disk (DMA)</strong><br><span style="font-size:.75rem;color:var(--text-muted);">gerçek okuma tamamlandı</span></div>
        </div>

        <div style="margin-top:20px;padding:14px;background:var(--green-b);border-radius:10px;font-size:.82rem;line-height:1.7;">
          <div style="color:var(--green-light);font-weight:700;margin-bottom:8px;">✅ Neden daha hızlı?</div>
          <div>• VMEXIT yok → hypervisor geçiş maliyeti sıfır</div>
          <div>• Guest Kernel overhead yok</div>
          <div>• Hypervisor emülasyon katmanı yok</div>
          <div>• Toplam <strong>2-3x daha düşük I/O gecikme</strong></div>
        </div>
      </div>
    </div>

    <div style="margin-top:16px;">
      <h4 style="font-size:.9rem;color:var(--text-bright);margin-bottom:12px;">📊 Benchmark Karşılaştırması</h4>
      <div class="sim-table">
        <table>
          <thead><tr><th>Metrik</th><th>VM (KVM+QEMU)</th><th>Container (Docker)</th><th>Fark</th></tr></thead>
          <tbody>
            <tr><td>Sıralı Okuma</td><td style="color:var(--orange-light)">~1.2 GB/s</td><td style="color:var(--green-light)">~3.5 GB/s</td><td style="color:var(--green-light)">~3x</td></tr>
            <tr><td>Rastgele 4K IOPS</td><td style="color:var(--orange-light)">~45K</td><td style="color:var(--green-light)">~120K</td><td style="color:var(--green-light)">~2.7x</td></tr>
            <tr><td>I/O Gecikme (p99)</td><td style="color:var(--orange-light)">~350 µs</td><td style="color:var(--green-light)">~80 µs</td><td style="color:var(--green-light)">~4.4x</td></tr>
            <tr><td>CPU I/O Overhead</td><td style="color:var(--orange-light)">Yüksek (VMEXIT)</td><td style="color:var(--green-light)">Düşük</td><td style="color:var(--green-light)">Belirgin</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
`},init(e){this._timers=[],this._root=e,this._dmaMode="polling",this._dmaRunning=!1,e.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",()=>window.showTab(t.dataset.tab,e))}),this._initKatman(e),this._initOverlay(e),this._initDma(e),this._initCompare(e)},_initKatman(e){const t=e.querySelector("#btn-start-journey"),r=e.querySelector("#btn-reset-journey"),p=e.querySelectorAll(".journey-step"),a=()=>p.forEach(c=>c.classList.remove("visible")),s=()=>{a();const c=e.querySelectorAll('[data-journey="vm"]'),d=e.querySelectorAll('[data-journey="docker"]');c.forEach((o,i)=>{const m=setTimeout(()=>o.classList.add("visible"),i*300);this._timers.push(m)});const l=setTimeout(()=>{d.forEach((o,i)=>{const m=setTimeout(()=>o.classList.add("visible"),i*350);this._timers.push(m)})},c.length*300+200);this._timers.push(l)};t.addEventListener("click",s),r.addEventListener("click",a)},_initOverlay(e){const t={container:{title:"🔵 Container Layer (upperdir)",text:"Yazılabilir katman. Container içinde yapılan tüm değişiklikler (yeni dosya, silme, düzenleme) bu katmana yazılır. Container silinince bu katman da silinir. <strong>Geçicidir.</strong>"},app:{title:"🟢 App Image Layer",text:"Uygulamaya özgü dosyalar: kaynak kod, config, uygulama bağımlılıkları. Docker build sırasında COPY/ADD komutlarıyla oluşur. <strong>Read-only</strong>, tüm container replikalarında paylaşılır."},runtime:{title:"🟡 Runtime Layer",text:"Python, Node.js, Java JRE gibi çalışma ortamı. Birden fazla image bu katmanı paylaşabilir. <strong>Read-only</strong>, katman caching sayesinde çok verimlidir."},base:{title:"🟣 Base OS Layer (lowerdir)",text:"Ubuntu, Alpine, Debian gibi temel işletim sistemi imajı. Yüzlerce container bu katmanı paylaşabilir. <strong>Read-only</strong>. En alttaki kök katman."},merged:{title:"🟠 Merged View",text:"Container'ın gördüğü birleşik dosya sistemi. OverlayFS, tüm lowerdir katmanlarını ve upperdir'i birleştirerek tek bir virtual filesystem sunar. Üst katmanlar alttakileri <strong>gölgeler (shadows)</strong>."}};e.querySelectorAll(".overlay-layer").forEach(s=>{s.addEventListener("click",()=>{e.querySelectorAll(".overlay-layer").forEach(d=>d.classList.remove("selected")),s.classList.add("selected");const c=t[s.dataset.ol];c&&(e.querySelector("#ol-detail").innerHTML=`<strong style="color:var(--text-bright)">${c.title}</strong><br><br>${c.text}`)})});let r=!1;const p=e.querySelector("#cow-log"),a=e.querySelector("#cow-upper-area");e.querySelector("#btn-cow-write").addEventListener("click",()=>{if(r)return;r=!0;const s=e.querySelector("#cow-base-config"),c=(i,m)=>{p.innerHTML+=`<span style="color:${m||"var(--text-dim)"}">${i}</span>
`};c('$ echo "debug: true" >> config.json',"var(--blue-light)");const d=setTimeout(()=>{c("→ Kernel: config.json lowerdir'de bulundu, upperdir'de yok","var(--text-dim)"),s.style.boxShadow="0 0 12px var(--yellow-light)",s.style.borderColor="var(--yellow-light)"},400),l=setTimeout(()=>{c("→ Copy-on-Write: dosya upperdir'e kopyalanıyor...","var(--yellow-light)")},900),o=setTimeout(()=>{a.innerHTML="";const i=document.createElement("div");i.className="cow-file",i.style.cssText="background:var(--blue-b);color:var(--blue-light);",i.innerHTML="📝 config.json (kopya + değişiklik)",a.appendChild(i),c("→ Kopyalama tamamlandı, değişiklik upperdir'e yazıldı","var(--green-light)"),c("→ Merged view: upperdir'deki config.json artık görünür","var(--green-light)"),s.style.opacity="0.5",s.style.textDecoration="line-through"},1500);this._timers.push(d,l,o)}),e.querySelector("#btn-cow-reset").addEventListener("click",()=>{r=!1,p.innerHTML="",a.innerHTML='<div style="font-size:.78rem;color:var(--text-dim);font-style:italic;padding:8px;">boş — henüz değişiklik yok</div>';const s=e.querySelector("#cow-base-config");s.style.boxShadow="",s.style.borderColor="",s.style.opacity="",s.style.textDecoration=""})},_initDma(e){const t=e.querySelector("#btn-mode-polling"),r=e.querySelector("#btn-mode-dma"),p=e.querySelector("#btn-dma-start"),a=e.querySelector("#btn-dma-reset");t.addEventListener("click",()=>{this._dmaMode="polling",t.classList.add("active"),r.classList.remove("active"),this._resetDma(e)}),r.addEventListener("click",()=>{this._dmaMode="dma",r.classList.add("active"),t.classList.remove("active"),this._resetDma(e)}),p.addEventListener("click",()=>{this._dmaRunning||this._runDma(e)}),a.addEventListener("click",()=>this._resetDma(e))},_resetDma(e){this._dmaRunning=!1;const t=e.querySelector("#dma-log");t.innerHTML="",["dma-cpu","dma-ram","dma-disk"].forEach(p=>{e.querySelector("#"+p).classList.remove("active","cpu-active","done")}),["arr-cpu-ram","arr-ram-disk"].forEach(p=>{e.querySelector("#"+p)?.classList.remove("active","cpu-active")}),["dma-cpu-bar","dma-ram-bar","dma-disk-bar"].forEach(p=>{const a=e.querySelector("#"+p);a&&(a.style.width="0%")}),e.querySelector("#dma-cpu-label").textContent="Hazır",e.querySelector("#dma-ram-label").textContent="Boş",e.querySelector("#dma-disk-label").textContent="Hazır"},_runDma(e){this._dmaRunning=!0;const t=e.querySelector("#dma-log"),r=(d,l)=>{t.innerHTML+=`<div style="color:${l||"var(--text-dim)"}">${d}</div>`,t.scrollTop=t.scrollHeight},p=(d,l)=>{e.querySelector("#"+d).style.width=l+"%"},a=(d,l)=>{e.querySelector("#"+d).textContent=l},s=(d,l)=>{e.querySelector("#"+d).classList.add(l)},c=(d,l)=>{e.querySelector("#"+d).classList.remove(l)};if(this._dmaMode==="polling"){r("⚙️ CPU Polling modu başlatıldı","var(--red-light)"),s("dma-cpu","cpu-active"),a("dma-cpu-label","I/O isteği gönderdi");let d=setTimeout(()=>{r("→ CPU disk'e read komutu gönderdi","var(--text-dim)"),s("arr-cpu-ram","cpu-active"),s("dma-disk","active"),a("dma-disk-label","Okuyor..."),p("dma-disk-bar",30)},400),l=setTimeout(()=>{r("→ CPU polling: disk hazır mı? Hayır... (1)","var(--red-light)"),a("dma-cpu-label","Polling (bekliyor)"),p("dma-cpu-bar",20),p("dma-disk-bar",60)},1e3),o=setTimeout(()=>{r("→ CPU polling: disk hazır mı? Hayır... (2)","var(--red-light)"),p("dma-cpu-bar",40),p("dma-disk-bar",80)},1700),i=setTimeout(()=>{r("→ CPU polling: disk hazır mı? Hayır... (3)","var(--red-light)"),p("dma-cpu-bar",60),p("dma-disk-bar",95)},2400),m=setTimeout(()=>{r("→ Disk hazır! Veri RAM'e kopyalanıyor...","var(--yellow-light)"),c("dma-disk","active"),e.querySelector("#dma-disk").classList.add("done"),a("dma-disk-label","Tamam"),p("dma-disk-bar",100),s("dma-ram","active"),a("dma-ram-label","Alıyor..."),p("dma-ram-bar",50)},3100),S=setTimeout(()=>{p("dma-ram-bar",100),e.querySelector("#dma-ram").classList.add("done"),a("dma-ram-label","Tamam"),p("dma-cpu-bar",100),a("dma-cpu-label","Tamamlandı"),c("dma-cpu","cpu-active"),e.querySelector("#dma-cpu").classList.add("done"),r("✅ Transfer tamamlandı. CPU transfer süresince bloklandı!","var(--orange-light)"),r("⚠️ CPU başka iş yapamadı — bu süre tamamen israf!","var(--red-light)"),this._dmaRunning=!1},3900);this._timers.push(d,l,o,i,m,S)}else{r("⚡ DMA modu başlatıldı","var(--blue-light)"),s("dma-cpu","active"),a("dma-cpu-label","DMA programladı");let d=setTimeout(()=>{r("→ CPU, DMA Controller'a transfer isteği verdi","var(--text-dim)"),p("dma-disk-bar",20),s("dma-disk","active"),a("dma-disk-label","DMA okuyor...")},400),l=setTimeout(()=>{r("→ DMA transferi devam ediyor. CPU SERBEST — başka iş yapabilir!","var(--blue-light)"),c("dma-cpu","active"),p("dma-cpu-bar",80),a("dma-cpu-label","Başka iş yapıyor"),p("dma-disk-bar",60)},900),o=setTimeout(()=>{p("dma-disk-bar",100),e.querySelector("#dma-disk").classList.add("done"),a("dma-disk-label","Tamam"),s("arr-cpu-ram","active"),s("dma-ram","active"),a("dma-ram-label","DMA yazıyor..."),p("dma-ram-bar",60),r("→ Disk okuma bitti. DMA, veriyi doğrudan RAM'e yazıyor...","var(--yellow-light)")},1600),i=setTimeout(()=>{p("dma-ram-bar",100),e.querySelector("#dma-ram").classList.add("done"),a("dma-ram-label","Tamam"),r(`→ DMA → CPU'ya interrupt gönderdi: "transfer bitti!"`,"var(--purple-light)")},2200),m=setTimeout(()=>{e.querySelector("#dma-cpu").classList.add("done"),p("dma-cpu-bar",100),a("dma-cpu-label","Interrupt aldı"),r("✅ CPU interrupt işledi. Veri RAM'de hazır.","var(--green-light)"),r("⚡ CPU transfer süresince 1.8 saniye başka iş yaptı!","var(--blue-light)"),this._dmaRunning=!1},2800);this._timers.push(d,l,o,i,m)}},_initCompare(e){const t=e.querySelector("#btn-io-anim"),r=e.querySelector("#btn-io-reset"),p=e.querySelectorAll(".io-step"),a=()=>p.forEach(s=>s.classList.remove("visible"));t.addEventListener("click",()=>{a();const s=e.querySelectorAll('[data-iostep="vm"]'),c=e.querySelectorAll('[data-iostep="docker"]');s.forEach((l,o)=>{const i=setTimeout(()=>l.classList.add("visible"),o*250);this._timers.push(i)});const d=setTimeout(()=>{c.forEach((l,o)=>{const i=setTimeout(()=>l.classList.add("visible"),o*300);this._timers.push(i)})},s.length*250+300);this._timers.push(d)}),r.addEventListener("click",a)},destroy(){this._timers.forEach(e=>clearTimeout(e)),this._timers=[],this._dmaRunning=!1}},_={"docker-vm":D,paging:H,"context-switch":N,"cpu-ring":O,"disk-io":I},$=[{id:"home",icon:"🏠",label:"Ana Sayfa"},{id:"docker-vm",icon:"🐳",label:"Docker vs VM"},{id:"paging",icon:"📄",label:"Paging"},{id:"context-switch",icon:"🔄",label:"Context Switch"},{id:"cpu-ring",icon:"🛡️",label:"CPU Ring"},{id:"disk-io",icon:"💾",label:"Disk I/O"}];let B=null;function P(e){if(B?.destroy&&B.destroy(),B=null,U(e),e==="home"){j();return}const t=_[e];if(!t)return;const r=document.getElementById("app");r.innerHTML=t.template(),B=t,t.init&&t.init(r)}function U(e){document.querySelectorAll(".nav-tab").forEach(t=>{t.classList.toggle("active",t.dataset.page===e)})}function j(){const e=document.getElementById("app"),t=[{id:"docker-vm",icon:"🐳",color:"blue",title:"Docker vs Sanal Makine",desc:"Donanım katmanı mimarisi, boot süreci karşılaştırması, RAM kaynak kullanımı ve Kernel Namespace izolasyonu.",tags:[{bg:"var(--blue-b)",color:"var(--blue-light)",text:"Katman Diyagramı"},{bg:"var(--green-b)",color:"var(--green-light)",text:"Boot Simülasyonu"},{bg:"var(--purple-b)",color:"var(--purple-light)",text:"Namespace"}]},{id:"paging",icon:"📄",color:"green",title:"Sayfalama (Paging)",desc:"Sanal adresten fiziksel adrese çeviri, sayfa tablosu bit simülasyonu, TLB hit/miss ve fiziksel bellek çerçeveleri.",tags:[{bg:"var(--green-b)",color:"var(--green-light)",text:"Adres Çevirisi"},{bg:"var(--blue-b)",color:"var(--blue-light)",text:"TLB Simülasyonu"},{bg:"var(--yellow-b)",color:"var(--yellow-light)",text:"Bellek Haritası"}]},{id:"context-switch",icon:"🔄",color:"yellow",title:"Context Switch",desc:"CPU register kaydetme/yükleme, PCB, VM'de vs Container'da geçiş maliyeti karşılaştırması ve Round Robin Scheduler.",tags:[{bg:"var(--red-b)",color:"var(--red-light)",text:"Adım Adım"},{bg:"var(--purple-b)",color:"var(--purple-light)",text:"VM vs Docker"},{bg:"var(--blue-b)",color:"var(--blue-light)",text:"Round Robin"}]},{id:"cpu-ring",icon:"🛡️",color:"purple",title:"CPU Ring 0 / Ring 3",desc:"Kernel mode vs User mode, syscall akışı simülasyonu (read, write, fork...), VM'de VMEXIT maliyeti ve mini quiz.",tags:[{bg:"var(--purple-b)",color:"var(--purple-light)",text:"Ring Diyagramı"},{bg:"var(--green-b)",color:"var(--green-light)",text:"Syscall Sim."},{bg:"var(--yellow-b)",color:"var(--yellow-light)",text:"Quiz ✓"}]},{id:"disk-io",icon:"💾",color:"orange",title:"Disk I/O & DMA",desc:"I/O katman yolculuğu, OverlayFS ve Copy-on-Write simülasyonu, DMA transferi (CPU polling vs DMA) ve VM vs Container I/O karşılaştırması.",tags:[{bg:"var(--blue-b)",color:"var(--blue-light)",text:"OverlayFS"},{bg:"var(--green-b)",color:"var(--green-light)",text:"DMA Animasyon"},{bg:"var(--yellow-b)",color:"var(--yellow-light)",text:"CoW"}]}];e.innerHTML=`
    <div class="home-page fade-in">
      <div class="home-hero">
        <div class="hero-badge">Bilgisayar Organizasyonu Dersi</div>
        <h1>🖥️ Donanım Simülasyonları</h1>
        <p>Donanım düzeyinde interaktif simülasyonlarla işletim sistemi ve sistem yazılımı kavramlarını keşfet.</p>
        <div class="home-stats">
          <div class="stat-pill"><strong>5</strong> Modül</div>
          <div class="stat-pill"><strong>20+</strong> İnteraktif Simülasyon</div>
          <div class="stat-pill"><strong>5</strong> Quiz Sorusu</div>
          <div class="stat-pill">🇹🇷 Türkçe</div>
        </div>
      </div>

      <div class="home-grid">
        ${t.map((r,p)=>`
          <button class="module-card card-${r.color}" data-nav="${r.id}">
            <div class="card-num">Modül ${p+1}</div>
            <div class="card-icon">${r.icon}</div>
            <div class="card-title">${r.title}</div>
            <div class="card-desc">${r.desc}</div>
            <div class="card-tags">
              ${r.tags.map(a=>`<span class="card-tag" style="background:${a.bg};color:${a.color}">${a.text}</span>`).join("")}
            </div>
            <div class="card-cta">▶ Simülasyonu Aç →</div>
          </button>
        `).join("")}
      </div>
    </div>
  `,e.querySelectorAll("[data-nav]").forEach(r=>{r.addEventListener("click",()=>P(r.dataset.nav))})}window.showTab=function(e,t){const r=t||document.getElementById("app");r.querySelectorAll(".tab-panel").forEach(s=>s.classList.remove("active")),r.querySelectorAll(".tab-btn").forEach(s=>s.classList.remove("active"));const p=r.querySelector("#"+e),a=r.querySelector(`[data-tab="${e}"]`);p&&p.classList.add("active"),a&&a.classList.add("active")};function V(){const e=document.getElementById("top-nav");e.innerHTML=`
    <div class="nav-brand" id="nav-brand">
      <span class="brand-icon">🖥️</span>
      <span class="brand-text">Bilgisayar Org.</span>
    </div>
    <div class="nav-tabs">
      ${$.map(t=>`
        <button class="nav-tab" data-page="${t.id}">
          <span class="tab-icon">${t.icon}</span>
          ${t.label}
        </button>
      `).join("")}
    </div>
  `,e.querySelectorAll(".nav-tab").forEach(t=>{t.addEventListener("click",()=>P(t.dataset.page))}),e.querySelector("#nav-brand").addEventListener("click",()=>P("home"))}V();P("home");
