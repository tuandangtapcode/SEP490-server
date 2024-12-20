import express from "express"
import PaymentController from "../controllers/payment.controller"
import authMiddleware from '../middlewares/auth.middleware'
import { Roles } from "../utils/constant"
import PaymentValidation from "../validations/payment.validation"
import upload from '../middlewares/clouddinary.middleware'

const PaymentRoute = express.Router()

PaymentRoute.post("/createPayment",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_ADMIN, Roles.ROLE_TEACHER]),
  PaymentValidation.createPayment,
  PaymentController.createPayment
)
PaymentRoute.post("/getListPaymentHistoryByUser",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_ADMIN, Roles.ROLE_TEACHER]),
  PaymentController.getListPaymentHistoryByUser
)
PaymentRoute.post("/changePaymentStatus",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_ADMIN, Roles.ROLE_TEACHER]),
  upload('Bill').single('Image'),
  PaymentValidation.changePaymentStatus,
  PaymentController.changePaymentStatus
)
PaymentRoute.post("/getListPayment",
  authMiddleware([Roles.ROLE_ADMIN]),
  PaymentController.getListPayment
)
PaymentRoute.get("/exportExcel",
  authMiddleware([Roles.ROLE_ADMIN]),
  PaymentController.exportExcel
)
PaymentRoute.post("/getListTransfer",
  authMiddleware([Roles.ROLE_ADMIN]),
  PaymentController.getListTransfer
)

export default PaymentRoute
