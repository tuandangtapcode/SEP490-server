import express from "express"
import NotificationController from "../controllers/notification.controller"
import authMiddleware from '../middlewares/auth.middleware'
import { Roles } from '../utils/lib.js'
import NotificaitonValidation from "../validations/notification.validation"

const NotificationRoute = express.Router()

// Define model trên swagger
/**
 * @swagger
 * components:
 *  schemas:
 *    Notifications:
 *      type: object
 *      required: 
 *        - Sender
 *        - Content
 *        - Type
 *      properties:
 *        _id:
 *            type: ObjectId
 *        Sender: 
 *            type: ObjectId
 *        Content:
 *            type: string
 *        Type:
 *            type: string
 *        IsSeen: 
 *            type: boolean
 *        IsNew: 
 *            type: boolean
 */

/**
 *  @swagger
 *  /notification/createNotification:
 *    post:
 *      tags: [Notifications]
 *      requestBody:
 *        content:
 *          application/json:
 *              example:
 *                Sender: 664c1480b8f11adfc4f4a85b
 *                Content: "string" 
 *                Type: "string"
 *      responses:
 *        200:
 *          description: Thêm thông báo
 *        500:
 *           description: internal server error
 */
NotificationRoute.post('/createNotification',
  authMiddleware([Roles.ROLE_STAFF, Roles.ROLE_STUDENT, Roles.ROLE_TEACHER, Roles.ROLE_ADMIN]),
  NotificaitonValidation.createNotificaiton,
  NotificationController.createNotification
)

/**
 * @swagger
 * /notification/changeStatusNotification/{ReceiverID}:
 *   get:
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: SubjectID
 *         schema:
 *           type: ObjectId
 *     responses:
 *       200:
 *         description: Seen thông báo
 *       500:
 *        description: Internal server error
 */
NotificationRoute.get('/changeStatusNotification/:ReceiverID',
  authMiddleware([Roles.ROLE_STAFF, Roles.ROLE_STUDENT, Roles.ROLE_TEACHER, Roles.ROLE_ADMIN]),
  NotificationController.changeStatusNotification
)

/**
 * @swagger
 * /notification/getListNotification:
 *   get:
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Seen thông báo
 *       500:
 *        description: Internal server error
 */
NotificationRoute.get('/getListNotification/:ReceiverID',
  authMiddleware([Roles.ROLE_STAFF, Roles.ROLE_STUDENT, Roles.ROLE_TEACHER, Roles.ROLE_ADMIN]),
  NotificationController.getListNotification
)

/**
 *  @swagger
 *  /notification/seenNotification:
 *    post:
 *      tags: [Notifications]
 *      requestBody:
 *        content:
 *          application/json:
 *              example:
 *                ReceiverID: 664c1480b8f11adfc4f4a85b
 *                NotificationID: 664c1480b8f11adfc4f4a85b
 *      responses:
 *        200:
 *          description: Thêm thông báo
 *        500:
 *           description: internal server error
 */
NotificationRoute.post('/seenNotification',
  authMiddleware([Roles.ROLE_STAFF, Roles.ROLE_STUDENT, Roles.ROLE_TEACHER, Roles.ROLE_ADMIN]),
  NotificaitonValidation.seenNotification,
  NotificationController.seenNotification
)

export default NotificationRoute
