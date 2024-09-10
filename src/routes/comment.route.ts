import express from "express"
import CommentController from "../controllers/comment.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/lib.js"
import CommentValidation from "../validations/comment.validation"

const CommentRoute = express.Router()

// Define model trên swagger
/**
 * @swagger
 * components:
 *  schemas:
 *    Comment:
 *      type: object
 *      required: 
 *        - Sender
 *        - Receiver
 *        - Content
 *        - Rate
 *      properties:
 *        _id:
 *            type: ObjectId
 *        Sender: 
 *            type: ObjectId
 *        Receiver: 
 *            type: ObjectId
 *        Content:
 *            type: string
 *        Rate:
 *            type: number
 */

/**
 * @swagger
 * /comment/createComment:
 *   post:
 *     tags: [Comments]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *                User:
 *                  type: ObjectId
 *                Teacher: 
 *                  type: ObjectId
 *                Content:
 *                  type: string
 *                Rate:
 *                  type: number
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */
CommentRoute.post("/createComment",
  authMiddleware([Roles.ROLE_STUDENT]),
  CommentValidation.createComment,
  CommentController.createComment
)

/**
 * @swagger
 * /comment/getListCommentOfTeacher:
 *   post:
 *     tags: [Comments]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               TeacherID: 664c1480b8f11adfc4f4a85b
 *               CurrentPage: 1 
 *               PageSize: 10
 *     responses:
 *       200:
 *         description: Lấy ra thành công
 *       500:
 *         description: Internal server error
 */
CommentRoute.post("/getListCommentOfTeacher",
  CommentValidation.getListCommentOfTeacher,
  CommentController.getListCommentOfTeacher
)

/**
 * @swagger
 * /comment/deleteComment/{CommentID}:
 *   get:
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: CommentID
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
CommentRoute.get("/deleteComment/:CommentID",
  authMiddleware([Roles.ROLE_STUDENT]),
  CommentController.deletedComment
)


export default CommentRoute
