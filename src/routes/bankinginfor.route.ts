import express from "express"
import BankingInforController from "../controllers/bankinginfor.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import BankInforValidation from "../validations/bankinginfor.validation"

const BankingInforRoute = express.Router()

BankingInforRoute.post("/createBankingInfor",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  BankInforValidation.createUpdateBankingInfor,
  BankingInforController.createBankingInfor
)
BankingInforRoute.get("/getDetailBankingInfor",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  BankingInforController.getDetailBankingInfor
)
BankingInforRoute.post("/getListBankingInfor",
  //authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  BankingInforController.getListBankingInfor
)
BankingInforRoute.get("/deleteBankingInfor/:BankingInforID",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  BankingInforController.deleteBankingInfor
)
BankingInforRoute.post("/updateBankingInfor",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  BankInforValidation.createUpdateBankingInfor,
  BankingInforController.updateBankingInfor
)
BankingInforRoute.post("/getBankingInforOfUser",
  authMiddleware([Roles.ROLE_ADMIN, Roles.ROLE_STAFF]),
  BankingInforController.getBankingInforOfUser
)

export default BankingInforRoute
