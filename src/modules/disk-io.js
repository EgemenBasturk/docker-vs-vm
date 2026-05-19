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

  .overlay-stack { display:flex; flex-direction:column; gap:6px; }
  .overlay-layer { padding:14px 18px; border-radius:10px; cursor:pointer; border:2px solid transparent; transition:all .2s; font-size:.85rem; font-weight:600; }
  .overlay-layer:hover { transform:translateX(4px); }
  .overlay-layer.selected { border-color: currentColor; transform:translateX(6px); }
  .overlay-layer-detail { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:18px; margin-top:12px; font-size:.85rem; line-height:1.7; }

  .cow-scene { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:12px 0; }
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

  .insight-box { display:flex; align-items:flex-start; gap:12px; background:var(--blue-b); border:1px solid var(--blue); border-radius:12px; padding:14px 18px; margin-bottom:20px; font-size:.85rem; line-height:1.65; color:var(--text); }
  .insight-box .insight-icon { font-size:1.4rem; flex-shrink:0; margin-top:1px; }
  .insight-box strong { color:var(--blue-light); }

  .section-divider { border:none; border-top:1px solid var(--border); margin:28px 0 20px; }
  .section-label { font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--text-muted); margin-bottom:12px; }

  .concept-grid-2x2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .concept-grid-2x2 .concept-title { font-weight:800 !important; }

  .bench-chart { display:flex; flex-direction:column; gap:18px; }
  .bench-row { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:16px 18px; }
  .bench-label { font-size:.8rem; font-weight:700; color:var(--text); margin-bottom:10px; }
  .bench-bars { display:flex; flex-direction:column; gap:7px; }
  .bench-bar-row { display:flex; align-items:center; gap:10px; }
  .bench-tag { font-size:.72rem; font-weight:700; width:56px; flex-shrink:0; text-align:right; }
  .bench-track { flex:1; height:22px; background:var(--bg-root); border-radius:6px; overflow:hidden; }
  .bench-fill { height:100%; border-radius:6px; display:flex; align-items:center; padding-left:8px; font-size:.72rem; font-weight:700; color:#000; transition:width .8s ease; white-space:nowrap; }
  .bench-val { font-size:.75rem; font-weight:700; width:72px; flex-shrink:0; }
</style>

<div class="module-page">
  <div class="module-header">
    <div class="module-badge">Modül 5</div>
    <h2>💾 Disk I/O & DMA</h2>
    <p>Disk okuma/yazma nasıl çalışır? Docker neden VM'den daha hızlıdır?</p>
  </div>

  <div class="module-tabs">
    <button class="tab-btn active" data-tab="tab-nedir">① Temel Kavramlar</button>
    <button class="tab-btn" data-tab="tab-compare">② VM vs Docker I/O</button>
    <button class="tab-btn" data-tab="tab-overlay">③ Docker Katmanları</button>
    <button class="tab-btn" data-tab="tab-dma">④ DMA Transferi</button>
  </div>

  <!-- ① Temel Kavramlar -->
  <div class="tab-panel active" id="tab-nedir">
    <div class="insight-box">
      <div class="insight-icon">💡</div>
      <div><strong>Ana Fikir:</strong> Disk, RAM'den çok daha yavaştır. İşletim sistemi bu yavaşlığı gizlemek için önbellek ve akıllı zamanlama kullanır. Her dosya erişimi birden fazla yazılım katmanından geçer.</div>
    </div>

    <div class="concept-grid-2x2">
      <div class="concept-card border-blue">
        <div class="concept-icon">💾</div>
        <div class="concept-title">Disk I/O Nedir?</div>
        <div class="concept-body">Uygulamanın diskten veri okuma veya diske yazma işlemidir. RAM'e erişmekten <strong>1.000–100.000 kat yavaştır</strong> — bu yüzden kernel işlemleri önbelleğe alır.</div>
      </div>
      <div class="concept-card border-green">
        <div class="concept-icon">📚</div>
        <div class="concept-title">Buffer Cache (Önbellek)</div>
        <div class="concept-body">Kernel, sık kullanılan dosyaları RAM'de saklar. Aynı dosyaya ikinci kez erişince diske gitmez — RAM'den verir. Bu yüzden bilgisayar ısındıkça hızlanır.</div>
      </div>
      <div class="concept-card border-purple">
        <div class="concept-icon">🗂️</div>
        <div class="concept-title">VFS — Sanal Dosya Sistemi</div>
        <div class="concept-body">Uygulamalar <code>read()</code> yazar, diskin ext4 mi, btrfs mi, NFS mi olduğunu bilmez. VFS bu ayrıntıyı gizleyen soyutlama katmanıdır.</div>
      </div>
      <div class="concept-card border-yellow">
        <div class="concept-icon">🚦</div>
        <div class="concept-title">Beklemeli vs Beklememeli I/O</div>
        <div class="concept-body">Normal <code>read()</code> disk yanıtlayana kadar programı <strong>durdurur</strong>. Asenkron I/O (io_uring) ile program disk beklerken başka işler yapabilir.</div>
      </div>
    </div>

    <div class="panel-box" style="margin-top:20px;">
      <h3 style="margin:0 0 14px;font-size:1rem;color:var(--text-bright)">📖 Kütüphane Analojisi</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <div style="background:var(--bg-root);border-radius:10px;padding:14px;font-size:.83rem;line-height:1.9;">
          <div style="color:var(--blue-light);font-weight:700;margin-bottom:8px;">📚 Kütüphane = Bilgisayar</div>
          <div>🗄️ <strong>Kitap rafları</strong> → Disk (kalıcı, yavaş)</div>
          <div>🗃️ <strong>Masa</strong> → RAM (hızlı, geçici)</div>
          <div>📋 <strong>Kütüphaneci</strong> → I/O Scheduler (sırayı düzenler)</div>
          <div>📝 <strong>Ödünç defteri</strong> → File Descriptor (açık dosya kaydı)</div>
          <div>🔖 <strong>Fotokopi</strong> → Copy-on-Write (değişince kopyala)</div>
        </div>
        <div style="background:var(--bg-root);border-radius:10px;padding:14px;font-size:.83rem;line-height:1.9;">
          <div style="color:var(--green-light);font-weight:700;margin-bottom:8px;">⚡ Hız Karşılaştırması</div>
          <div>L1 Önbellek: <strong style="color:var(--green-light)">~1 ns</strong> (ışık hızı)</div>
          <div>RAM: <strong style="color:var(--blue-light)">~100 ns</strong> (100x yavaş)</div>
          <div>SSD: <strong style="color:var(--yellow-light)">~100 µs</strong> (100.000x yavaş)</div>
          <div>HDD: <strong style="color:var(--orange-light)">~10 ms</strong> (10.000.000x yavaş)</div>
          <div>Ağ: <strong style="color:var(--red-light)">~150 ms</strong> (uzak sunucu)</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ② VM vs Docker I/O  (tab-katman içeriği de burada) -->
  <div class="tab-panel" id="tab-compare">
    <div class="insight-box">
      <div class="insight-icon">💡</div>
      <div><strong>Ana Fikir:</strong> VM'de bir dosya okumak <strong>7 yazılım katmanından</strong> geçer çünkü VM'nin kendi işletim sistemi var. Docker ise <strong>5 katman</strong> kullanır — araya giren sanal işletim sistemi yok. Bu fark, disk okumayı 3-4 kat hızlandırır.</div>
    </div>

    <!-- Katman yolculuğu animasyonu -->
    <div class="section-label">Katman Yolculuğu Animasyonu</div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px;">
      <button class="btn btn-blue" id="btn-start-journey">▶ Animasyonu Başlat</button>
      <button class="btn btn-outline" id="btn-reset-journey">↺ Sıfırla</button>
    </div>

    <div class="layer-journey">
      <div class="journey-col">
        <div style="text-align:center;margin-bottom:12px;">
          <span style="font-size:1rem;font-weight:700;color:var(--orange-light)">🖥️ VM — 7 Adım</span>
          <div style="font-size:.75rem;color:var(--text-muted);margin-top:4px;">~150–400 µs gecikme</div>
        </div>
        <div class="journey-step" data-journey="vm" style="border-left-color:var(--purple-light)">
          <div class="journey-dot" style="background:var(--purple-light)"></div>
          <div><strong>Uygulama</strong> — <code>read()</code> çağırır<br><span style="color:var(--text-muted);font-size:.78rem">User Space → Kernel geçişi başlıyor</span></div>
        </div>
        <div class="journey-step" data-journey="vm" style="border-left-color:var(--blue-light)">
          <div class="journey-dot" style="background:var(--blue-light)"></div>
          <div><strong>Sistem Çağrısı (syscall)</strong><br><span style="color:var(--text-muted);font-size:.78rem">VM'nin kendi kernel'ına giriyor</span></div>
        </div>
        <div class="journey-step" data-journey="vm" style="border-left-color:var(--green-light)">
          <div class="journey-dot" style="background:var(--green-light)"></div>
          <div><strong>VM Dosya Sistemi Katmanı</strong><br><span style="color:var(--text-muted);font-size:.78rem">VM içindeki sanal disk sürücüsü</span></div>
        </div>
        <div class="journey-step" data-journey="vm" style="border-left-color:var(--yellow-light)">
          <div class="journey-dot" style="background:var(--yellow-light)"></div>
          <div><strong>VM Disk Sürücüsü</strong><br><span style="color:var(--text-muted);font-size:.78rem">Sanal disk kartına istek gönderir</span></div>
        </div>
        <div class="journey-step" data-journey="vm" style="border-left-color:var(--red-light)">
          <div class="journey-dot" style="background:var(--red-light)"></div>
          <div><strong>⚠️ VMEXIT — Hypervisor Devralır</strong><br><span style="color:var(--red-light);font-size:.78rem">VM durur, yönetici (VMware/KVM) kontrolü alır — en maliyetli adım</span></div>
        </div>
        <div class="journey-step" data-journey="vm" style="border-left-color:var(--orange-light)">
          <div class="journey-dot" style="background:var(--orange-light)"></div>
          <div><strong>Ana Makine Dosya Sistemi</strong><br><span style="color:var(--text-muted);font-size:.78rem">Gerçek işletim sistemine ulaşıldı</span></div>
        </div>
        <div class="journey-step" data-journey="vm" style="border-left-color:var(--purple-light)">
          <div class="journey-dot" style="background:var(--purple-light)"></div>
          <div><strong>Fiziksel Disk</strong><br><span style="color:var(--text-muted);font-size:.78rem">Veri okundu, geri dönüş başlıyor</span></div>
        </div>
      </div>

      <div class="journey-col">
        <div style="text-align:center;margin-bottom:12px;">
          <span style="font-size:1rem;font-weight:700;color:var(--green-light)">🐳 Docker — 5 Adım</span>
          <div style="font-size:.75rem;color:var(--text-muted);margin-top:4px;">~50–100 µs gecikme</div>
        </div>
        <div class="journey-step" data-journey="docker" style="border-left-color:var(--purple-light)">
          <div class="journey-dot" style="background:var(--purple-light)"></div>
          <div><strong>Uygulama</strong> — <code>read()</code> çağırır<br><span style="color:var(--text-muted);font-size:.78rem">Aynı sistem çağrısı</span></div>
        </div>
        <div class="journey-step" data-journey="docker" style="border-left-color:var(--blue-light)">
          <div class="journey-dot" style="background:var(--blue-light)"></div>
          <div><strong>Sistem Çağrısı (syscall)</strong><br><span style="color:var(--text-muted);font-size:.78rem">Doğrudan ana makinenin kernel'ı</span></div>
        </div>
        <div class="journey-step" data-journey="docker" style="border-left-color:var(--green-light)">
          <div class="journey-dot" style="background:var(--green-light)"></div>
          <div><strong>OverlayFS Dosya Sistemi</strong><br><span style="color:var(--text-muted);font-size:.78rem">Docker'ın katmanlı dosya sistemi</span></div>
        </div>
        <div class="journey-step" data-journey="docker" style="border-left-color:var(--yellow-light)">
          <div class="journey-dot" style="background:var(--yellow-light)"></div>
          <div><strong>Disk Sürücüsü</strong><br><span style="color:var(--text-muted);font-size:.78rem">NVMe / SSD sürücüsü</span></div>
        </div>
        <div class="journey-step" data-journey="docker" style="border-left-color:var(--orange-light)">
          <div class="journey-dot" style="background:var(--orange-light)"></div>
          <div><strong>Fiziksel Disk</strong><br><span style="color:var(--text-muted);font-size:.78rem">Veri okundu</span></div>
        </div>
        <div style="margin-top:16px;padding:14px;background:var(--green-b);border-radius:10px;font-size:.82rem;color:var(--green-light);line-height:1.7;">
          ✅ <strong>VMEXIT yok</strong> — VM gibi durup beklemek zorunda değil<br>
          ✅ <strong>VM kernel'ı yok</strong> — doğrudan ana makine kernel'ına gider<br>
          ✅ Sonuç: <strong>3–4x daha hızlı disk erişimi</strong>
        </div>
      </div>
    </div>

    <hr class="section-divider">

    <!-- Benchmark bar chart -->
    <div class="section-label">📊 Benchmark Karşılaştırması</div>
    <div style="display:flex;gap:16px;font-size:.75rem;margin-bottom:14px;">
      <span style="display:flex;align-items:center;gap:6px;"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:#ed8936;"></span> VM (KVM+QEMU)</span>
      <span style="display:flex;align-items:center;gap:6px;"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:#48bb78;"></span> Docker Container</span>
      <span style="color:var(--text-dim);margin-left:4px;">— çubuk uzunluğu oransal, yüksek = iyi</span>
    </div>

    <div class="bench-chart" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div class="bench-row">
        <div class="bench-label">💿 Sıralı Okuma Hızı</div>
        <div class="bench-bars">
          <div class="bench-bar-row">
            <div class="bench-tag" style="color:#ed8936;">VM</div>
            <div class="bench-track"><div class="bench-fill" style="width:34%;background:#ed8936;">1.2 GB/s</div></div>
            <div class="bench-val" style="color:#ed8936;">1.2 GB/s</div>
          </div>
          <div class="bench-bar-row">
            <div class="bench-tag" style="color:#48bb78;">Docker</div>
            <div class="bench-track"><div class="bench-fill" style="width:100%;background:#48bb78;">3.5 GB/s</div></div>
            <div class="bench-val" style="color:#48bb78;">3.5 GB/s <span style="font-weight:400;opacity:.7;">~3x</span></div>
          </div>
        </div>
      </div>

      <div class="bench-row">
        <div class="bench-label">⚡ Rastgele 4K IOPS (saniyedeki işlem)</div>
        <div class="bench-bars">
          <div class="bench-bar-row">
            <div class="bench-tag" style="color:#ed8936;">VM</div>
            <div class="bench-track"><div class="bench-fill" style="width:37%;background:#ed8936;">45K</div></div>
            <div class="bench-val" style="color:#ed8936;">45.000</div>
          </div>
          <div class="bench-bar-row">
            <div class="bench-tag" style="color:#48bb78;">Docker</div>
            <div class="bench-track"><div class="bench-fill" style="width:100%;background:#48bb78;">120K</div></div>
            <div class="bench-val" style="color:#48bb78;">120.000 <span style="font-weight:400;opacity:.7;">~2.7x</span></div>
          </div>
        </div>
      </div>

      <div class="bench-row">
        <div class="bench-label">⏱️ Disk Yanıt Süresi — düşük olan kazanır</div>
        <div class="bench-bars">
          <div class="bench-bar-row">
            <div class="bench-tag" style="color:#ed8936;">VM</div>
            <div class="bench-track"><div class="bench-fill" style="width:100%;background:#ed8936;">350 µs</div></div>
            <div class="bench-val" style="color:#ed8936;">350 µs ❌</div>
          </div>
          <div class="bench-bar-row">
            <div class="bench-tag" style="color:#48bb78;">Docker</div>
            <div class="bench-track"><div class="bench-fill" style="width:23%;background:#48bb78;">80 µs</div></div>
            <div class="bench-val" style="color:#48bb78;">80 µs <span style="font-weight:400;opacity:.7;">~4.4x</span></div>
          </div>
        </div>
      </div>

      <div class="bench-row">
        <div class="bench-label">🧠 CPU Ek Yükü (VMEXIT'ten kaynaklanan)</div>
        <div class="bench-bars">
          <div class="bench-bar-row">
            <div class="bench-tag" style="color:#ed8936;">VM</div>
            <div class="bench-track"><div class="bench-fill" style="width:85%;background:#ed8936;">Yüksek</div></div>
            <div class="bench-val" style="color:#ed8936;">Yüksek ❌</div>
          </div>
          <div class="bench-bar-row">
            <div class="bench-tag" style="color:#48bb78;">Docker</div>
            <div class="bench-track"><div class="bench-fill" style="width:18%;background:#48bb78;">Düşük</div></div>
            <div class="bench-val" style="color:#48bb78;">Düşük ✅</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gizli placeholder — JS _initCompare null hatasını önler -->
    <div style="display:none;">
      <button id="btn-io-anim"></button>
      <button id="btn-io-reset"></button>
    </div>

    <div id="dio-realdata" data-realdata="dio" style="margin-top:16px;"></div>
  </div>

  <!-- ③ Docker Katmanları -->
  <div class="tab-panel" id="tab-overlay">
    <div class="insight-box">
      <div class="insight-icon">💡</div>
      <div><strong>Ana Fikir:</strong> Docker imajı üst üste binen <strong>katmanlardan</strong> oluşur. Bir dosyayı değiştirdiğinde orijinali bozmaz — sadece değişikliği yeni bir katmana yazar. Buna <strong>Copy-on-Write</strong> (değiştirince kopyala) denir.</div>
    </div>

    <!-- Copy-on-Write simülasyonu önce -->
    <div class="section-label">① Copy-on-Write Simülasyonu — Dene</div>
    <div style="font-size:.83rem;color:var(--text-muted);margin-bottom:12px;">
      "Dosyayı Değiştir" butonuna bas — ne olduğunu adım adım izle:
    </div>
    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
      <button class="btn btn-green" id="btn-cow-write">✏️ config.json Dosyasını Değiştir</button>
      <button class="btn btn-outline" id="btn-cow-reset">↺ Sıfırla</button>
    </div>
    <div class="cow-scene">
      <div class="cow-box">
        <div style="font-size:.78rem;color:var(--text-muted);margin-bottom:8px;font-weight:600;">🔒 BASE LAYER — Salt Okunur (değiştirilemez)</div>
        <div class="cow-file" id="cow-base-config" style="background:var(--green-b);color:var(--green-light);">📄 config.json</div>
        <div class="cow-file" style="background:var(--green-b);color:var(--green-light);">📄 app.py</div>
        <div class="cow-file" style="background:var(--green-b);color:var(--green-light);">📄 requirements.txt</div>
      </div>
      <div class="cow-box">
        <div style="font-size:.78rem;color:var(--text-muted);margin-bottom:8px;font-weight:600;">✏️ CONTAINER LAYER — Yazılabilir (değişiklikler buraya)</div>
        <div id="cow-upper-area" style="min-height:80px;display:flex;flex-direction:column;gap:6px;">
          <div style="font-size:.78rem;color:var(--text-dim);font-style:italic;padding:8px;">boş — henüz değişiklik yapılmadı</div>
        </div>
      </div>
    </div>
    <div id="cow-log" style="background:var(--bg-root);border-radius:8px;padding:12px;font-size:.78rem;font-family:var(--mono);color:var(--text-dim);min-height:60px;line-height:1.7;margin-top:4px;"></div>

    <hr class="section-divider">

    <!-- OverlayFS katmanları sonra -->
    <div class="section-label">② OverlayFS — Katman Yapısı (bir katmana tıkla)</div>
    <div style="font-size:.83rem;color:var(--text-muted);margin-bottom:16px;">
      Docker imajı birden fazla katmandan oluşur. Alttaki katmanlar paylaşılır, en üstteki değiştirilebilir.
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div>
        <div class="overlay-stack">
          <div class="overlay-layer" data-ol="container" style="background:var(--blue-b);color:var(--blue-light);">
            ✏️ Container Katmanı — değişiklikler buraya yazılır
          </div>
          <div style="text-align:center;font-size:.75rem;color:var(--text-dim);padding:2px 0;">↑ yazılabilir · aşağısı salt okunur ↓</div>
          <div class="overlay-layer" data-ol="app" style="background:var(--green-b);color:var(--green-light);">
            📦 Uygulama Katmanı — kaynak kod, config
          </div>
          <div class="overlay-layer" data-ol="runtime" style="background:var(--yellow-b);color:var(--yellow-light);">
            🔧 Runtime Katmanı — Python/Node/Java
          </div>
          <div class="overlay-layer" data-ol="base" style="background:var(--purple-b);color:var(--purple-light);">
            🐧 Temel OS Katmanı — Ubuntu/Alpine
          </div>
          <div class="overlay-layer" data-ol="merged" style="background:var(--orange-b);color:var(--orange-light);">
            👁️ Birleşik Görünüm — container bunu görür
          </div>
        </div>
      </div>
      <div>
        <div class="overlay-layer-detail" id="ol-detail" style="min-height:160px;">
          👆 <span style="color:var(--text-muted)">Soldan bir katmana tıkla — ne işe yaradığını öğren</span>
        </div>
        <div style="margin-top:14px;padding:12px;background:var(--bg-root);border-radius:10px;font-size:.8rem;line-height:1.7;color:var(--text-muted);">
          <strong style="color:var(--text)">💡 Neden katmanlar?</strong><br>
          100 container aynı Ubuntu base katmanını paylaşır — her biri ayrı kopyalamaz. Bu disk alanından 10-50x tasarruf sağlar.
        </div>
      </div>
    </div>
  </div>

  <!-- ④ DMA Transferi -->
  <div class="tab-panel" id="tab-dma">
    <div class="insight-box">
      <div class="insight-icon">💡</div>
      <div><strong>Ana Fikir:</strong> Disk'ten RAM'e veri aktarırken CPU beklemek zorunda mı? <strong>CPU Polling</strong> modunda evet — CPU boşa bekler. <strong>DMA</strong> modunda hayır — özel bir devre (DMA birimi) aktarımı üstlenir, CPU başka işler yapar.</div>
    </div>

    <!-- Mod seçici -->
    <div style="display:flex;gap:0;margin-bottom:24px;border-radius:10px;overflow:hidden;border:1px solid var(--border);max-width:480px;">
      <button class="mode-btn active" id="btn-mode-polling"
        style="flex:1;padding:12px 20px;border-radius:0;border:none;background:var(--red-b);color:var(--red-light);font-size:.85rem;font-weight:700;">
        ⚙️ CPU Polling
      </button>
      <div style="width:1px;background:var(--border);flex-shrink:0;"></div>
      <button class="mode-btn" id="btn-mode-dma"
        style="flex:1;padding:12px 20px;border-radius:0;border:none;background:var(--bg-card);color:var(--text-muted);font-size:.85rem;font-weight:700;">
        ⚡ DMA Modu
      </button>
    </div>

    <!-- CPU Durum Göstergesi -->
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
      <div style="font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);">CPU Durumu</div>
      <div id="dma-cpu-status" style="display:flex;align-items:center;gap:8px;padding:8px 18px;border-radius:20px;background:var(--bg-card);border:2px solid var(--border);transition:all .4s;font-weight:700;font-size:.88rem;">
        <div id="dma-status-dot" style="width:10px;height:10px;border-radius:50%;background:var(--text-dim);transition:all .4s;flex-shrink:0;"></div>
        <span id="dma-status-text">Hazır</span>
      </div>
    </div>

    <!-- Sahne -->
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:24px 20px;margin-bottom:12px;">
      <!-- Veri akış yönü etiketi -->
      <div style="text-align:center;font-size:.72rem;color:var(--text-dim);margin-bottom:16px;letter-spacing:.06em;text-transform:uppercase;">
        ← veri akışı: disk → ram →
      </div>

      <div class="dma-scene" id="dma-scene" style="margin:0;">
        <div class="dma-box" id="dma-cpu" style="flex:1;">
          <div class="dma-icon">🧠</div>
          <div style="font-weight:700;font-size:.9rem;margin-bottom:2px;">CPU</div>
          <div class="dma-label" id="dma-cpu-label">Hazır</div>
          <div class="dma-progress" style="margin-top:10px;"><div class="dma-bar" id="dma-cpu-bar" style="background:var(--red-light)"></div></div>
        </div>

        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
          <div class="dma-arrow" id="arr-cpu-ram" style="font-size:1.8rem;">⇄</div>
          <div id="dma-ctrl-badge" style="font-size:.65rem;font-weight:700;padding:3px 8px;border-radius:8px;background:var(--blue-b);color:var(--blue-light);opacity:0;transition:opacity .4s;white-space:nowrap;">DMA Birimi</div>
        </div>

        <div class="dma-box" id="dma-ram" style="flex:1;">
          <div class="dma-icon">🗄️</div>
          <div style="font-weight:700;font-size:.9rem;margin-bottom:2px;">RAM</div>
          <div class="dma-label" id="dma-ram-label">Boş</div>
          <div class="dma-progress" style="margin-top:10px;"><div class="dma-bar" id="dma-ram-bar" style="background:var(--green-light)"></div></div>
        </div>

        <div class="dma-arrow" id="arr-ram-disk" style="font-size:1.8rem;">⇄</div>

        <div class="dma-box" id="dma-disk" style="flex:1;">
          <div class="dma-icon">💿</div>
          <div style="font-weight:700;font-size:.9rem;margin-bottom:2px;">Disk</div>
          <div class="dma-label" id="dma-disk-label">Hazır</div>
          <div class="dma-progress" style="margin-top:10px;"><div class="dma-bar" id="dma-disk-bar" style="background:var(--blue-light)"></div></div>
        </div>
      </div>
    </div>

    <div style="display:flex;gap:10px;margin-bottom:12px;">
      <button class="btn btn-blue" id="btn-dma-start">▶ Simülasyonu Başlat</button>
      <button class="btn btn-outline" id="btn-dma-reset">↺ Sıfırla</button>
    </div>

    <div id="dma-log" class="sim-log" style="height:150px;margin-bottom:16px;"></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div style="background:var(--red-b);border:1px solid color-mix(in srgb,var(--red-light) 30%,transparent);border-radius:14px;padding:18px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
          <div style="width:10px;height:10px;border-radius:50%;background:var(--red-light);flex-shrink:0;"></div>
          <h4 style="color:var(--red-light);margin:0;font-size:.9rem;">CPU Polling</h4>
        </div>
        <div style="font-size:.82rem;line-height:1.75;color:var(--text-dim);">
          CPU sürekli "disk hazır mı?" diye sorar.<br>
          Transfer bitene kadar <strong style="color:var(--red-light)">başka hiçbir şey yapamaz</strong>.<br><br>
          Basit mikrodenetleyicilerde kullanılır.
        </div>
      </div>
      <div style="background:var(--blue-b);border:1px solid color-mix(in srgb,var(--blue-light) 30%,transparent);border-radius:14px;padding:18px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
          <div style="width:10px;height:10px;border-radius:50%;background:var(--blue-light);flex-shrink:0;"></div>
          <h4 style="color:var(--blue-light);margin:0;font-size:.9rem;">DMA — Doğrudan Bellek Erişimi</h4>
        </div>
        <div style="font-size:.82rem;line-height:1.75;color:var(--text-dim);">
          DMA birimi transferi üstlenir, CPU <strong style="color:var(--blue-light)">serbest kalır</strong>.<br>
          Transfer bitince CPU'ya bildirim (interrupt) gelir.<br><br>
          Tüm modern bilgisayarlarda kullanılan yöntem.
        </div>
      </div>
    </div>
  </div>

  <!-- tab-katman gizli tutulur, JS çalışması için DOM'da kalır -->
  <div class="tab-panel" id="tab-katman" style="display:none!important;"></div>
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

    const setModeStyle = (active, inactive, bg, color) => {
      active.style.background = bg
      active.style.color = color
      inactive.style.background = 'var(--bg-card)'
      inactive.style.color = 'var(--text-muted)'
    }

    pollingBtn.addEventListener('click', () => {
      this._dmaMode = 'polling'
      setModeStyle(pollingBtn, dmaBtn, 'var(--red-b)', 'var(--red-light)')
      this._resetDma(root)
    })

    dmaBtn.addEventListener('click', () => {
      this._dmaMode = 'dma'
      setModeStyle(dmaBtn, pollingBtn, 'var(--blue-b)', 'var(--blue-light)')
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
    root.querySelector('#dma-log').innerHTML = ''

    ;['dma-cpu', 'dma-ram', 'dma-disk'].forEach(id =>
      root.querySelector('#' + id)?.classList.remove('active', 'cpu-active', 'done')
    )
    ;['arr-cpu-ram', 'arr-ram-disk'].forEach(id =>
      root.querySelector('#' + id)?.classList.remove('active', 'cpu-active')
    )
    ;['dma-cpu-bar', 'dma-ram-bar', 'dma-disk-bar'].forEach(id => {
      const el = root.querySelector('#' + id)
      if (el) el.style.width = '0%'
    })

    root.querySelector('#dma-cpu-label').textContent = 'Hazır'
    root.querySelector('#dma-ram-label').textContent = 'Boş'
    root.querySelector('#dma-disk-label').textContent = 'Hazır'

    const dot  = root.querySelector('#dma-status-dot')
    const txt  = root.querySelector('#dma-status-text')
    const box  = root.querySelector('#dma-cpu-status')
    const ctrl = root.querySelector('#dma-ctrl-badge')
    if (dot)  dot.style.cssText  = 'width:10px;height:10px;border-radius:50%;background:var(--text-dim);transition:all .4s;flex-shrink:0;'
    if (txt)  { txt.textContent = 'Hazır'; txt.style.color = 'var(--text-muted)' }
    if (box)  { box.style.borderColor = 'var(--border)'; box.style.background = 'var(--bg-card)' }
    if (ctrl) ctrl.style.opacity = '0'
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

    const setStatus = (emoji, text, dotColor, borderColor) => {
      const dot  = root.querySelector('#dma-status-dot')
      const txt  = root.querySelector('#dma-status-text')
      const box  = root.querySelector('#dma-cpu-status')
      if (dot) dot.style.background = dotColor
      if (txt) { txt.textContent = `${emoji} ${text}`; txt.style.color = dotColor }
      if (box) { box.style.borderColor = borderColor; box.style.background = borderColor + '22' }
    }
    const showCtrl = (visible) => {
      const el = root.querySelector('#dma-ctrl-badge')
      if (el) el.style.opacity = visible ? '1' : '0'
    }

    if (this._dmaMode === 'polling') {
      setStatus('🔴', 'MEŞGUL — disk yanıtını bekliyor', 'var(--red-light)', 'var(--red-light)')
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
        setStatus('❌', 'BLOKLANDÍ — 3.9s boşa harcandı', 'var(--orange-light)', 'var(--orange-light)')
        addLog('✅ Transfer tamamlandı. CPU transfer süresince bloklandı!', 'var(--orange-light)')
        addLog('⚠️ CPU başka iş yapamadı — bu süre tamamen israf!', 'var(--red-light)')
        this._dmaRunning = false
      }, 3900)

      this._timers.push(t1, t2, t3, t4, t5, t6)
    } else {
      setStatus('🔵', 'DMA programlandı', 'var(--blue-light)', 'var(--blue-light)')
      showCtrl(true)
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
        setStatus('🟢', 'SERBEST — başka iş yapıyor', 'var(--green-light)', 'var(--green-light)')
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
        setStatus('✅', 'Interrupt aldı — transfer bitti', 'var(--green-light)', 'var(--green-light)')
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

    if (!startBtn) return
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
