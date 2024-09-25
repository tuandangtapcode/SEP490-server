import express from "express"
import UserController from "../controllers/user.controller"
import authMiddleware from "../middlewares/auth.middleware"
import upload from '../middlewares/clouddinary.middleware'
import { Roles } from "../utils/constant"
import UserValidation from "../validations/user.validation"

const UserRoute = express.Router()

// Define model trên swagger
/**
 * @swagger
 * components:
 *  schemas:
 *    Users:
 *      type: object
 *      required: 
 *        - FullName
 *        - RoleID
 *        - IsByGoogle
 *      properties:
 *        _id:
 *            type: ObjectId
 *        FullName: 
 *            type: string
 *        Phone:
 *            type: string
 *        AvatarPath: 
 *            type: string
 *        RoleID:
 *            type: number
 *        Subject: 
 *            type: array
 *            items: 
 *              type: ObjectId
 *        Quotes: 
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                  SubjectID:
 *                    type: ObjectId
 *                  Title: 
 *                    type: string
 *                  Content: 
 *                    type: string  
 *                  Levels:
 *                    type: array
 *                    items: 
 *                      type: Number
 *        Schedules: 
 *              type: array
 *              items: 
 *                type: object
 *                properties:
 *                  DateAt:
 *                    type: string
 *                  StartTime:
 *                    type: Date
 *                  EndTime:
 *                    type: Date
 *        Description: 
 *              type: string     
 *        Experiences: 
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                  Title: 
 *                    type: string
 *                  Content: 
 *                    type: string   
 *                  StartDate:
 *                    type: string
 *                  EndDate:
 *                    type: string  
 *        Educations: 
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                  Title: 
 *                    type: string
 *                  Content: 
 *                    type: string   
 *                  StartDate:
 *                    type: string
 *                  EndDate:
 *                    type: string  
 *        IntroductVideos: 
 *            type: array
 *            items: 
 *              type: object
 *              properties:
 *                 Title: 
 *                   type: string
 *                 VideoPath: 
 *                   type: string     
 *        Votes: 
 *          type: array
 *          items:
 *            type: number
 *        IsByGoogle: 
 *          type: Boolean
 *        RegisterStatus: 
 *          type: number
 *        IsActive: 
 *          type: Boolean
 *        LearnTypes: 
 *          type: array
 *          items:
 *            type: number
 */

/**
 * @swagger
 * /user/getDetailProfile:
 *   get:
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Get thành công
 *       500:
 *        description: Internal server error
 */
UserRoute.get("/getDetailProfile",
  authMiddleware([
    Roles.ROLE_ADMIN,
    Roles.ROLE_STAFF_USER,
    Roles.ROLE_STAFF_SUBJECT,
    Roles.ROLE_STAFF_INBOX,
    Roles.ROLE_TEACHER,
    Roles.ROLE_STUDENT,
  ]),
  UserController.getDetailProfile
)

/**
 * @swagger
 * /user/changeProfile:
 *   post:
 *     tags: [Users]
 *     requestBody:
 *        content:
 *          application/json:
 *              example:
 *                Email: abc@gmail.com
 *                Password: "12345"
 *     responses:
 *       200:
 *         description: Sửa thành công
 *       500:
 *        description: Internal server error
 */
UserRoute.post("/changeProfile",
  authMiddleware([Roles.ROLE_TEACHER, Roles.ROLE_STUDENT]),
  UserController.changeProfile
)

/**
 * @swagger
 * /user/requestConfirmRegister:
 *   get:
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Gửi thành công
 *       500:
 *        description: Internal server error
 */
UserRoute.get("/requestConfirmRegister",
  authMiddleware([Roles.ROLE_TEACHER]),
  UserController.requestConfirmRegister
)

/**
 *  @swagger
 *  /user/responseConfirmRegister:
 *    post:
 *      tags: [Users]
 *      requestBody:
 *        content:
 *          application/json:
 *              example:
 *                TeacherID: 664c1480b8f11adfc4f4a85b
 *                RegisterStatus: 1
 *                FullName: "Nguyen Van An"
 *      responses:
 *        200:
 *          description: Phản hồi thành công
 *        500:
 *           description: internal server error
 */
