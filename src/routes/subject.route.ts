import express from "express"
import SubjectController from "../controllers/subject.controller"
import upload from '../middlewares/clouddinary.middleware'
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import SubjectValidation from "../validations/subject.validation"

const SubjectRoute = express.Router()

// Define model trên swagger
/**
 * @swagger
 * components:
 *  schemas:
 *    Subjects:
 *      type: object
 *      required: 
 *        - SubjectCateID
 *        - SubjectName
 *        - AvatarPath
 *      properties:
 *        _id:
 *            type: ObjectId
 *        SubjectCateID: 
 *            type: ObjectId
 *        SubjectName:
 *            type: string
 *        AvatarPath:
 *            type: string
 *        IsDeleted: 
 *            type: boolean
 */

/**
 * @swagger
 * /subject/createSubject:
 *   post:
 *     tags: [Subjects]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *                SubjectCateID:
 *                  type: ObjectId
 *                SubjectName: 
 *                  type: string
 *                Avatar:
 *                  type: string
 *                  format: binary
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */
SubjectRoute.post("/createSubject",
  authMiddleware([Roles.ROLE_ADMIN]),
  SubjectValidation.createSubject,
  SubjectController.createSubject
)

/**
 * @swagger
 * /subject/getListSubject:
 *   post:
 *     tags: [Subjects]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               TextSearch: ""
 *               SubjectCateID: 664c1480b8f11adfc4f4a85b
 *               CurrentPage: 1 
 *               PageSize: 10
 *     responses:
 *       200:
 *         description: Lấy ra thành công
 *       500:
 *         description: Internal server error
 */
SubjectRoute.post("/getListSubject",
  SubjectValidation.getListSubject,
  SubjectController.getListSubject
)

/**
 * @swagger
 * /subject/updateSubject:
 *   post:
 *     tags: [Subjects]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *                SubjectID:
 *                  type: ObjectId
 *                SubjectCateID:
 *                  type: ObjectId
 *                SubjectName: 
 *                  type: string
 *                Avatar:
 *                  type: string
 *                  format: binary
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */
SubjectRoute.post("/updateSubject",
  authMiddleware([Roles.ROLE_ADMIN]),
  SubjectValidation.updateSubject,
  SubjectController.updateSubject
)

/**
 * @swagger
 * /subject/deleteSubject/{SubjectID}:
 *   get:
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: SubjectID
 *         schema:
 *           type: ObjectId
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
SubjectRoute.get("/deleteSubject/:SubjectID",
  authMiddleware([Roles.ROLE_ADMIN]),
  SubjectController.deleteSubject
)

/**
 * @swagger
 * /subject/getDetailSubject/{SubjectID}:
 *   get:
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: SubjectID
 *         schema:
 *           type: ObjectId
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
SubjectRoute.get("/getDetailSubject/:SubjectID",
  SubjectValidation.getDetailSubject,
  SubjectController.getDetailSubject
)

export default SubjectRoute
