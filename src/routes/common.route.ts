import express from "express"
import CommonController from "../controllers/common.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"

const CommonRoute = express.Router()

CommonRoute.get("/getListSystemkey",
  CommonController.getListSystemKey
)
CommonRoute.get("/getProfitPercent",
  CommonController.getProfitPercent
)
CommonRoute.post("/changeProfitPercent",
  authMiddleware([Roles.ROLE_ADMIN]),
  CommonController.changeProfitPercent
)

export default CommonRoute
