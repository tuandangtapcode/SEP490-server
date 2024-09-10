import NodeCache from "node-cache"

const cache = new NodeCache()

const setCache = (key: string, value: any, duration: number) => {
  return cache.set(key, value, duration)
}

const getCache = (key: string) => {
  return cache.get(key)
}

const CacheService = {
  setCache,
  getCache
}

export default CacheService
