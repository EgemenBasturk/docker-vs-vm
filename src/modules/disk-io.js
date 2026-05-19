export const diskIo = {
  _timers: [],

  template() {
    return `
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
    <div id="dio-realdata" data-realdata="dio"></div>
  </div>
</div>
`
  },

  init(root) {
    this._timers = []
    this._root = root
    this._dmaMode = 'polling'
    this._dmaRunning = false

    // Tabs
    root.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => window.showTab(btn.dataset.tab, root))
    })

    this._initKatman(root)
    this._initOverlay(root)
    this._initDma(root)
    this._initCompare(root)

    // Gerçek veri paneli
    const renderDioReal = () => window.renderRealDataPanel?.('dio-realdata', m => [
      { value: m.disk.reads_per_sec,    label: `Okuma/s (${m.disk.device})` },
      { value: m.disk.writes_per_sec,   label: 'Yazma/s' },
      { value: m.disk.read_kb_per_sec + ' KB', label: 'Okuma bant genişliği' },
      { value: m.disk.write_kb_per_sec + ' KB', label: 'Yazma bant genişliği' },
    ])
    window['_rdFn_dio'] = renderDioReal
    renderDioReal()
  },

  _initKatman(root) {
    const startBtn = root.querySelector('#btn-start-journey')
    const resetBtn = root.querySelector('#btn-reset-journey')
    const steps = root.querySelectorAll('.journey-step')

    const reset = () => steps.forEach(s => s.classList.remove('visible'))

    const start = () => {
      reset()
      const vmSteps = root.querySelectorAll('[data-journey="vm"]')
      const dockerSteps = root.querySelectorAll('[data-journey="docker"]')

      vmSteps.forEach((s, i) => {
        const t = setTimeout(() => s.classList.add('visible'), i * 300)
        this._timers.push(t)
      })

      const t = setTimeout(() => {
        dockerSteps.forEach((s, i) => {
          const t2 = setTimeout(() => s.classList.add('visible'), i * 350)
          this._timers.push(t2)
        })
      }, vmSteps.length * 300 + 200)
      this._timers.push(t)
    }

    startBtn.addEventListener('click', start)
    resetBtn.addEventListener('click', reset)
  },

  _initOverlay(root) {
    const details = {
      container: {
        title: '🔵 Container Layer (upperdir)',
        text: 'Yazılabilir katman. Container içinde yapılan tüm değişiklikler (yeni dosya, silme, düzenleme) bu katmana yazılır. Container silinince bu katman da silinir. <strong>Geçicidir.</strong>'
      },
      app: {
        title: '🟢 App Image Layer',
        text: 'Uygulamaya özgü dosyalar: kaynak kod, config, uygulama bağımlılıkları. Docker build sırasında COPY/ADD komutlarıyla oluşur. <strong>Read-only</strong>, tüm container replikalarında paylaşılır.'
      },
      runtime: {
        title: '🟡 Runtime Layer',
        text: 'Python, Node.js, Java JRE gibi çalışma ortamı. Birden fazla image bu katmanı paylaşabilir. <strong>Read-only</strong>, katman caching sayesinde çok verimlidir.'
      },
      base: {
        title: '🟣 Base OS Layer (lowerdir)',
        text: 'Ubuntu, Alpine, Debian gibi temel işletim sistemi imajı. Yüzlerce container bu katmanı paylaşabilir. <strong>Read-only</strong>. En alttaki kök katman.'
      },
      merged: {
        title: '🟠 Merged View',
        text: 'Container\'ın gördüğü birleşik dosya sistemi. OverlayFS, tüm lowerdir katmanlarını ve upperdir\'i birleştirerek tek bir virtual filesystem sunar. Üst katmanlar alttakileri <strong>gölgeler (shadows)</strong>.'
      },
    }

    root.querySelectorAll('.overlay-layer').forEach(layer => {
      layer.addEventListener('click', () => {
        root.querySelectorAll('.overlay-layer').forEach(l => l.classList.remove('selected'))
        layer.classList.add('selected')
        const d = details[layer.dataset.ol]
        if (d) {
          root.querySelector('#ol-detail').innerHTML = `<strong style="color:var(--text-bright)">${d.title}</strong><br><br>${d.text}`
        }
      })
    })

    // CoW simulation
    let cowDone = false
    const cowLog = root.querySelector('#cow-log')
    const upper = root.querySelector('#cow-upper-area')

    root.querySelector('#btn-cow-write').addEventListener('click', () => {
      if (cowDone) return
      cowDone = true

      const baseFile = root.querySelector('#cow-base-config')
      const log = (msg, color) => {
        cowLog.innerHTML += `<span style="color:${color || 'var(--text-dim)'}">${msg}</span>\n`
      }

      log('$ echo "debug: true" >> config.json', 'var(--blue-light)')

      const t1 = setTimeout(() => {
        log('→ Kernel: config.json lowerdir\'de bulundu, upperdir\'de yok', 'var(--text-dim)')
        baseFile.style.boxShadow = '0 0 12px var(--yellow-light)'
        baseFile.style.borderColor = 'var(--yellow-light)'
      }, 400)

      const t2 = setTimeout(() => {
        log('→ Copy-on-Write: dosya upperdir\'e kopyalanıyor...', 'var(--yellow-light)')
      }, 900)

      const t3 = setTimeout(() => {
        upper.innerHTML = ''
        const el = document.createElement('div')
        el.className = 'cow-file'
        el.style.cssText = 'background:var(--blue-b);color:var(--blue-light);'
        el.innerHTML = '📝 config.json (kopya + değişiklik)'
        upper.appendChild(el)
        log('→ Kopyalama tamamlandı, değişiklik upperdir\'e yazıldı', 'var(--green-light)')
        log('→ Merged view: upperdir\'deki config.json artık görünür', 'var(--green-light)')
        baseFile.style.opacity = '0.5'
        baseFile.style.textDecoration = 'line-through'
      }, 1500)

      this._timers.push(t1, t2, t3)
    })

    root.querySelector('#btn-cow-reset').addEventListener('click', () => {
      cowDone = false
      cowLog.innerHTML = ''
      upper.innerHTML = '<div style="font-size:.78rem;color:var(--text-dim);font-style:italic;padding:8px;">boş — henüz değişiklik yok</div>'
      const baseFile = root.querySelector('#cow-base-config')
      baseFile.style.boxShadow = ''
      baseFile.style.borderColor = ''
      baseFile.style.opacity = ''
      baseFile.style.textDecoration = ''
    })
  },

  _initDma(root) {
    const pollingBtn = root.querySelector('#btn-mode-polling')
    const dmaBtn = root.querySelector('#btn-mode-dma')
    const startBtn = root.querySelector('#btn-dma-start')
    const resetBtn = root.querySelector('#btn-dma-reset')

    pollingBtn.addEventListener('click', () => {
      this._dmaMode = 'polling'
      pollingBtn.classList.add('active')
      dmaBtn.classList.remove('active')
      this._resetDma(root)
    })

    dmaBtn.addEventListener('click', () => {
      this._dmaMode = 'dma'
      dmaBtn.classList.add('active')
      pollingBtn.classList.remove('active')
      this._resetDma(root)
    })

    startBtn.addEventListener('click', () => {
      if (this._dmaRunning) return
      this._runDma(root)
    })

    resetBtn.addEventListener('click', () => this._resetDma(root))
  },

  _resetDma(root) {
    this._dmaRunning = false
    const log = root.querySelector('#dma-log')
    log.innerHTML = ''

    const ids = ['dma-cpu', 'dma-ram', 'dma-disk']
    ids.forEach(id => {
      const el = root.querySelector('#' + id)
      el.classList.remove('active', 'cpu-active', 'done')
    })
    ;['arr-cpu-ram', 'arr-ram-disk'].forEach(id => {
      root.querySelector('#' + id)?.classList.remove('active', 'cpu-active')
    })
    ;['dma-cpu-bar', 'dma-ram-bar', 'dma-disk-bar'].forEach(id => {
      const el = root.querySelector('#' + id)
      if (el) el.style.width = '0%'
    })

    root.querySelector('#dma-cpu-label').textContent = 'Hazır'
    root.querySelector('#dma-ram-label').textContent = 'Boş'
    root.querySelector('#dma-disk-label').textContent = 'Hazır'
  },

  _runDma(root) {
    this._dmaRunning = true
    const log = root.querySelector('#dma-log')
    const addLog = (msg, color) => {
      log.innerHTML += `<div style="color:${color || 'var(--text-dim)'}">${msg}</div>`
      log.scrollTop = log.scrollHeight
    }
    const setBar = (id, pct) => { root.querySelector('#' + id).style.width = pct + '%' }
    const setLabel = (id, text) => { root.querySelector('#' + id).textContent = text }
    const active = (id, cls) => { root.querySelector('#' + id).classList.add(cls) }
    const deactive = (id, cls) => { root.querySelector('#' + id).classList.remove(cls) }

    if (this._dmaMode === 'polling') {
      addLog('⚙️ CPU Polling modu başlatıldı', 'var(--red-light)')
      active('dma-cpu', 'cpu-active')
      setLabel('dma-cpu-label', 'I/O isteği gönderdi')

      let t1 = setTimeout(() => {
        addLog('→ CPU disk\'e read komutu gönderdi', 'var(--text-dim)')
        active('arr-cpu-ram', 'cpu-active')
        active('dma-disk', 'active')
        setLabel('dma-disk-label', 'Okuyor...')
        setBar('dma-disk-bar', 30)
      }, 400)

      let t2 = setTimeout(() => {
        addLog('→ CPU polling: disk hazır mı? Hayır... (1)', 'var(--red-light)')
        setLabel('dma-cpu-label', 'Polling (bekliyor)')
        setBar('dma-cpu-bar', 20)
        setBar('dma-disk-bar', 60)
      }, 1000)

      let t3 = setTimeout(() => {
        addLog('→ CPU polling: disk hazır mı? Hayır... (2)', 'var(--red-light)')
        setBar('dma-cpu-bar', 40)
        setBar('dma-disk-bar', 80)
      }, 1700)

      let t4 = setTimeout(() => {
        addLog('→ CPU polling: disk hazır mı? Hayır... (3)', 'var(--red-light)')
        setBar('dma-cpu-bar', 60)
        setBar('dma-disk-bar', 95)
      }, 2400)

      let t5 = setTimeout(() => {
        addLog('→ Disk hazır! Veri RAM\'e kopyalanıyor...', 'var(--yellow-light)')
        deactive('dma-disk', 'active')
        root.querySelector('#dma-disk').classList.add('done')
        setLabel('dma-disk-label', 'Tamam')
        setBar('dma-disk-bar', 100)
        active('dma-ram', 'active')
        setLabel('dma-ram-label', 'Alıyor...')
        setBar('dma-ram-bar', 50)
      }, 3100)

      let t6 = setTimeout(() => {
        setBar('dma-ram-bar', 100)
        root.querySelector('#dma-ram').classList.add('done')
        setLabel('dma-ram-label', 'Tamam')
        setBar('dma-cpu-bar', 100)
        setLabel('dma-cpu-label', 'Tamamlandı')
        deactive('dma-cpu', 'cpu-active')
        root.querySelector('#dma-cpu').classList.add('done')
        addLog('✅ Transfer tamamlandı. CPU transfer süresince bloklandı!', 'var(--orange-light)')
        addLog('⚠️ CPU başka iş yapamadı — bu süre tamamen israf!', 'var(--red-light)')
        this._dmaRunning = false
      }, 3900)

      this._timers.push(t1, t2, t3, t4, t5, t6)
    } else {
      addLog('⚡ DMA modu başlatıldı', 'var(--blue-light)')
      active('dma-cpu', 'active')
      setLabel('dma-cpu-label', 'DMA programladı')

      let t1 = setTimeout(() => {
        addLog('→ CPU, DMA Controller\'a transfer isteği verdi', 'var(--text-dim)')
        setBar('dma-disk-bar', 20)
        active('dma-disk', 'active')
        setLabel('dma-disk-label', 'DMA okuyor...')
      }, 400)

      let t2 = setTimeout(() => {
        addLog('→ DMA transferi devam ediyor. CPU SERBEST — başka iş yapabilir!', 'var(--blue-light)')
        deactive('dma-cpu', 'active')
        setBar('dma-cpu-bar', 80)
        setLabel('dma-cpu-label', 'Başka iş yapıyor')
        setBar('dma-disk-bar', 60)
      }, 900)

      let t3 = setTimeout(() => {
        setBar('dma-disk-bar', 100)
        root.querySelector('#dma-disk').classList.add('done')
        setLabel('dma-disk-label', 'Tamam')
        active('arr-cpu-ram', 'active')
        active('dma-ram', 'active')
        setLabel('dma-ram-label', 'DMA yazıyor...')
        setBar('dma-ram-bar', 60)
        addLog('→ Disk okuma bitti. DMA, veriyi doğrudan RAM\'e yazıyor...', 'var(--yellow-light)')
      }, 1600)

      let t4 = setTimeout(() => {
        setBar('dma-ram-bar', 100)
        root.querySelector('#dma-ram').classList.add('done')
        setLabel('dma-ram-label', 'Tamam')
        addLog('→ DMA → CPU\'ya interrupt gönderdi: "transfer bitti!"', 'var(--purple-light)')
      }, 2200)

      let t5 = setTimeout(() => {
        root.querySelector('#dma-cpu').classList.add('done')
        setBar('dma-cpu-bar', 100)
        setLabel('dma-cpu-label', 'Interrupt aldı')
        addLog('✅ CPU interrupt işledi. Veri RAM\'de hazır.', 'var(--green-light)')
        addLog('⚡ CPU transfer süresince 1.8 saniye başka iş yaptı!', 'var(--blue-light)')
        this._dmaRunning = false
      }, 2800)

      this._timers.push(t1, t2, t3, t4, t5)
    }
  },

  _initCompare(root) {
    const startBtn = root.querySelector('#btn-io-anim')
    const resetBtn = root.querySelector('#btn-io-reset')
    const steps = root.querySelectorAll('.io-step')

    const reset = () => steps.forEach(s => s.classList.remove('visible'))

    startBtn.addEventListener('click', () => {
      reset()
      const vmSteps = root.querySelectorAll('[data-iostep="vm"]')
      const dockerSteps = root.querySelectorAll('[data-iostep="docker"]')

      vmSteps.forEach((s, i) => {
        const t = setTimeout(() => s.classList.add('visible'), i * 250)
        this._timers.push(t)
      })

      const t = setTimeout(() => {
        dockerSteps.forEach((s, i) => {
          const t2 = setTimeout(() => s.classList.add('visible'), i * 300)
          this._timers.push(t2)
        })
      }, vmSteps.length * 250 + 300)
      this._timers.push(t)
    })

    resetBtn.addEventListener('click', reset)
  },

  destroy() {
    this._timers.forEach(t => clearTimeout(t))
    this._timers = []
    this._dmaRunning = false
  },
}
