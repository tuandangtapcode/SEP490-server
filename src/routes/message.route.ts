import express from "express"
import MessageController from "../controllers/message.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import MessageValidation from "../validations/message.validation"
import { parameterValidation } from "../validations/common.validation"

const MessageRoute = express.Router()

MessageRoute.post("/createMessage",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_ADMIN, Roles.ROLE_TEACHER]),
  MessageValidation.createMessage,
  MessageController.createMessage
)
MessageRoute.post("/getMessageByChat",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_ADMIN, Roles.ROLE_TEACHER]),
  MessageController.getMessageByChat
)
MessageRoute.post("/getChatWithUser",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_ADMIN, Roles.ROLE_TEACHER]),
  MessageController.getChatWithUser
)
MessageRoute.get("/getChatOfAdmin",
  authMiddleware([Roles.ROLE_ADMIN]),
  MessageController.getChatOfAdmin
)
MessageRoute.get("/seenMessage/:ChatID",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_ADMIN, Roles.ROLE_TEACHER]),
  MessageController.seenMessage
)
MessageRoute.get("/getChatOfUser",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  MessageController.getChatOfUser
)

export default MessageRoute
