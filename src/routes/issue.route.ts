import express from "express"
import IssueController from "../controllers/issue.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import IssueValidation from "../validations/issue.validation"
import { parameterValidation } from "../validations/common.validation"

const IssueRoute = express.Router()

IssueRoute.post("/createIssue",
  authMiddleware([, Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  IssueValidation.createIssue,
  IssueController.createIssue
)
IssueRoute.post("/getListIssue",
  authMiddleware([Roles.ROLE_ADMIN]),
  IssueController.getListIssue
)
IssueRoute.post("/getListIssueTimeTable",
  authMiddleware([Roles.ROLE_ADMIN]),
  IssueController.getListIssueTimeTable
)
IssueRoute.get("/deleteIssue/:IssueID",
  authMiddleware([Roles.ROLE_ADMIN]),
  IssueController.deletedIssue
)
IssueRoute.get("/handleIssue/:IssueID",
  authMiddleware([Roles.ROLE_ADMIN]),
  IssueController.handleIssue
)

export default IssueRoute
