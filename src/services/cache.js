/**
 * Lightweight runtime/tab-local in-memory cache.
 * Avoids redundant network roundtrips during normal session navigation (e.g. Home -> Products -> Home).
 * Entries expire automatically after TTL (default 5 minutes).
 */
const cache = new Map()

/**
 * Retrieve an item from the in-memory cache if not expired.
 * @param {string} key
 * @returns {any|null}
 */
export function getCache(key) {
  const item = cache.get(key)
  if (!item) return null
  if (Date.now() > item.expiry) {
    cache.delete(key)
    return null
  }
  return item.value
}

/**
 * Store an item in the in-memory cache with a TTL.
 * @param {string} key
 * @param {any} value
 * @param {number} [ttlMs=300000] - 5 minutes default
 */
export function setCache(key, value, ttlMs = 5 * 60 * 1000) {
  cache.set(key, {
    value,
    expiry: Date.now() + ttlMs,
  })
}

/**
 * Invalidate cached items matching a key prefix, or clear the entire cache.
 * @param {string} [prefix]
 */
export function invalidateCache(prefix) {
  if (!prefix) {
    cache.clear()
    return
  }
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key)
    }
  }
}
