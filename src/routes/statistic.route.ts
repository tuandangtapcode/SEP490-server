import express from "express"
import StatisticController from "../controllers/statistic.controller"
import { Roles } from "../utils/lib.js"
import authMiddleware from "../middlewares/auth.middleware"
import StatisticValidation from "../validations/statistic.validation"

const StatisticRoute = express.Router()

/**
 * @swagger
 * /statistic/statisticTotalUser:
 *   post:
 *     tags: [Statistics]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               FromDate: "2024-05-19T19:26:10.042+00:00"
 *               ToDate: "2024-05-19T19:26:10.042+00:00"
 *     responses:
 *       200:
 *         description: Lấy ra thành công
 *       500:
 *         description: Internal server error
 */
StatisticRoute.post("/statisticTotalUser",
  authMiddleware([Roles.ROLE_ADMIN]),
  StatisticValidation.statisticTotalUser,
  StatisticController.statisticTotalUser
)

/**
 * @swagger
 * /statistic/statisticNewRegisteredUser:
 *   get:
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: Key
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
StatisticRoute.get("/statisticNewRegisteredUser",
  authMiddleware([Roles.ROLE_ADMIN]),
  StatisticValidation.statisticNewRegisteredUser,
  StatisticController.statisticNewRegisteredUser
)

/**
 * @swagger
 * /statistic/statisticBooking:
 *   post:
 *     tags: [Statistics]
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *               FromDate: "2024-05-19T19:26:10.042+00:00"
 *               ToDate: "2024-05-19T19:26:10.042+00:00"
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
StatisticRoute.get("/statisticBooking",
  authMiddleware([Roles.ROLE_ADMIN]),
  StatisticController.statisticBooking
)

/**
 * @swagger
 * /statistic/statisticFinancial:
 *   post:
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
StatisticRoute.post("/statisticFinancial",
  authMiddleware([Roles.ROLE_ADMIN]),
  StatisticController.statisticFinancial
)

export default StatisticRoute
