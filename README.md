# Docker vs VM — Interaktif Simulasyon Platformu

https://docker-vs-vm.vercel.app/

Bilgisayar Organizasyonu dersi kapsaminda hazirlanmis, Docker ve Sanal Makine (VM) teknolojilerini karsilastiran interaktif bir web uygulamasidir. Paging, Context Switch, CPU Ring ve Disk I/O konularini simulasyonlar ve gercek sistem verileriyle goruntuler.

## Ekip Uyeleri

| Isim |
|------|
| Aziz Egemen Basturk |
| Muzaffer Kara |
| Demir Cem Metin |
| Alperen Baydar |
| Ege Ergul |

---

## Moduller

### 1. Docker vs Sanal Makine
- Donanim katmani mimarisi diyagrami
- Boot sureci karsilastirmasi (adim adim animasyon)
- RAM kaynak kullanimi karsilastirmasi
- Kernel Namespace izolasyonu simulasyonu

### 2. Sayfalama (Paging)
- Sanal adresten fiziksel adrese ceviri animasyonu
- TLB hit/miss simulasyonu
- VM'de cift katmanli EPT/NPT vs Container'da tek sayfa tablosu karsilastirmasi
- Gercek sistem paging istatistikleri (pgfault/s, pgmajfault/s)

### 3. Context Switch
- CPU register kaydetme/yukleme adim adim gosterimi
- PCB (Process Control Block) yapisi
- VM'de VMEXIT maliyeti vs Container'da namespace gecisi
- Round Robin Scheduler simulasyonu
- Gercek sistem context switch verileri (ctxt/s, proses sayisi)

### 4. CPU Ring 0 / Ring 3
- Kernel mode vs User mode diyagrami
- Syscall akisi simulasyonu (read, write, fork...)
- VM'de VMEXIT maliyeti
- Konuyu pekistiren mini quiz
- Gercek CPU kullanim oranlari (Ring 0%, Ring 3%, idle%)

### 5. Disk I/O & DMA
- I/O katman yolculugu animasyonu
- OverlayFS ve Copy-on-Write simulasyonu
- DMA transferi: CPU polling vs DMA karsilastirmasi
- VM vs Container I/O karsilastirmasi
- Gercek disk okuma/yazma istatistikleri

### 6. Canli Veriler (Live Dashboard)
- /proc sanal dosya sisteminden gercek zamanli veri okuma
- Sparkline grafikleri ile context switch/s, Ring 0%, page fault/s, disk okuma/s
- CPU kullanim cubugu (Ring 3 | Ring 0 | Idle)
- Docker stres testi: 4 container baslatip anlik yuk artisini gozlemleme

---

## Teknoloji Yigini

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Vanilla JS + Vite |
| Stil | Vanilla CSS (CSS Variables, Grid, Flexbox) |
| Animasyon | Canvas API, requestAnimationFrame |
| Veri Toplama | Node.js, /proc sanal dosya sistemi |
| Canli Sunucu | Node.js HTTP (port 4001) |
| Stres Testi | Docker (busybox container'lari) |

---

## Kurulum

### Gereksinimler

- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)
- *(Canli veri icin)* WSL2 + Ubuntu (Windows kullanicilari icin)
- *(Stres testi icin)* Docker Desktop

### 1. Repoyu klonla

```bash
git clone https://github.com/EgemenBstr/docker-vs-vm.git
cd docker-vs-vm
```

### 2. Bagimliliklari yukle

```bash
npm install
```

### 3. Uygulamayi baslat

```bash
npm run dev
```

Tarayici otomatik acilir: `http://localhost:3000`

> Canli veri sunucusu olmadan da uygulama calisir — simulasyonlar ve gercekci snapshot verisi her zaman aktiftir.

---

## Canli Veri Sistemi

Uygulama, sunumu yaparken gercek Linux sistem verilerini gosterebilir. Bu ozellik **WSL2 (Windows Subsystem for Linux)** uzerinden calisir.

### Nasil calisir?

```
Linux /proc dosya sistemi
        |
        v
  Node.js server.js  -->  http://localhost:4001/metrics
        |
        v
  src/realdata.js  -->  Her 5 saniyede fetch
        |
        v
  Tum modullerindeki "Gercek Sistem Olcumu" panelleri
```

- Sunucu erisilebilyorsa: **CANLI** rozeti gorunur
- Sunucu kapaliuysa: **SNAPSHOT** rozeti ile onceden alinmis gercek veri gosterilir

### Canli veriyi baslatma adimlari

**1. WSL terminalini ac** (Windows Baslat menusunden Ubuntu)

```bash
cd /mnt/c/Users/KULLANICI_ADI/docker-vs-vm
node server.js
```

Sunucu hazir mesaji gorunmeli.

**2. Ayri bir PowerShell penceresinde frontend'i baslat**

```bash
npm run dev
```

**3. Tarayicida kontrol et**

`http://localhost:3000` acin, **Canli Veriler** sekmesine girin, CANLI rozeti yesil yaniyorsa sistem calisiyor demektir.

### Snapshot guncelleme (istege bagli)

WSL'de projenin bulundugu klasorden:

```bash
node scripts/collect.js
```

Bu komut `/proc` dosyalarini okuyup `src/data/snapshot.json` dosyasini gunceller.

---

## Docker Stres Testi

Canli dashboard sayfasindaki **"4 Container Baslat"** butonu, 4 adet busybox container'i yuksek CPU yuku ile calistirir. Docker Desktop acik olmalidir.

```bash
# Manuel test (WSL terminalinde)
curl -X POST http://localhost:4001/stress/start   # Baslat
curl -X POST http://localhost:4001/stress/stop    # Durdur
curl http://localhost:4001/stress/status          # Calisan container sayisi
```

---

## API Referansi

| Method | Endpoint | Aciklama |
|--------|----------|----------|
| `GET` | `/metrics` | CPU, paging, context switch, disk anlik verileri |
| `POST` | `/stress/start` | 4 busybox container baslat |
| `POST` | `/stress/stop` | Container'lari durdur |
| `GET` | `/stress/status` | Calisan container sayisi |

---

## Proje Yapisi

```
docker-vs-vm/
├── index.html              # Giris noktasi, footer, floating nav
├── vite.config.js          # Vite yapilandirmasi
├── server.js               # Canli veri HTTP sunucusu (WSL'de calisir)
├── scripts/
│   └── collect.js          # Snapshot veri toplayici
├── public/
│   └── favicon.svg         # Site ikonu
└── src/
    ├── main.js             # Routing, navigasyon, global yardimcilar
    ├── realdata.js         # Canli/snapshot veri yoneticisi
    ├── style.css           # Global stiller
    ├── data/
    │   └── snapshot.json   # Onceden toplanmis gercek sistem verisi
    └── modules/
        ├── live-dashboard.js
        ├── docker-vm.js
        ├── paging.js
        ├── context-switch.js
        ├── cpu-ring.js
        └── disk-io.js
```

---

## Lisans

Bu proje Bilgisayar Organizasyonu dersi kapsaminda egitim amacli hazirlanmistir.
