// import { createClient } from "redis"
// import dotenv from "dotenv"
// dotenv.config()

// const redisClient = createClient({
//   url: process.env.REDIS_URL
// })

// const initRedis = async () => {

//   redisClient.on("error", (err: any) => {
//     console.log("Redis client error:", err.toString())

//   })

//   redisClient.on("ready", () => {
//     console.log("Redis client started")
//   })

//   await redisClient.connect()

//   await redisClient.ping()
// }

// initRedis()

// export default redisClient
