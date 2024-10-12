import express from "express"
import IssueController from "../controllers/issue.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import IssueValidation from "../validations/issue.validation"

const IssueRoute = express.Router()

// Define model trên swagger
/**
 * @swagger
 * components:
 *  schemas:
 *    Issues:
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
 * /Issue/createIssue:
 *   post: 
 *     tags: [Issues]
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
 *         description: Tạo Issue thành công
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server error
 */
IssueRoute.post("/createIssue",
    authMiddleware([, Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
    IssueValidation.createIssue,
    IssueController.createIssue
)

/**
 * @swagger
 * /Issue/getListIssue:
 *   post:
 *     tags: [Issues]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               CurrentPage: 1 
 *               PageSize: 10
 *     responses:
 *       200:
 *         description: Lấy ra Issue thành công
 *       500:
 *         description: Internal server error
 */
IssueRoute.post("/getListIssue",
    authMiddleware([Roles.ROLE_ADMIN]),
    IssueValidation.getListIssue,
    IssueController.getListIssue
)

/**
 * @swagger
 * /Issue/getListIssueTimeTable:
 *   post:
 *     tags: [Issues]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               CurrentPage: 1 
 *               PageSize: 10
 *     responses:
 *       200:
 *         description: Lấy ra Issue thành công
 *       500:
 *         description: Internal server error
 */
IssueRoute.post("/getListIssueTimeTable",
    authMiddleware([Roles.ROLE_ADMIN]),
    IssueController.getListIssueTimeTable
)

/**
 * @swagger
 * /Issue/deleteIssue/{IssueID}:
 *   get:
 *     tags: [Issues]
 *     parameters:
 *       - in: path
 *         name: IssueID
 *         schema:
 *           type: ObjectId
 *     responses:
 *       200:
 *         description: Xoá Issue thành công
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
IssueRoute.get("/deleteIssue/:IssueID",
    authMiddleware([Roles.ROLE_ADMIN]),
    IssueController.deletedIssue
)

/**
 * @swagger
 * /Issue/handleIssue/{IssueID}:
 *   get:
 *     tags: [Issues]
 *     parameters:
 *       - in: path
 *         name: IssueID
 *         schema:
 *           type: ObjectId
 *     responses:
 *       200:
 *         description: Xoá Issue thành công
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
IssueRoute.get("/handleIssue/:IssueID",
    authMiddleware([Roles.ROLE_ADMIN]),
    IssueValidation.handleIssue,
    IssueController.handleIssue
)

export default IssueRoute
