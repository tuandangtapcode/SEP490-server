import express from "express"
import PaymentController from "../controllers/payment.controller"
import authMiddleware from '../middlewares/auth.middleware'
import { Roles } from "../utils/lib.js"
import PaymentValidation from "../validations/payment.validation"
import upload from '../middlewares/clouddinary.middleware'

const PaymentRoute = express.Router()

// Define model trên swagger
/**
 * @swagger
 * components:
 *  schemas:
 *    Payments:
 *      type: object
 *      required: 
 *        - Sender
 *        - PaymentType
 *        - TraddingCode
 *        - TotalFee
 *        - Description
 *      properties:
 *        _id:
 *            type: ObjectId
 *        Sender: 
 *            type: ObjectId
 *        Receiver: 
 *            type: ObjectId
 *        PaymentType: 
 *            type: Number
 *        TraddingCode:
 *            type: string
 *        TotalFee:
 *            type: string
 *        Description:
 *            type: string
 *        PaymentTime:
 *            type: Date
 */

/**
 * @swagger
 * /payment/createPayment:
 *   post:
 *     tags: [Payments]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               PaymentType: 1
 *               Description: "string"
 *               Receiver: 664c1480b8f11adfc4f4a85b
 *               TotalFee: 100000
 *               TraddingCode: "123456"
 *     responses:
 *       200:
 *         description: Thêm thành công
 *       500:
 *         description: Internal server error
 */
PaymentRoute.post("/createPayment",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_ADMIN, Roles.ROLE_STAFF, Roles.ROLE_TEACHER]),
  PaymentValidation.createPayment,
  PaymentController.createPayment
)

/**
 * @swagger
 * /payment/getListPaymentHistoryByUser:
 *   post:
 *     tags: [Payments]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               PageSize: 10
 *               CurrentPage: 1
 *               TraddingCode: "12345"
 *               PaymentStatus: 1 
 *     responses:
 *       200:
 *         description: Thêm thành công
 *       500:
 *         description: Internal server error
 */
PaymentRoute.post("/getListPaymentHistoryByUser",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_ADMIN, Roles.ROLE_STAFF, Roles.ROLE_TEACHER]),
  PaymentValidation.getListPaymentHistoryByUser,
  PaymentController.getListPaymentHistoryByUser
)

/**
 * @swagger
 * /payment/changePaymentStatus:
 *   post:
 *     tags: [Payments]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               PaymentID: 
 *                 type: ObjectId
 *               PaymentStatus: 
 *                 type: Number
 *               TotalFee: 
 *                 type: Number
 *               FullName: 
 *                 type: String
 *               Email: 
 *                  type: String
 *               RoleID: 
 *                  type: Number
 *               Image:
 *                  type: string
 *                  format: binary
 *     responses:
 *       200:
 *         description: Thêm thành công
 *       500:
 *         description: Internal server error
 */
PaymentRoute.post("/changePaymentStatus",
  upload('Bill').single('Image'),
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_ADMIN, Roles.ROLE_STAFF, Roles.ROLE_TEACHER]),
  PaymentValidation.changePaymentStatus,
  PaymentController.changePaymentStatus
)

/**
 * @swagger
 * /payment/getListPayment:
 *   post:
 *     tags: [Payments]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               PageSize: 10
 *               CurrentPage: 1
 *               TextSearch: "string"
 *               PaymentStatus: 1
 *               PaymentType: 1
 *     responses:
 *       200:
 *         description: Thêm thành công
 *       500:
 *         description: Internal server error
 */
PaymentRoute.post("/getListPayment",
  authMiddleware([Roles.ROLE_ADMIN]),
  PaymentValidation.getListPayment,
  PaymentController.getListPayment
)

/**
 * @swagger
 * /payment/exportExcel:
 *   post:
 *     tags: [Payments]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               PageSize: 10
 *               CurrentPage: 1
 *     responses:
 *       200:
 *         description: Thêm thành công
 *       500:
 *         description: Internal server error
 */
PaymentRoute.get("/exportExcel",
  authMiddleware([Roles.ROLE_ADMIN]),
  PaymentController.exportExcel
)

/**
 * @swagger
 * /payment/getListTransfer:
 *   post:
 *     tags: [Payments]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               PageSize: 10
 *               CurrentPage: 1
 *               FromDate: "2024-05-19T19:26:10.042+00:00"
 *               ToDate: "2024-05-19T19:26:10.042+00:00"
 *     responses:
 *       200:
 *         description: Thêm thành công
 *       500:
 *         description: Internal server error
 */
PaymentRoute.post("/getListTransfer",
  authMiddleware([Roles.ROLE_ADMIN]),
  // PaymentValidation.getListTransfer,
  PaymentController.getListTransfer
)

/**
 * @swagger
 * /payment/sendRequestExplanation:
 *   post:
 *     tags: [Payments]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               PaymentID: 664c1480b8f11adfc4f4a85b
 *               Email: "abc@gmail.com"
 *               FullName: "string"
 *               Reports: 
 *                - DateAt: "14/07/2024"
 *                  Time: "10:00 - 11:30"
 *                  Title: "string"
 *                  Content: "string"
 *     responses:
 *       200:
 *         description: Thêm thành công
 *       500:
 *         description: Internal server error
 */
PaymentRoute.post("/sendRequestExplanation",
  authMiddleware([Roles.ROLE_ADMIN]),
  PaymentValidation.sendRequestExplanation,
  PaymentController.sendRequestExplanation
)

export default PaymentRoute
