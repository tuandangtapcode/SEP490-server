import express from "express"
import CommonController from "../controllers/common.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import PineconeController from "../controllers/pinecone.controller"

const CommonRoute = express.Router()

CommonRoute.get("/getListSystemkey",
  CommonController.getListSystemKey
)
CommonRoute.post("/createSystemKey",
  CommonController.createSystemKey
)
CommonRoute.get("/getProfitPercent",
  CommonController.getProfitPercent
)
CommonRoute.post("/changeProfitPercent",
  authMiddleware([Roles.ROLE_ADMIN]),
  CommonController.changeProfitPercent
)
CommonRoute.post("/insertParentKey",
  CommonController.insertParentKey
)
CommonRoute.get("/processAllSubjectSetting",
  PineconeController.processAllSubjectSetting
)
CommonRoute.post("/teacherRecommend",
  PineconeController.teacherRecommendation
)
CommonRoute.post("/getListTabs",
  authMiddleware([
    Roles.ROLE_ADMIN,
    Roles.ROLE_TEACHER,
    Roles.ROLE_STUDENT,
    Roles.ROLE_STAFF
  ]),
  CommonController.getListTabs
)

export default CommonRoute
