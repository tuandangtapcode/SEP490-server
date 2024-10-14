import express from "express"
import SubjectController from "../controllers/subject.controller"
import upload from '../middlewares/clouddinary.middleware'
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import SubjectValidation from "../validations/subject.validation"
import { parameterValidation } from "../validations/common.validation"

const SubjectRoute = express.Router()

SubjectRoute.post("/createSubject",
  authMiddleware([Roles.ROLE_ADMIN]),
  SubjectValidation.createUpdateSubject,
  SubjectController.createSubject
)
SubjectRoute.post("/getListSubject",
  SubjectValidation.getListSubject,
  SubjectController.getListSubject
)
SubjectRoute.post("/updateSubject",
  authMiddleware([Roles.ROLE_ADMIN]),
  SubjectValidation.createUpdateSubject,
  SubjectController.updateSubject
)
SubjectRoute.get("/deleteSubject/:SubjectID",
  authMiddleware([Roles.ROLE_ADMIN]),
  parameterValidation("SubjectID"),
  SubjectController.deleteSubject
)
SubjectRoute.get("/getDetailSubject/:SubjectID",
  parameterValidation("SubjectID"),
  SubjectController.getDetailSubject
)
SubjectRoute.post("/getListRecommendSubject",
  SubjectValidation.getListRecommendSubject,
  SubjectController.getListRecommendSubject
)

export default SubjectRoute
