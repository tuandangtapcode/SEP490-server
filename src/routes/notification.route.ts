import express from "express"
import NotificationController from "../controllers/notification.controller"
import authMiddleware from '../middlewares/auth.middleware'
import { Roles } from '../utils/constant'
import NotificaitonValidation from "../validations/notification.validation"
import { parameterValidation } from "../validations/common.validation"

const NotificationRoute = express.Router()

NotificationRoute.post('/createNotification',
  authMiddleware([, Roles.ROLE_STUDENT, Roles.ROLE_TEACHER, Roles.ROLE_ADMIN]),
  NotificaitonValidation.createNotificaiton,
  NotificationController.createNotification
)
NotificationRoute.get('/changeStatusNotification/:ReceiverID',
  authMiddleware([, Roles.ROLE_STUDENT, Roles.ROLE_TEACHER, Roles.ROLE_ADMIN]),
  parameterValidation("ReceiverID"),
  NotificationController.changeStatusNotification
)
NotificationRoute.get('/getListNotification/:ReceiverID',
  authMiddleware([, Roles.ROLE_STUDENT, Roles.ROLE_TEACHER, Roles.ROLE_ADMIN]),
  parameterValidation("ReceiverID"),
  NotificationController.getListNotification
)
NotificationRoute.post('/seenNotification',
  authMiddleware([, Roles.ROLE_STUDENT, Roles.ROLE_TEACHER, Roles.ROLE_ADMIN]),
  NotificaitonValidation.seenNotification,
  NotificationController.seenNotification
)

export default NotificationRoute
