import express from "express"
import FeedbackController from "../controllers/feedback.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import FeedbackValidation from "../validations/feedback.validation"

const FeedbackRoute = express.Router()

FeedbackRoute.post("/createFeedback",
  authMiddleware([Roles.ROLE_STUDENT]),
  FeedbackValidation.createFeedback,
  FeedbackController.createFeedback
)
FeedbackRoute.post("/getListFeedbackOfTeacher",
  FeedbackController.getListFeedbackOfTeacher
)
FeedbackRoute.get("/deleteFeedback/:FeedbackID",
  authMiddleware([Roles.ROLE_ADMIN, Roles.ROLE_STAFF]),
  FeedbackController.deletedFeedback
)
FeedbackRoute.post("/getListFeedback",
  authMiddleware([Roles.ROLE_ADMIN, Roles.ROLE_STAFF]),
  FeedbackController.getListFeedback
)


export default FeedbackRoute
