// ── CPU Ring Module ───────────────────────────────
export const cpuRing = {
  template() {
    return `
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

  <div id="cr-realdata" data-realdata="cr" style="padding:0 0 4px"></div>

  <!-- TAB 5: Quiz -->
  <div id="cr-quiz" class="tab-panel">
    <div class="panel-title">Mini Quiz — Ring Mimarisi</div>
    <div class="panel-sub">Ne kadar anladın?</div>
    <div id="quiz-wrap"></div>
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

    // ── Tab 2: Ring diagram ──
    const ringData = {
      0: { title:'⚙️ Ring 0 — Kernel Mode', color:'var(--purple-light)', priv:100,
           desc:'En yüksek ayrıcalık seviyesi. İşletim sistemi çekirdeği burada çalışır. CPU\'nun tüm komutlarına ve tüm bellek adreslerine doğrudan erişim hakkı vardır.',
           perms:[['✅','Tüm CPU komutlarını çalıştırabilir'],['✅','Fiziksel belleğe doğrudan erişebilir'],['✅','I/O portlarını kullanabilir'],['✅','Interrupt tablolarını değiştirebilir'],['⚠️','Hata tüm sistemi çökertebilir (BSoD)']] },
      1: { title:'🔵 Ring 1 — OS Servisleri', color:'var(--blue-light)', priv:65,
           desc:'Teorik olarak OS servisleri için. Pratikte modern OS\'ler bunu kullanmaz. Bazı Hypervisor\'lar Guest OS\'i burada çalıştırır.',
           perms:[['✅','Çoğu CPU komutunu çalıştırabilir'],['⚠️','Bazı I/O işlemleri kısıtlı'],['❌','Tüm fiziksel belleğe erişemez'],['💡','VM\'de Guest OS bazen burada çalışır']] },
      2: { title:'🟢 Ring 2 — Aygıt Sürücüleri', color:'var(--green-light)', priv:35,
           desc:'Teorik olarak device driver\'lar için. Modern Linux ve Windows bu seviyeyi kullanmaz.',
           perms:[['✅','Kullanıcı modu komutları çalışır'],['⚠️','Bazı ayrıcalıklı komutlara kısıtlı erişim'],['❌','Doğrudan donanım erişimi yok'],['💡','Günümüzde neredeyse kullanılmıyor']] },
      3: { title:'👤 Ring 3 — User Mode', color:'var(--yellow-light)', priv:10,
           desc:'En düşük ayrıcalık seviyesi. Tüm kullanıcı uygulamaları burada çalışır. Donanıma doğrudan erişemezler.',
           perms:[['✅','Normal hesaplama yapabilir'],['✅','Kendi bellek alanını okuyabilir/yazabilir'],['❌','I/O portlarına erişemez'],['❌','Ayrıcalıklı CPU komutlarını çalıştıramaz'],['🔄','Syscall ile kernel\'dan yardım alır']] }
    }

    root.querySelectorAll('[data-ring]').forEach(el => {
      el.addEventListener('click', () => {
        root.querySelectorAll('[data-ring]').forEach(c => c.classList.remove('active'))
        el.classList.add('active')
        const d = ringData[parseInt(el.dataset.ring)]
        const panel = root.querySelector('#ring-info-panel')
        if (panel) panel.innerHTML = `
          <h3 style="color:${d.color};margin-bottom:10px">${d.title}</h3>
          <p>${d.desc}</p>
          <ul class="perm-list">${d.perms.map(([ic,txt]) => `<li><span>${ic}</span><span>${txt}</span></li>`).join('')}</ul>`
        const bar = root.querySelector('#priv-bar')
        if (bar) {
          bar.style.width = d.priv + '%'
          bar.style.background = d.priv > 70 ? 'var(--purple-light)' : d.priv > 40 ? 'var(--blue-light)' : d.priv > 20 ? 'var(--green-light)' : 'var(--yellow-light)'
        }
      })
    })

    // ── Tab 3: Syscall ──
    const syscallData = {
      read: {
        userCode: [
          '<span class="cm">// Dosya açma</span>',
          '<span class="kw">int</span> fd = <span class="fn">open</span>(<span class="str">"veri.txt"</span>, O_RDONLY);',
          '<span class="kw">char</span> buf[<span class="num">128</span>];',
          '<span class="fn active">read</span>(fd, buf, <span class="num">128</span>);  <span class="cm">← syscall!</span>',
          '<span class="cm">// Ring 3 bekliyor...</span>',
        ],
        kernelCode: [
          '<span class="cm">// sys_read() çağrıldı</span>',
          '<span class="fn">verify_fd</span>(fd);',
          '<span class="fn">check_permissions</span>(file);',
          '<span class="fn">disk_read</span>(file, buf, <span class="num">128</span>);',
          '<span class="fn">copy_to_user</span>(buf);',
        ],
        steps: [
          '<span class="log-app">[Ring 3] read() çağrıldı → TRAP komutu üretiliyor</span>',
          '<span class="log-trap">[TRAP]  CPU Ring 3 → Ring 0 geçişi (CPL: 3→0)</span>',
          '<span class="log-kern">[Ring 0] sys_read() — dosya izinleri kontrol ediliyor</span>',
          '<span class="log-kern">[Ring 0] Disk\'ten veri okunuyor — DMA transfer başlatılıyor</span>',
          '<span class="log-kern">[Ring 0] Veri user space buffer\'ına kopyalanıyor</span>',
          '<span class="log-ret">[IRET]  CPU Ring 0 → Ring 3 dönüyor (CPL: 0→3) — veri hazır</span>',
        ]
      },
      write: {
        userCode: [
          '<span class="cm">// Ekrana yazma</span>',
          '<span class="kw">char</span>* msg = <span class="str">"Merhaba!"</span>;',
          '<span class="fn active">write</span>(STDOUT, msg, <span class="num">8</span>);  <span class="cm">← syscall!</span>',
          '<span class="cm">// Ring 3 bekliyor...</span>',
        ],
        kernelCode: [
          '<span class="cm">// sys_write() çağrıldı</span>',
          '<span class="fn">verify_fd</span>(STDOUT);',
          '<span class="fn">copy_from_user</span>(msg);',
          '<span class="fn">terminal_write</span>(msg, <span class="num">8</span>);',
          '<span class="cm">// STDOUT\'a yazıldı ✓</span>',
        ],
        steps: [
          '<span class="log-app">[Ring 3] write() çağrıldı → SYSENTER komutu</span>',
          '<span class="log-trap">[TRAP]  Ring 3 → Ring 0 geçişi (CPL: 3→0)</span>',
          '<span class="log-kern">[Ring 0] sys_write() — STDOUT geçerli mi kontrol et</span>',
          '<span class="log-kern">[Ring 0] Mesaj User Space\'den Kernel\'e kopyalanıyor</span>',
          '<span class="log-kern">[Ring 0] Terminal sürücüsüne yazılıyor</span>',
          '<span class="log-ret">[SYSEXIT] Ring 0 → Ring 3 dönüş (CPL: 0→3)</span>',
        ]
      },
      malloc: {
        userCode: [
          '<span class="cm">// Bellek tahsisi</span>',
          '<span class="kw">int</span>* arr = (<span class="kw">int</span>*) <span class="fn active">malloc</span>(<span class="num">1024</span>);',
          '<span class="cm">// malloc → brk() syscall!</span>',
          '<span class="cm">// Ring 3 bekliyor...</span>',
        ],
        kernelCode: [
          '<span class="cm">// sys_brk() çağrıldı</span>',
          '<span class="fn">find_free_pages</span>(<span class="num">1024</span>);',
          '<span class="fn">update_page_table</span>(pid);',
          '<span class="fn">map_virtual_pages</span>();',
          '<span class="cm">// Sanal bellek haritalandı ✓</span>',
        ],
        steps: [
          '<span class="log-app">[Ring 3] malloc() çağrıldı — C kütüphanesi devreye giriyor</span>',
          '<span class="log-app">[Ring 3] Yeterli alan yoksa brk() syscall\'ı yapılıyor</span>',
          '<span class="log-trap">[TRAP]  Ring 3 → Ring 0 geçişi</span>',
          '<span class="log-kern">[Ring 0] sys_brk() — boş fiziksel sayfa aranıyor</span>',
          '<span class="log-kern">[Ring 0] Sayfa tablosu güncelleniyor</span>',
          '<span class="log-ret">[SYSEXIT] Yeni bellek adresi Ring 3\'e döndürülüyor</span>',
        ]
      },
      fork: {
        userCode: [
          '<span class="cm">// Yeni process oluştur</span>',
          '<span class="kw">pid_t</span> pid = <span class="fn active">fork</span>();  <span class="cm">← syscall!</span>',
          '<span class="kw">if</span> (pid == <span class="num">0</span>) {',
          '  <span class="cm">// child process</span>',
          '}',
        ],
        kernelCode: [
          '<span class="cm">// sys_fork() çağrıldı</span>',
          '<span class="fn">copy_process</span>(current);',
          '<span class="fn">copy_page_tables</span>();  <span class="cm">← CoW</span>',
          '<span class="fn">copy_file_descriptors</span>();',
          '<span class="fn">add_to_runqueue</span>(child);',
        ],
        steps: [
          '<span class="log-app">[Ring 3] fork() çağrıldı</span>',
          '<span class="log-trap">[TRAP]  Ring 3 → Ring 0 geçişi</span>',
          '<span class="log-kern">[Ring 0] Mevcut process kopyalanıyor (PCB kopyası)</span>',
          '<span class="log-kern">[Ring 0] Sayfa tabloları kopyalanıyor (Copy-on-Write)</span>',
          '<span class="log-kern">[Ring 0] Child process ready kuyruğuna ekleniyor</span>',
          '<span class="log-ret">[SYSEXIT] İki kez dönüyor: parent\'a child PID, child\'a 0</span>',
        ]
      },
      socket: {
        userCode: [
          '<span class="cm">// Ağ soketi oluştur</span>',
          '<span class="kw">int</span> s = <span class="fn active">socket</span>(AF_INET,',
          '         SOCK_STREAM, <span class="num">0</span>);',
          '<span class="cm">// Ring 3 bekliyor...</span>',
        ],
        kernelCode: [
          '<span class="cm">// sys_socket() çağrıldı</span>',
          '<span class="fn">inet_create</span>(sock);',
          '<span class="fn">alloc_socket_buffer</span>();',
          '<span class="fn">init_tcp_stack</span>(sock);',
          '<span class="fn">return_fd</span>();',
        ],
        steps: [
          '<span class="log-app">[Ring 3] socket() çağrıldı — TCP bağlantısı isteniyor</span>',
          '<span class="log-trap">[TRAP]  Ring 3 → Ring 0 geçişi</span>',
          '<span class="log-kern">[Ring 0] Ağ protokol stack başlatılıyor</span>',
          '<span class="log-kern">[Ring 0] Socket buffer\'ları kernel heap\'te ayrılıyor</span>',
          '<span class="log-kern">[Ring 0] TCP/IP stack yapılandırılıyor</span>',
          '<span class="log-ret">[SYSEXIT] Socket file descriptor Ring 3\'e döndürülüyor</span>',
        ]
      }
    }

    root.querySelectorAll('[data-syscall]').forEach(btn => {
      btn.addEventListener('click', () => {
        this._timers.forEach(t => clearTimeout(t))
        this._timers = []
        root.querySelectorAll('[data-syscall]').forEach(b => b.classList.remove('active-sc'))
        btn.classList.add('active-sc')
        const d = syscallData[btn.dataset.syscall]
        if (!d) return

        const uc = root.querySelector('#user-code')
        const kc = root.querySelector('#kernel-code')
        const log = root.querySelector('#sc-log')
        const up  = root.querySelector('#sc-up')
        const down= root.querySelector('#sc-down')

        if (log) log.innerHTML = ''
        if (uc)  uc.innerHTML = d.userCode.map(l => `<div class="code-line">${l}</div>`).join('')
        if (kc)  kc.innerHTML = '<div class="code-line cm">// bekleniyor...</div>'
        if (up)  { up.style.opacity = '0.2'; up.style.color = 'var(--text-muted)' }
        if (down){ down.style.opacity = '0.2'; down.style.color = 'var(--text-muted)' }

        d.steps.forEach((step, i) => {
          const t = setTimeout(() => {
            if (log) { log.innerHTML += step + '\n'; log.scrollTop = log.scrollHeight }
            if (i === 0) { if (up) { up.style.opacity = '1'; up.style.color = 'var(--yellow-light)' } }
            if (i === 1) {
              if (up) up.style.color = 'var(--red-light)'
              if (kc) kc.innerHTML = d.kernelCode.map(l => `<div class="code-line">${l}</div>`).join('')
            }
            if (i >= 2 && i < d.steps.length - 1) {
              const idx = i - 2
              kc?.querySelectorAll('.code-line').forEach((el, j) => el.classList.toggle('active', j === idx))
            }
            if (i === d.steps.length - 1) {
              if (down) { down.style.opacity = '1'; down.style.color = 'var(--green-light)' }
              if (up)   up.style.opacity = '0.3'
              if (log) log.innerHTML += '<span class="log-ok">✅ Syscall tamamlandı</span>\n'
            }
          }, i * 600)
          this._timers.push(t)
        })
      })
    })

    // ── Tab 4: VM ring layers ──
    const layerDetails = {
      'vm-app':    { title:'🧩 Guest Uygulama — Ring 3',           text:'VM içindeki uygulama Ring 3\'te çalışır. Bir şey yapmak istediğinde Guest OS\'e syscall gönderir. VM içinde olduğunu bilmez.' },
      'vm-guestos':{ title:'🖥️ Guest OS Kernel — Ring 1 / vRing 0',text:'Guest OS normalde Ring 0\'da çalışmak ister. Hypervisor gerçek Ring 0\'ı tutar. VT-x ile "sanal Ring 0"da çalışır. Her ayrıcalıklı komut VMEXIT üretir.' },
      'vm-hyp':    { title:'🔷 Hypervisor — Gerçek Ring 0',         text:'Hypervisor sistemdeki en yetkili yazılımdır. Guest OS\'lerin donanıma erişim taleplerini karşılar, aralarındaki izolasyonu sağlar.' },
      'vm-hw':     { title:'💾 Fiziksel Donanım',                   text:'Sadece Hypervisor (Ring 0) doğrudan erişebilir. Guest OS her zaman Hypervisor üzerinden geçmek zorundadır.' },
      'dk-app':    { title:'🧩 Container Uygulaması — Ring 3',      text:'Container uygulaması da Ring 3\'te çalışır. Namespace izolasyonu sayesinde diğer container\'lardan haberi yoktur ama aynı kernel\'ı paylaşır.' },
      'dk-hostos': { title:'⚙️ Host OS Kernel — Ring 0',           text:'Tüm container\'ların paylaştığı tek kernel. Container uygulaması syscall yaptığında Hypervisor yoktur — doğrudan bu kernel\'a ulaşır.' },
      'dk-hw':     { title:'💾 Fiziksel Donanım',                   text:'Host OS Kernel (Ring 0) doğrudan erişir. Araya giren Hypervisor katmanı yoktur.' },
    }

    root.querySelectorAll('[data-vring]').forEach(el => {
      el.addEventListener('click', () => {
        const d = layerDetails[el.dataset.vring]
        if (!d) return
        const detailId = el.dataset.vring.startsWith('vm') ? '#vm-ring-detail' : '#dk-ring-detail'
        const detail = root.querySelector(detailId)
        if (detail) detail.innerHTML = `<h4>${d.title}</h4>${d.text}`
      })
    })

    // ── Tab 5: Quiz ──
    const questions = [
      { q:'Hangi ring seviyesinde işletim sistemi çekirdeği çalışır?', opts:['Ring 3','Ring 2','Ring 1','Ring 0'], correct:3, explain:'Ring 0 en yüksek ayrıcalık seviyesidir ve OS kernel\'i burada çalışır.' },
      { q:'Bir uygulama dosya okumak istediğinde ne yapar?', opts:['Doğrudan diske erişir','Syscall yaparak kernel\'dan yardım ister','Başka bir uygulamadan ister','Hypervisor\'a bağlanır'], correct:1, explain:'Ring 3\'teki uygulamalar donanıma erişemez. Syscall (TRAP) ile Ring 0\'a geçerek kernel\'dan yardım alırlar.' },
      { q:'VM\'de "VMEXIT" neden maliyetlidir?', opts:['Uygulamalar yavaş yazıldığı için','Guest OS Ring 0 → Hypervisor Ring 0 geçişi ekstra zaman alır','Docker daha fazla bellek kullandığı için','Sadece TLB temizlenmesi gerektiği için'], correct:1, explain:'Guest OS\'in her ayrıcalıklı işleminde CPU durumu kaydedilip Hypervisor\'a geçiş yapılır. Bu ~500-2000 ns ekstra maliyet demektir.' },
      { q:'Docker container\'larında syscall VM\'e kıyasla neden daha hızlıdır?', opts:['Container\'lar daha az bellek kullanır','Docker daha iyi yazılmıştır','Hypervisor katmanı yoktur, syscall doğrudan Host Kernel\'a gider','Container\'lar Ring 0\'da çalışır'], correct:2, explain:'Docker\'da araya giren Hypervisor yoktur. Syscall Ring 3\'ten doğrudan Host Kernel\'ın Ring 0\'ına ulaşır.' },
      { q:'x86 mimarisinde kaç ring seviyesi vardır?', opts:['2','3','4','8'], correct:2, explain:'x86\'da Ring 0\'dan Ring 3\'e kadar 4 seviye vardır. Modern OS\'ler yalnızca Ring 0 (kernel) ve Ring 3 (user) kullanır.' }
    ]

    const quizWrap = root.querySelector('#quiz-wrap')
    if (quizWrap) {
      const answers = {}
      questions.forEach((q, qi) => {
        const card = document.createElement('div')
        card.className = 'quiz-card'
        card.innerHTML = `<div class="quiz-q">${qi+1}. ${q.q}</div>
          <div class="quiz-opts">${q.opts.map((o,oi) => `<button class="quiz-opt" data-qi="${qi}" data-oi="${oi}">${o}</button>`).join('')}</div>
          <div class="quiz-result" id="qres-${qi}" style="display:none"></div>`
        quizWrap.appendChild(card)
      })

      const scoreDiv = document.createElement('div')
      scoreDiv.className = 'quiz-score'
      scoreDiv.id = 'quiz-score'
      scoreDiv.style.display = 'none'
      quizWrap.appendChild(scoreDiv)

      quizWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-opt')
        if (!btn) return
        const qi = parseInt(btn.dataset.qi)
        const oi = parseInt(btn.dataset.oi)
        if (answers[qi] !== undefined) return
        answers[qi] = oi
        const q = questions[qi]
        quizWrap.querySelectorAll(`[data-qi="${qi}"]`).forEach(b => b.classList.add('answered'))
        quizWrap.querySelector(`[data-qi="${qi}"][data-oi="${q.correct}"]`)?.classList.add('correct')
        if (oi !== q.correct) btn.classList.add('wrong')
        const res = root.querySelector(`#qres-${qi}`)
        if (res) {
          res.style.display = 'block'
          res.className = 'quiz-result ' + (oi === q.correct ? 'result-ok' : 'result-fail')
          res.textContent = (oi === q.correct ? '✅ Doğru! ' : '❌ Yanlış. ') + q.explain
        }
        if (Object.keys(answers).length === questions.length) {
          const score = Object.entries(answers).filter(([qi, oi]) => questions[qi].correct === parseInt(oi)).length
          const sd = root.querySelector('#quiz-score')
          if (sd) {
            sd.style.display = 'block'
            sd.innerHTML = `${score === questions.length ? '🏆' : score >= 3 ? '👍' : '📚'}
              Sonuç: <strong style="color:${score >= 4 ? 'var(--green-light)' : score >= 3 ? 'var(--yellow-light)' : 'var(--red-light)'}">${score} / ${questions.length}</strong>
              <div style="font-size:0.8rem;color:var(--text-muted);margin-top:6px">
                ${score === questions.length ? 'Mükemmel! Ring mimarisini tam anladın.' : score >= 3 ? 'İyi iş! Birkaç konuyu tekrar gözden geçir.' : 'Simülasyonları tekrar incele ve dene.'}
              </div>`
          }
        }
      })
    }

    // Gerçek veri paneli
    const renderCrReal = () => window.renderRealDataPanel?.('cr-realdata', m => [
      { value: m.cpu.ring3_pct + '%', label: 'Ring 3 (user) CPU' },
      { value: m.cpu.ring0_pct + '%', label: 'Ring 0 (kernel) CPU' },
      { value: m.cpu.idle_pct  + '%', label: 'Idle' },
      { value: m.system.cores,        label: 'CPU çekirdek' },
    ])
    window['_rdFn_cr'] = renderCrReal
    renderCrReal()
  },

  destroy() {
    if (this._timers) {
      this._timers.forEach(t => { clearTimeout(t) })
      this._timers = []
    }
  }
}
