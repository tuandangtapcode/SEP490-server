import express from "express"
import MessageController from "../controllers/message.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/lib.js"
import MessageValidation from "../validations/message.validation"

const MessageRoute = express.Router()

// Define model trên swagger
/**
 * @swagger
 * components:
 *  schemas:
 *    Messages:
 *      type: object
 *      required: 
 *        - Chat
 *        - Sender
 *        - Content
 *      properties:
 *        _id:
 *            type: ObjectId
 *        Sender: 
 *            type: ObjectId
 *        Chat: 
 *            type: ObjectId
 *        Content:
 *            type: string
 *        IsDeleted:
 *            type: boolean
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Chats:
 *      type: object
 *      required: 
 *        - Members
 *      properties:
 *        _id:
 *            type: ObjectId
 *        Members: 
 *            type: array
 *            items:
 *              type: ObjectId
 *        LastMessage: 
 *            type: string
 *        IsSeen:
 *            type: boolean
 *        IsDeleted:
 *            type: boolean
 */

/**
 * @swagger
 * /message/createMessage:
 *   post:
 *     tags: [Messages]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               Content: "string"
 *     responses:
 *       200:
 *         description: Thêm thành công
 *       500:
 *         description: Internal server error
 */
MessageRoute.post("/createMessage",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_ADMIN, Roles.ROLE_STAFF, Roles.ROLE_TEACHER]),
  MessageValidation.createMessage,
  MessageController.createMessage
)

/**
 * @swagger
 * /message/getMessageByChat:
 *   post:
 *     tags: [Messages]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               ChatID: 664c1480b8f11adfc4f4a85b
 *               PageSize: 10
 *               CurrentPage: 1
 *     responses:
 *       200:
 *         description: Thêm thành công
 *       500:
 *         description: Internal server error
 */
MessageRoute.post("/getMessageByChat",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_ADMIN, Roles.ROLE_STAFF, Roles.ROLE_TEACHER]),
  MessageValidation.getMessageByChat,
  MessageController.getMessageByChat
)

/**
 * @swagger
 * /message/getChatWithUser:
 *   post:
 *     tags: [Messages]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               Receiver: 664c1480b8f11adfc4f4a85b
 *     responses:
 *       200:
 *         description: Thêm thành công
 *       500:
 *         description: Internal server error
 */
MessageRoute.post("/getChatWithUser",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_ADMIN, Roles.ROLE_STAFF, Roles.ROLE_TEACHER]),
  MessageValidation.getChatWithUser,
  MessageController.getChatWithUser
)

/**
 * @swagger
 * /message/getChatOfAdmin:
 *   get:
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: Thêm thành công
 *       500:
 *         description: Internal server error
 */
MessageRoute.get("/getChatOfAdmin",
  authMiddleware([Roles.ROLE_ADMIN]),
  MessageController.getChatOfAdmin
)

/**
 * @swagger
 * /message/seenMessage/{ChatID}:
 *   get:
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: ChatID
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
MessageRoute.get("/seenMessage/:ChatID",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_ADMIN, Roles.ROLE_STAFF, Roles.ROLE_TEACHER]),
  MessageValidation.seenMessage,
  MessageController.seenMessage
)

/**
 * @swagger
 * /message/getChatOfUser:
 *   get:
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: Thêm thành công
 *       500:
 *         description: Internal server error
 */
MessageRoute.get("/getChatOfUser",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  MessageController.getChatOfUser
)

export default MessageRoute
