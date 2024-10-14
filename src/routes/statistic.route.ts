import express from "express"
import StatisticController from "../controllers/statistic.controller"
import { Roles } from "../utils/constant"
import authMiddleware from "../middlewares/auth.middleware"
import StatisticValidation from "../validations/statistic.validation"

const StatisticRoute = express.Router()

StatisticRoute.post("/statisticTotalUser",
  authMiddleware([Roles.ROLE_ADMIN]),
  StatisticValidation.statisticTotalUser,
  StatisticController.statisticTotalUser
)
StatisticRoute.get("/statisticNewRegisteredUser",
  authMiddleware([Roles.ROLE_ADMIN]),
  StatisticValidation.statisticNewRegisteredUser,
  StatisticController.statisticNewRegisteredUser
)
StatisticRoute.get("/statisticBooking",
  authMiddleware([Roles.ROLE_ADMIN]),
  StatisticController.statisticBooking
)
StatisticRoute.post("/statisticFinancial",
  authMiddleware([Roles.ROLE_ADMIN]),
  StatisticController.statisticFinancial
)

export default StatisticRoute
