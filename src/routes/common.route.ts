import express from "express"
import CommonController from "../controllers/common.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"

const CommonRoute = express.Router()

// Define model trên swagger
/**
 * @swagger
 * components:
 *  schemas:
 *    SystemKeys:
 *      type: object
 *      required: 
 *        - KeyID
 *        - KeyName
 *      properties:
 *        _id:
 *            type: ObjectId
 *        KeyID: 
 *            type: number
 *        KeyName: 
 *            type: string
 *        Parents: 
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                ParentID:
 *                  type: number
 *                ParentName:
 *                  type: string
 */

/**
 * @swagger
 * /common/getListSystemkey:
 *   get:
 *     tags: [Common]
 *     responses:
 *       200:
 *         description: Lấy ra danh sách thành công
 *       500:
 *        description: Internal server error
 */
CommonRoute.get("/getListSystemkey",
  CommonController.getListSystemKey
)

CommonRoute.get("/getProfitPercent",
  CommonController.getProfitPercent
)

CommonRoute.post("/changeProfitPercent",
  authMiddleware([Roles.ROLE_ADMIN]),
  CommonController.changeProfitPercent
)

export default CommonRoute
