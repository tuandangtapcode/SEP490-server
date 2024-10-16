import express from "express"
import SubjectCateController from "../controllers/subjectcate.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import SubjectCateValidation from "../validations/subjectcate.validation"

const SubjectCateRoute = express.Router()

SubjectCateRoute.post("/createSubjectCate",
  authMiddleware([Roles.ROLE_ADMIN]),
  SubjectCateValidation.createUpdateSubjectCate,
  SubjectCateController.createSubjectCate
)
SubjectCateRoute.post("/getListSubjectCate",
  SubjectCateController.getListSubjectCate
)
SubjectCateRoute.post("/updateSubjectCate",
  authMiddleware([Roles.ROLE_ADMIN]),
  SubjectCateValidation.createUpdateSubjectCate,
  SubjectCateController.updateSubjectCate
)
SubjectCateRoute.get("/deleteSubjectCate/:SubjectCateID",
  authMiddleware([Roles.ROLE_ADMIN]),
  SubjectCateController.deleteSubjectCate
)
SubjectCateRoute.post("/getDetailSubjectCate",
  SubjectCateController.getDetailSubjectCate
)
SubjectCateRoute.get("/getListSubjectCateAndSubject",
  SubjectCateController.getListSubjectCateAndSubject
)

export default SubjectCateRoute
