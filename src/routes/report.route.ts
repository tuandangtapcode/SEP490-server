import express from "express"
import ReportController from "../controllers/report.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import ReportValidation from "../validations/report.validation"

const ReportRoute = express.Router()

// Define model trên swagger
/**
 * @swagger
 * components:
 *  schemas:
 *    Reports:
 *      type: object
 *      required: 
 *        - Title
 *        - Contents
 *      properties:
 *        _id:
 *            type: ObjectId
 *        Sender: 
 *            type: ObjectId
 *        Timtable: 
 *            type: ObjectId
 *        Title:
 *            type: String
 *        Context:
 *            type: String
 *        IsDeleted: 
 *            type: boolean
 */

/**
 * @swagger
 * /report/createReport:
 *   post: 
 *     tags: [Reports]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               Sender: "6655fcc5bcb0ce4413635c6d"
 *               Timtable: "6672f61059a8b20054bbf69f"
 *               Title: "Báo cáo quá trình giảng dạy giáo viên không nghiêm túc"
 *               Context: "abcdfgh"
 *     responses:
 *       201:
 *         description: Tạo Report thành công
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server error
 */
ReportRoute.post("/createReport",
    authMiddleware([, Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
    ReportValidation.createReport,
    ReportController.createReport
)

/**
 * @swagger
 * /report/getListReport:
 *   post:
 *     tags: [Reports]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               CurrentPage: 1 
 *               PageSize: 10
 *     responses:
 *       200:
 *         description: Lấy ra report thành công
 *       500:
 *         description: Internal server error
 */
ReportRoute.post("/getListReport",
    authMiddleware([Roles.ROLE_ADMIN]),
    ReportValidation.getListReport,
    ReportController.getListReport
)

/**
 * @swagger
 * /report/getListReportTimeTable:
 *   post:
 *     tags: [Reports]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               CurrentPage: 1 
 *               PageSize: 10
 *     responses:
 *       200:
 *         description: Lấy ra report thành công
 *       500:
 *         description: Internal server error
 */
ReportRoute.post("/getListReportTimeTable",
    authMiddleware([Roles.ROLE_ADMIN]),
    ReportController.getListReportTimeTable
)

/**
 * @swagger
 * /report/deleteReport/{ReportID}:
 *   get:
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: ReportID
 *         schema:
 *           type: ObjectId
 *     responses:
 *       200:
 *         description: Xoá report thành công
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
ReportRoute.get("/deleteReport/:ReportID",
    authMiddleware([Roles.ROLE_ADMIN]),
    ReportController.deletedReport
)

/**
 * @swagger
 * /report/handleReport/{ReportID}:
 *   get:
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: ReportID
 *         schema:
 *           type: ObjectId
 *     responses:
 *       200:
 *         description: Xoá report thành công
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
ReportRoute.get("/handleReport/:ReportID",
    authMiddleware([Roles.ROLE_ADMIN]),
    ReportValidation.handleReport,
    ReportController.handleReport
)

export default ReportRoute
