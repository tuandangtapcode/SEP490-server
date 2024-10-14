import express from "express"
import AccountController from "../controllers/account.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import AccountValidation from "../validations/account.validation"

const AccountRoute = express.Router()

AccountRoute.post("/register",
  AccountValidation.register,
  AccountController.register
)
AccountRoute.post("/login",
  AccountController.login
)
AccountRoute.get("/checkAuth",
  AccountController.checkAuth
)
AccountRoute.post("/loginByGoogle",
  AccountController.loginByGoogle
)
AccountRoute.get("/logout",
  AccountController.logout
)
AccountRoute.post("/changePassword",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  AccountValidation.changePassword,
  AccountController.changePassword
)

export default AccountRoute
