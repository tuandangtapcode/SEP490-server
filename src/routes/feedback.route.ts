import express from "express"
import FeedbackController from "../controllers/feedback.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import FeedbackValidation from "../validations/feedback.validation"
import { parameterValidation } from "../validations/common.validation"

const FeedbackRoute = express.Router()

FeedbackRoute.post("/createFeedback",
  authMiddleware([Roles.ROLE_STUDENT]),
  FeedbackValidation.createFeedback,
  FeedbackController.createFeedback
)
FeedbackRoute.post("/getListFeedbackOfTeacher",
  FeedbackValidation.getListFeedbackOfTeacher,
  FeedbackController.getListFeedbackOfTeacher
)
FeedbackRoute.get("/deleteFeedback/:FeedbackID",
  authMiddleware([Roles.ROLE_STUDENT]),
  parameterValidation("FeedbackID"),
  FeedbackController.deletedFeedback
)

export default FeedbackRoute
