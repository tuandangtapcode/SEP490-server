import redisClient from "../config/RedisConfig"

const setCache = async (key: string, value: any, duration: number) => {
  return await redisClient.set(key, value, {
    EX: duration
  })
}

const getCache = async (key: string) => {
  return await redisClient.get(key)
}

const CacheService = {
  setCache,
  getCache
}

export default CacheService
