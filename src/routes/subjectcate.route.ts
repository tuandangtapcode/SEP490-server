import express from "express"
import SubjectCateController from "../controllers/subjectcate.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import SubjectCateValidation from "../validations/subjectcate.validation"
import { parameterValidation } from "../validations/common.validation"

const SubjectCateRoute = express.Router()

SubjectCateRoute.post("/createSubjectCate",
  authMiddleware([Roles.ROLE_ADMIN]),
  SubjectCateValidation.createUpdateSubjectCate,
  SubjectCateController.createSubjectCate
)
SubjectCateRoute.post("/getListSubjectCate",
  SubjectCateValidation.getListSubjectCate,
  SubjectCateController.getListSubjectCate
)
SubjectCateRoute.post("/updateSubjectCate",
  authMiddleware([Roles.ROLE_ADMIN]),
  SubjectCateValidation.createUpdateSubjectCate,
  SubjectCateController.updateSubjectCate
)
SubjectCateRoute.get("/deleteSubjectcate/:SubjectCateID",
  authMiddleware([Roles.ROLE_ADMIN]),
  parameterValidation("SubjectCateID"),
  SubjectCateController.deleteSubjectCate
)
SubjectCateRoute.post("/getDetailSubjectCate",
  SubjectCateValidation.getDetailSubjectCate,
  SubjectCateController.getDetailSubjectCate
)
SubjectCateRoute.get("/getListSubjectCateAndSubject",
  SubjectCateController.getListSubjectCateAndSubject
)

export default SubjectCateRoute
