import express from "express"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import { parameterValidation } from "../validations/common.validation"
import ConfirmController from "../controllers/confirm.controller"

const ConfirmRoute = express.Router()

export default ConfirmRoute