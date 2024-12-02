import express from "express"
import NotificationController from "../controllers/notification.controller"
import authMiddleware from '../middlewares/auth.middleware'
import { Roles } from '../utils/constant'
import NotificaitonValidation from "../validations/notification.validation"

const NotificationRoute = express.Router()

NotificationRoute.post('/createNotification',
  authMiddleware([
    Roles.ROLE_ADMIN,
    Roles.ROLE_TEACHER,
    Roles.ROLE_STUDENT,
    Roles.ROLE_STAFF
  ]),
  NotificaitonValidation.createNotificaiton,
  NotificationController.createNotification
)
NotificationRoute.get('/changeStatusNotification/:ReceiverID',
  authMiddleware([
    Roles.ROLE_ADMIN,
    Roles.ROLE_TEACHER,
    Roles.ROLE_STUDENT,
    Roles.ROLE_STAFF
  ]),
  NotificationController.changeStatusNotification
)
NotificationRoute.get('/getListNotification/:ReceiverID',
  authMiddleware([
    Roles.ROLE_ADMIN,
    Roles.ROLE_TEACHER,
    Roles.ROLE_STUDENT,
    Roles.ROLE_STAFF
  ]),
  NotificationController.getListNotification
)
NotificationRoute.post('/seenNotification',
  authMiddleware([
    Roles.ROLE_ADMIN,
    Roles.ROLE_TEACHER,
    Roles.ROLE_STUDENT,
    Roles.ROLE_STAFF
  ]),
  NotificationController.seenNotification
)

export default NotificationRoute
