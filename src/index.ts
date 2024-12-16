import express from "express"
import http from "http"
import { Server } from 'socket.io'
import * as dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import helmet from "helmet"
import { rateLimit } from "express-rate-limit"
import compression from "compression"
dotenv.config()
import cors from 'cors'
import connect from './config/DBConfig'
import routes from './routes/index'
import schedule from "node-schedule"
import getListPaymentInCurrentWeek from "./tools/getListPaymentInCurrentWeek"
import socket from "./sockets/index"
import checkConfirmExpire from "./tools/checkConfirmExpire"
import checkBlogExpire from "./tools/checkBlogExpire"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
  }
})

const allowOrigins = [
  "http://localhost:5173",
  "https://tatuboo.io.vn",
  "https://www.tatuboo.io.vn",
  "https://main.d26zf9z3jjijde.amplifyapp.com"
]

app.use(cors({
  origin: allowOrigins,
  credentials: true,
}))

app.use(compression())

app.use(helmet())

app.use(cookieParser())

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
}))

app.use(express.json())

routes(app)

// đặt lịch tự động gọi hàm lấy danh sách payment cho giáo viên trong tuần
schedule.scheduleJob('0 23 * * 0', () => {
  getListPaymentInCurrentWeek()
})

// đặt lịch tự động gọi hàm kiểm tra confirm hết hạn và update trạng thái
schedule.scheduleJob('0 0 * * *', () => {
  checkConfirmExpire()
  checkBlogExpire()
})

socket(io)

server.listen(process.env.PORT, async () => {
  await connect()
  console.log(`App listening at http://localhost:${process.env.PORT}`)
})

export default app