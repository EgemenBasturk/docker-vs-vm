#!/usr/bin/env node
// WSL veya Linux'ta çalıştır: node scripts/collect.js
// /proc dosyalarını okur, src/data/snapshot.json üretir

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const OUT   = join(__dir, '../src/data/snapshot.json')

function read(path) {
  try { return readFileSync(path, 'utf8') } catch { return '' }
}

function parseVmstat() {
  const obj = {}
  read('/proc/vmstat').split('\n').forEach(l => {
    const [k, v] = l.trim().split(/\s+/)
    if (k) obj[k] = parseInt(v) || 0
  })
  return obj
}

function parseStat() {
  const obj = {}
  read('/proc/stat').split('\n').forEach(l => {
    const p = l.trim().split(/\s+/)
    if (p[0]) obj[p[0]] = p.slice(1).map(Number)
  })
  return obj
}

function parseDiskstats() {
  for (const line of read('/proc/diskstats').split('\n')) {
    const p = line.trim().split(/\s+/)
    if (p.length < 14) continue
    const name = p[2]
    if (/^(sd[a-z]|vd[a-z]|nvme\d+n\d+)$/.test(name)) {
      return {
        device:            name,
        reads_completed:   parseInt(p[3]),
        writes_completed:  parseInt(p[7]),
        read_sectors:      parseInt(p[5]),
        write_sectors:     parseInt(p[9]),
      }
    }
  }
  return null
}

console.log('📊 İlk ölçüm alınıyor...')
const vm1 = parseVmstat()
const st1 = parseStat()
const dk1 = parseDiskstats()

await new Promise(r => setTimeout(r, 1000))
console.log('📊 İkinci ölçüm alınıyor (1s sonra)...')

const vm2 = parseVmstat()
const st2 = parseStat()
const dk2 = parseDiskstats()

// CPU kullanımı (Ring 3 = user, Ring 0 = sys)
const c1 = st1['cpu'] || [], c2 = st2['cpu'] || []
const tot = (c2.reduce((a,b)=>a+b,0)) - (c1.reduce((a,b)=>a+b,0)) || 1
const user_pct = +((c2[0]-c1[0] + (c2[1]||0)-(c1[1]||0)) / tot * 100).toFixed(1)
const sys_pct  = +((c2[2]-c1[2]) / tot * 100).toFixed(1)
const idle_pct = +((c2[3]-c1[3]) / tot * 100).toFixed(1)

// Context switch hızı
const ctxt_per_sec      = (st2['ctxt']?.[0] ?? 0) - (st1['ctxt']?.[0] ?? 0)
const processes_per_sec = (st2['processes']?.[0] ?? 0) - (st1['processes']?.[0] ?? 0)

// Sayfalama hızı
const pgfault_per_sec    = (vm2.pgfault    || 0) - (vm1.pgfault    || 0)
const pgmajfault_per_sec = (vm2.pgmajfault || 0) - (vm1.pgmajfault || 0)

// Disk hızı
let disk = { device: 'N/A', reads_per_sec: 0, writes_per_sec: 0, read_kb_per_sec: 0, write_kb_per_sec: 0 }
if (dk1 && dk2) {
  disk = {
    device:          dk1.device,
    reads_per_sec:   dk2.reads_completed  - dk1.reads_completed,
    writes_per_sec:  dk2.writes_completed - dk1.writes_completed,
    read_kb_per_sec:  Math.round((dk2.read_sectors  - dk1.read_sectors)  * 512 / 1024),
    write_kb_per_sec: Math.round((dk2.write_sectors - dk1.write_sectors) * 512 / 1024),
  }
}

// Sistem bilgisi
const hostname = read('/proc/sys/kernel/hostname').trim() || 'unknown'
const kernel   = (read('/proc/version').match(/Linux version [\d.\w-]+/) || ['?'])[0]
const cores    = (read('/proc/cpuinfo').match(/^processor/gm) || []).length || 1

const snapshot = {
  _note: 'collect.js ile üretildi — bunu silme, scripts/collect.js yeniden çalışınca güncellenir',
  collected_at: new Date().toISOString(),
  system: { hostname, kernel, cores },
  paging: {
    pgfault_per_sec,
    pgmajfault_per_sec,
    pgfault_total:    vm2.pgfault    || 0,
    pgmajfault_total: vm2.pgmajfault || 0,
    note: pgmajfault_per_sec === 0
      ? 'Major fault yok — veriler önbellekte'
      : `${pgmajfault_per_sec}/s major fault — diskten yükleniyor`,
  },
  context_switch: {
    ctxt_per_sec,
    processes_per_sec,
    running: parseInt(st2['procs_running']?.[0]) || 0,
    blocked: parseInt(st2['procs_blocked']?.[0]) || 0,
  },
  cpu: {
    user_pct, sys_pct, idle_pct,
    ring3_pct: user_pct,
    ring0_pct: sys_pct,
  },
  disk,
}

try { mkdirSync(join(__dir, '../src/data'), { recursive: true }) } catch {}
writeFileSync(OUT, JSON.stringify(snapshot, null, 2))

console.log('\n✅ Kaydedildi:', OUT)
console.log(`\n📈 Özet:`)
console.log(`   Context switch : ${ctxt_per_sec.toLocaleString()}/s`)
console.log(`   Page fault     : ${pgfault_per_sec.toLocaleString()}/s minor, ${pgmajfault_per_sec}/s major`)
console.log(`   CPU            : user=${user_pct}%  sys=${sys_pct}%  idle=${idle_pct}%`)
console.log(`   Disk (${disk.device})  : ${disk.reads_per_sec} r/s, ${disk.writes_per_sec} w/s`)