UserRoute.post("/responseConfirmRegister",
  authMiddleware([Roles.ROLE_ADMIN,]),
  UserValidation.responseConfirmRegister,
  UserController.responseConfirmRegister
)

/**
 * @swagger
 * /user/pushOrPullSubjectForTeacher:
 *   post:
 *     tags: [Users]
 *     requestBody:
 *        content:
 *          application/json:
 *              example:
 *                SubjectID: 664c1480b8f11adfc4f4a85b
 *                Email: "abc@gmail.com"
 *     responses:
 *       200:
 *         description: Thêm môn học thành công
 *       500:
 *        description: Internal server error
 */
UserRoute.post("/pushOrPullSubjectForTeacher",
  authMiddleware([Roles.ROLE_TEACHER]),
  UserValidation.pushOrPullSubjectForTeacher,
  UserController.pushOrPullSubjectForTeacher
)

/**
 *  @swagger
 *  /user/getListTeacher:
 *    post:
 *      tags: [Users]
 *      requestBody:
 *        content:
 *          application/json:
 *              example:
 *                TextSearch: "string"
 *                SubjectID: 664c1480b8f11adfc4f4a85b
 *                CurrentPage: 1 
 *                PageSize: 10
 *                Level: [1,2,3]
 *                RegisterStatus: 1
 *      responses:
 *        200:
 *          description: Phản hồi thành công
 *        500:
 *           description: internal server error
 */
UserRoute.post("/getListTeacher",
  authMiddleware([Roles.ROLE_ADMIN]),
  UserValidation.getListTeacher,
  UserController.getListTeacher
)

/**
 *  @swagger
 *  /user/getListTeacherByUser:
 *    post:
 *      tags: [Users]
 *      requestBody:
 *        content:
 *          application/json:
 *              example:
 *                TextSearch: "string"
 *                SubjectID: 664c1480b8f11adfc4f4a85b
 *                CurrentPage: 1 
 *                PageSize: 10
 *                Level: [1,2,3]
 *                FromPrice: "0"
 *                ToPrice: "200"
 *                LearnType: [1, 2]
 *      responses:
 *        200:
 *          description: Phản hồi thành công
 *        500:
 *           description: internal server error
 */
UserRoute.post("/getListTeacherByUser",
  UserValidation.getListTeacherByUser,
  UserController.getListTeacherByUser
)

/**
 *  @swagger
 *  /user/getDetailTeacher:
 *    post:
 *      tags: [Users]
 *      requestBody:
 *        content:
 *          application/json:
 *              example:
 *                SubjectID: 664c1480b8f11adfc4f4a85b
 *                TeacherID: 664c1480b8f11adfc4f4a85b
 *      responses:
 *        200:
 *          description: Phản hồi thành công
 *        500:
 *           description: internal server error
 */
UserRoute.post("/getDetailTeacher",
  UserValidation.getDetailTeacher,
  UserController.getDetailTeacher
)

/**
 *  @swagger
 *  /user/getListStudent:
 *    post:
 *      tags: [Users]
 *      requestBody:
 *        content:
 *          application/json:
 *              example:
 *                TextSearch: "string"
 *                CurrentPage: 1 
 *                PageSize: 10
 *                SortByBookQuantity: 1
 *      responses:
 *        200:
 *          description: Phản hồi thành công
 *        500:
 *           description: internal server error
 */
UserRoute.post("/getListStudent",
  authMiddleware([Roles.ROLE_ADMIN]),
  UserValidation.getListStudent,
  UserController.getListStudent
)

/**
 * @swagger
 * /user/inactiveAccount/{UserID}:
 *   get:
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: UserID
 *         schema:
 *           type: ObjectId
 *         description: ID của tài khoản người dùng
 *     responses:
 *       200:
 *         description: Thêm môn học thành công
 *       500:
 *        description: Internal server error
 */
UserRoute.post("/inactiveOrActiveAccount",
  authMiddleware([Roles.ROLE_ADMIN]),
  UserValidation.inactiveOrActiveAccount,
  UserController.inactiveOrActiveAccount
)

export default UserRoute
