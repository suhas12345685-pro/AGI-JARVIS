const cache = new Map();

function set(key, value, ttlSeconds = 300) {
  cache.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
}

function get(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function del(key) {
  cache.delete(key);
}

module.exports = { set, get, del };
