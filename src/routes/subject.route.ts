import express from "express"
import SubjectController from "../controllers/subject.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import SubjectValidation from "../validations/subject.validation"

const SubjectRoute = express.Router()

SubjectRoute.post("/createSubject",
  authMiddleware([Roles.ROLE_ADMIN, Roles.ROLE_STAFF]),
  SubjectValidation.createUpdateSubject,
  SubjectController.createSubject
)
SubjectRoute.post("/getListSubject",
  SubjectController.getListSubject
)
SubjectRoute.post("/updateSubject",
  authMiddleware([Roles.ROLE_ADMIN, Roles.ROLE_STAFF]),
  SubjectValidation.createUpdateSubject,
  SubjectController.updateSubject
)
SubjectRoute.post("/deleteSubject",
  authMiddleware([Roles.ROLE_ADMIN, Roles.ROLE_STAFF]),
  SubjectController.deleteSubject
)
SubjectRoute.get("/getDetailSubject/:SubjectID",
  SubjectController.getDetailSubject
)
SubjectRoute.get("/getListTopSubject",
  SubjectController.getListTopSubject
)
SubjectRoute.post("/getListSubjectByAdmin",
  authMiddleware([Roles.ROLE_ADMIN, Roles.ROLE_STAFF]),
  SubjectController.getListSubjectByAdmin
)

export default SubjectRoute
