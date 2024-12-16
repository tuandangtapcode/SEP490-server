import express from "express"
import StatisticController from "../controllers/statistic.controller"
import { Roles } from "../utils/constant"
import authMiddleware from "../middlewares/auth.middleware"

const StatisticRoute = express.Router()

StatisticRoute.get("/statisticTotalUser",
  authMiddleware([Roles.ROLE_ADMIN]),
  StatisticController.statisticTotalUser
)
StatisticRoute.get("/statisticNewRegisteredUser",
  authMiddleware([Roles.ROLE_ADMIN]),
  StatisticController.statisticNewRegisteredUser
)
StatisticRoute.get("/statisticTotalBooking",
  authMiddleware([Roles.ROLE_ADMIN]),
  StatisticController.statisticTotalBooking
)
StatisticRoute.post("/statisticFinancial",
  authMiddleware([Roles.ROLE_ADMIN]),
  StatisticController.statisticFinancial
)
StatisticRoute.get("/statisticTopTeacher",
  authMiddleware([Roles.ROLE_ADMIN]),
  StatisticController.statisticTopTeacher
)
StatisticRoute.post("/statisticBooking",
  authMiddleware([Roles.ROLE_ADMIN]),
  StatisticController.statisticBooking
)

export default StatisticRoute
