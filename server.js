#!/usr/bin/env node
import { createServer }  from 'http'
import { readFileSync }  from 'fs'
import { exec }          from 'child_process'

const PORT        = 4001
const STRESS_NAME = 'ld_stress'  // container prefix

function read(p) { try { return readFileSync(p, 'utf8') } catch { return '' } }

function collect() {
  const vm = {}, st = {}
  read('/proc/vmstat').split('\n').forEach(l => {
    const [k,v] = l.trim().split(/\s+/)
    if (k) vm[k] = parseInt(v)||0
  })
  read('/proc/stat').split('\n').forEach(l => {
    const p = l.trim().split(/\s+/)
    if (p[0]) st[p[0]] = p.slice(1).map(Number)
  })
  let dk = null
  for (const line of read('/proc/diskstats').split('\n')) {
    const p = line.trim().split(/\s+/)
    if (p.length < 14) continue
    if (/^(sd[a-z]|vd[a-z]|nvme\d+n\d+)$/.test(p[2])) {
      dk = { device:p[2], rc:+p[3], wc:+p[7], rs:+p[5], ws:+p[9] }; break
    }
  }
  return { vm, st, dk, ts: Date.now() }
}

function sh(cmd) {
  return new Promise(resolve => exec(cmd, (err, stdout) => resolve({ err, out: stdout.trim() })))
}

let prev = collect()

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  // ── GET /metrics ──────────────────────────────────
  if (req.method === 'GET' && req.url === '/metrics') {
    const cur = collect()
    const dt  = (cur.ts - prev.ts) / 1000 || 1
    const c1  = prev.st['cpu']||[], c2 = cur.st['cpu']||[]
    const tot = (c2.reduce((a,b)=>a+b,0) - c1.reduce((a,b)=>a+b,0)) || 1
    const user_pct = +((c2[0]-c1[0]+(c2[1]||0)-(c1[1]||0))/tot*100).toFixed(1)
    const sys_pct  = +((c2[2]-c1[2])/tot*100).toFixed(1)
    const idle_pct = +((c2[3]-c1[3])/tot*100).toFixed(1)

    prev = cur
    res.writeHead(200)
    res.end(JSON.stringify({
      collected_at: new Date().toISOString(),
      system: {
        hostname: read('/proc/sys/kernel/hostname').trim(),
        kernel:   (read('/proc/version').match(/Linux version [\d.\w-]+/)||['?'])[0],
        cores:    (read('/proc/cpuinfo').match(/^processor/gm)||[]).length || 1,
      },
      paging: {
        pgfault_per_sec:    Math.round(((cur.vm.pgfault||0)-(prev.vm?.pgfault||0))/dt),
        pgmajfault_per_sec: Math.round(((cur.vm.pgmajfault||0)-(prev.vm?.pgmajfault||0))/dt),
        pgfault_total:    cur.vm.pgfault||0,
        pgmajfault_total: cur.vm.pgmajfault||0,
      },
      context_switch: {
        ctxt_per_sec:      Math.round(((cur.st['ctxt']?.[0]||0)-(prev.st?.['ctxt']?.[0]||0))/dt),
        processes_per_sec: Math.round(((cur.st['processes']?.[0]||0)-(prev.st?.['processes']?.[0]||0))/dt),
        running: parseInt(cur.st['procs_running']?.[0])||0,
        blocked: parseInt(cur.st['procs_blocked']?.[0])||0,
      },
      cpu: { user_pct, sys_pct, idle_pct, ring3_pct: user_pct, ring0_pct: sys_pct },
      disk: cur.dk ? {
        device:           cur.dk.device,
        reads_per_sec:    Math.max(0, Math.round((cur.dk.rc-(prev.dk?.rc||cur.dk.rc))/dt)),
        writes_per_sec:   Math.max(0, Math.round((cur.dk.wc-(prev.dk?.wc||cur.dk.wc))/dt)),
        read_kb_per_sec:  Math.max(0, Math.round((cur.dk.rs-(prev.dk?.rs||cur.dk.rs))*512/1024/dt)),
        write_kb_per_sec: Math.max(0, Math.round((cur.dk.ws-(prev.dk?.ws||cur.dk.ws))*512/1024/dt)),
      } : { device:'N/A', reads_per_sec:0, writes_per_sec:0, read_kb_per_sec:0, write_kb_per_sec:0 },
    }))
    return
  }

  // ── POST /stress/start ────────────────────────────
  if (req.method === 'POST' && req.url === '/stress/start') {
    const cmds = [1,2,3,4].map(i =>
      `docker run -d --rm --name ${STRESS_NAME}_${i} busybox sh -c "while true; do :; done"`
    )
    for (const cmd of cmds) await sh(cmd)
    res.writeHead(200); res.end(JSON.stringify({ ok: true, msg: '4 container başlatıldı' }))
    return
  }

  // ── POST /stress/stop ─────────────────────────────
  if (req.method === 'POST' && req.url === '/stress/stop') {
    await sh(`docker stop ${[1,2,3,4].map(i=>`${STRESS_NAME}_${i}`).join(' ')}`)
    res.writeHead(200); res.end(JSON.stringify({ ok: true, msg: 'Container\'lar durduruldu' }))
    return
  }

  // ── GET /stress/status ────────────────────────────
  if (req.method === 'GET' && req.url === '/stress/status') {
    const { out } = await sh(`docker ps --filter name=${STRESS_NAME} --format "{{.Names}}"`)
    const count = out ? out.split('\n').filter(Boolean).length : 0
    res.writeHead(200); res.end(JSON.stringify({ count }))
    return
  }

  res.writeHead(404); res.end('{}')
})

server.listen(PORT, () => {
  console.log(`✅ Sunucu hazır: http://localhost:${PORT}`)
  console.log(`   /metrics        → canlı sistem verisi`)
  console.log(`   POST /stress/start → 4 Docker container başlat`)
  console.log(`   POST /stress/stop  → container'ları durdur`)
  console.log('\n   Ctrl+C ile durdur')
})
