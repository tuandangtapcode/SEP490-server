import express from "express"
import SystemKeyController from "../controllers/systemkey.controller"

const SystemKeyRoute = express.Router()

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
 * /systemkey/getListSystemkey:
 *   get:
 *     tags: [SystemKeys]
 *     security:
 *        - Authorization: []
 *     responses:
 *       200:
 *         description: Lấy ra danh sách thành công
 *       500:
 *        description: Internal server error
 */
SystemKeyRoute.get("/getListSystemkey",
  SystemKeyController.getListSystemKey
)

export default SystemKeyRoute
