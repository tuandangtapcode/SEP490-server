import express from "express"
import LearnHistoryController from "../controllers/learnhistory.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import LearnhistoryValidation from "../validations/learnhistory.validation"

const LearnHistoryRoute = express.Router()

LearnHistoryRoute.post("/createLearnHistory",
  authMiddleware([Roles.ROLE_STUDENT]),
  LearnhistoryValidation.createLearnHistory,
  LearnHistoryController.createLearnHistory
)
LearnHistoryRoute.post("/getListLearnHistory",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  LearnHistoryController.getListLearnHistory
)

export default LearnHistoryRoute
