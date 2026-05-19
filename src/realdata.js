// Önce canlı sunucuya bağlanmayı dener (node server.js çalışıyorsa),
// yoksa snapshot.json'u kullanır.

import snapshot from './data/snapshot.json'

const LIVE_URL = 'http://localhost:4001/metrics'
const POLL_MS  = 5000

let _data      = snapshot
let _isLive    = false
let _listeners = []

export function getMetrics()  { return _data }
export function isLive()      { return _isLive }

export function onUpdate(fn)  { _listeners.push(fn) }
function _notify()            { _listeners.forEach(fn => fn(_data, _isLive)) }

async function _fetchLive() {
  try {
    const r = await fetch(LIVE_URL, { signal: AbortSignal.timeout(1500) })
    if (!r.ok) throw new Error()
    _data   = await r.json()
    _isLive = true
    _notify()
    return true
  } catch {
    _isLive = false
    return false
  }
}

// İlk yükleme: canlı sunucuya bak, bulamazsan snapshot devrede
_fetchLive()

// Canlı mod açıksa her 5s güncelle
setInterval(async () => {
  if (_isLive) await _fetchLive()
  else {
    // tekrar dene — kullanıcı sunucuyu sonradan başlatmış olabilir
    const ok = await _fetchLive()
    if (!ok) { _data = snapshot; _notify() }
  }
}, POLL_MS)
