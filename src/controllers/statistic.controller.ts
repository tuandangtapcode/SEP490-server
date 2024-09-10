import { Request, Response } from "express"
import StatisticService from "../services/statistic.service"

const statisticTotalUser = async (req: Request, res: Response) => {
  try {
    const response = await StatisticService.fncStatisticTotalUser(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const statisticNewRegisteredUser = async (req: Request, res: Response) => {
  try {
    const response = await StatisticService.fncStatisticNewRegisteredUser(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const statisticBooking = async (req: Request, res: Response) => {
  try {
    const response = await StatisticService.fncStatisticBooking()
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const statisticFinancial = async (req: Request, res: Response) => {
  try {
    const response = await StatisticService.fncStatisticFinancial(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const StatisticController = {
  statisticTotalUser,
  statisticNewRegisteredUser,
  statisticBooking,
  statisticFinancial
}

export default StatisticController
