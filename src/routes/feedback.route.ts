import express from "express"
import FeedbackController from "../controllers/feedback.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import FeedbackValidation from "../validations/feedback.validation"

const FeedbackRoute = express.Router()

// Define model trên swagger
/**
 * @swagger
 * components:
 *  schemas:
 *    Feedback:
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
 * /Feedback/createFeedback:
 *   post:
 *     tags: [Feedbacks]
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
FeedbackRoute.post("/createFeedback",
  authMiddleware([Roles.ROLE_STUDENT]),
  FeedbackValidation.createFeedback,
  FeedbackController.createFeedback
)

/**
 * @swagger
 * /Feedback/getListFeedbackOfTeacher:
 *   post:
 *     tags: [Feedbacks]
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
FeedbackRoute.post("/getListFeedbackOfTeacher",
  FeedbackValidation.getListFeedbackOfTeacher,
  FeedbackController.getListFeedbackOfTeacher
)

/**
 * @swagger
 * /Feedback/deleteFeedback/{FeedbackID}:
 *   get:
 *     tags: [Feedbacks]
 *     parameters:
 *       - in: path
 *         name: FeedbackID
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
FeedbackRoute.get("/deleteFeedback/:FeedbackID",
  authMiddleware([Roles.ROLE_STUDENT]),
  FeedbackController.deletedFeedback
)


export default FeedbackRoute
