import express from "express"
import BankingInforController from "../controllers/bankinginfor.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"
import BankInforValidation from "../validations/bankinginfor.validation"

const BankingInforRoute = express.Router()

// Define model trên swagger
/**
 * @swagger
 * components:
 *  schemas:
 *    BankingInfors:
 *      type: object
 *      required: 
 *        - UserID
 *        - BankID
 *        - BankName
 *        - BankShortName
 *        - UserBankName
 *        - UserBankAccount
 *      properties:
 *        _id:
 *            type: ObjectId
 *        UserID: 
 *            type: ObjectId
 *        BankID: 
 *            type: Number
 *        UserBankName:
 *            type: string
 *        UserBankAccount:
 *            type: Number
 */

/**
 * @swagger
 * /bankinginfor/createBankingInfor:
 *   post:
 *     tags: [BankingInfors]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               User: "664c1480b8f11adfc4f4a85b"
 *               BankID: 12
 *               UserBankName: "PHAM MINH TUAN"
 *               UserBankAccount: 0123456789
 *     responses:
 *       201:
 *         description: Subject category created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server error
 */
BankingInforRoute.post("/createBankingInfor",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  BankInforValidation.createUpdateBankingInfor,
  BankingInforController.createBankingInfor
)

/**
 * @swagger
 * /bankinginfor/getDetailBankingInfor:
 *   get:
 *     tags: [BankingInfors]
 *     responses:
 *       200:
 *         description: Thông tin banking tồn tại
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
BankingInforRoute.get("/getDetailBankingInfor",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  BankingInforController.getDetailBankingInfor
)

/**
 * @swagger
 * /bankinginfor/getListBankingInfor:
 *   post:
 *     tags: [BankingInfors]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               TextSearch: ""
 *               CurrentPage: 1 
 *               PageSize: 10
 *     responses:
 *       200:
 *         description: Lấy ra thành công
 *       500:
 *         description: Internal server error
 */
BankingInforRoute.post("/getListBankingInfor",
  //authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  BankingInforController.getListBankingInfor
)

/**
 * @swagger
 * /bankinginfor/deleteBankingInfor/{BankingInforID}:
 *   get:
 *     tags: [BankingInfors]
 *     parameters:
 *       - in: path
 *         name: BankingInforID
 *         schema:
 *           type: ObjectId
 *     responses:
 *       200:
 *         description: Xóa thông tin banking thành công
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
BankingInforRoute.get("/deleteBankingInfor/:BankingInforID",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  BankingInforController.deleteBankingInfor
)

/**
 * @swagger
 * /bankinginfor/updateBankingInfor:
 *   post:
 *     tags: [BankingInfors]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *                BankingInforID:
 *                  type: ObjectId
 *                BankID:
 *                  type: number
 *                UserBankName: 
 *                  type: string
 *                UserBankAccount:
 *                  type: number
 *     responses:
 *       200:
 *         description: Cập nhật thông tin Banking thành công
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */
BankingInforRoute.post("/updateBankingInfor",
  authMiddleware([Roles.ROLE_STUDENT, Roles.ROLE_TEACHER]),
  BankInforValidation.createUpdateBankingInfor,
  BankingInforController.updateBankingInfor
)

/**
 * @swagger
 * /bankinginfor/deleteBankingInfor/{BankingInforID}:
 *   get:
 *     tags: [BankingInfors]
 *     parameters:
 *       - in: path
 *         name: BankingInforID
 *         schema:
 *           type: ObjectId
 *     responses:
 *       200:
 *         description: Xóa thông tin banking thành công
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
BankingInforRoute.post("/getBankingInforOfUser",
  authMiddleware([Roles.ROLE_ADMIN]),
  BankInforValidation.getBankingInforOfUser,
  BankingInforController.getBankingInforOfUser
)

export default BankingInforRoute
