import express from "express"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import ConfirmController from "../controllers/confirm.controller"
import ConfirmValidation from "../validations/confirm.validation"

const ConfirmRoute = express.Router()

ConfirmRoute.post("/createConfirm",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  ConfirmValidation.createUpdateConfirm,
  ConfirmController.createConfirm
)
ConfirmRoute.post("/updateConfirm",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  ConfirmValidation.createUpdateConfirm,
  ConfirmController.updateConfirm
)
ConfirmRoute.post("/changeConfirmStatus",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  ConfirmValidation.changeConfirmStatus,
  ConfirmController.changeConfirmStatus
)
ConfirmRoute.post("/getListConfirm",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  ConfirmController.getListConfirm
)

export default ConfirmRoute
