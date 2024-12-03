import express from "express"
import MessageController from "../controllers/message.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import MessageValidation from "../validations/message.validation"

const MessageRoute = express.Router()

MessageRoute.post("/createMessage",
  authMiddleware([
    Roles.ROLE_ADMIN,
    Roles.ROLE_TEACHER,
    Roles.ROLE_STUDENT,
    Roles.ROLE_STAFF
  ]),
  MessageValidation.createMessage,
  MessageController.createMessage
)
MessageRoute.post("/getMessageByChat",
  authMiddleware([
    Roles.ROLE_ADMIN,
    Roles.ROLE_TEACHER,
    Roles.ROLE_STUDENT,
    Roles.ROLE_STAFF
  ]),
  MessageController.getMessageByChat
)
MessageRoute.post("/getChatWithUser",
  authMiddleware([
    Roles.ROLE_ADMIN,
    Roles.ROLE_TEACHER,
    Roles.ROLE_STUDENT,
    Roles.ROLE_STAFF
  ]),
  MessageController.getChatWithUser
)
MessageRoute.get("/getChatOfAdmin",
  authMiddleware([
    Roles.ROLE_ADMIN,
    Roles.ROLE_TEACHER,
    Roles.ROLE_STUDENT,
    Roles.ROLE_STAFF
  ]),
  MessageController.getChatOfAdmin
)
MessageRoute.get("/seenMessage/:ChatID",
  authMiddleware([
    Roles.ROLE_ADMIN,
    Roles.ROLE_TEACHER,
    Roles.ROLE_STUDENT,
    Roles.ROLE_STAFF
  ]),
  MessageController.seenMessage
)
MessageRoute.get("/getChatOfUser",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  MessageController.getChatOfUser
)

export default MessageRoute
