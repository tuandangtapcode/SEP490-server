import express from "express"
import AccountController from "../controllers/account.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import AccountValidation from "../validations/account.validation"

const AccountRoute = express.Router()

// Define model trên swagger
/**
 * @swagger
 * components:
 *  schemas:
 *    Accounts:
 *      type: object
 *      required: 
 *        - UserID
 *        - AdminID
 *        - Email
 *        - Password
 *      properties:
 *        _id:
 *            type: ObjectId
 *        UserID: 
 *            type: ObjectId
 *        AdminID: 
 *            type: ObjectId
 *        Email:
 *            type: string
 *        Password:
 *            type: string
 *        IsActive:
 *            type: boolean
 */

/**
 *  @swagger
 *  /account/register:
 *    post:
 *      tags: [Accounts]
 *      requestBody:
 *        content:
 *          application/json:
 *              example:
 *                FullName: Nguyen Van An
 *                Email: abc@gmail.com
 *                RoleID: 1
 *      responses:
 *        200:
 *          description: Tài khoản đăng ký thành công
 *        500:
 *           description: Internal server error
 */
AccountRoute.post("/register",
  AccountValidation.register,
  AccountController.register
)

/**
 *  @swagger
 *  /account/login:
 *    post:
 *      tags: [Accounts]
 *      requestBody:
 *        content:
 *          application/json:
 *              example:
 *                Email: abc@gmail.com
 *                Password: "12345"
 *      responses:
 *        200:
 *          description: đăng nhập thành công
 *        500:
 *           description: internal server error
 */
AccountRoute.post("/login",
  AccountController.login
)

/**
 *  @swagger
 *  /account/loginByGoogle:
 *    post:
 *      tags: [Accounts]
 *      requestBody:
 *        content:
 *          application/json:
 *              example:
 *                email: abc@gmail.com
 *      responses:
 *        200:
 *          description: đăng nhập thành công
 *        500:
 *           description: internal server error
 */
AccountRoute.post("/loginByGoogle",
  AccountController.loginByGoogle
)

/**
 *  @swagger
 *  /account/logout:
 *    get:
 *      tags: [Accounts]
 *      responses:
 *        200:
 *          description: đăng xuất thành công
 *        500:
 *           description: internal server error
 */
AccountRoute.get("/logout",
  AccountController.logout
)

/**
 *  @swagger
 *  /account/changePassword:
 *    post:
 *      tags: [Accounts]
 *      requestBody:
 *        content:
 *          application/json:
 *              example:
 *                OldPassword: "string"
 *                NewPassword: "string"
 *      responses:
 *        200:
 *          description: đăng nhập thành công
 *        500:
 *           description: internal server error
 */
AccountRoute.post("/changePassword",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  AccountValidation.changePassword,
  AccountController.changePassword
)

export default AccountRoute
