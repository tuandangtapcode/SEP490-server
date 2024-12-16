import { Request, Response } from "express"
import StatisticService from "../services/statistic.service"

const statisticTotalUser = async (req: Request, res: Response) => {
  try {
    const response = await StatisticService.fncStatisticTotalUser()
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const statisticNewRegisteredUser = async (req: Request, res: Response) => {
  try {
    const response = await StatisticService.fncStatisticNewRegisteredUser()
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const statisticTotalBooking = async (req: Request, res: Response) => {
  try {
    const response = await StatisticService.fncStatisticTotalBooking()
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

const statisticTopTeacher = async (req: Request, res: Response) => {
  try {
    const response = await StatisticService.fncStatisticTopTeacher()
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const statisticBooking = async (req: Request, res: Response) => {
  try {
    const response = await StatisticService.fncStatisticBooking(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const StatisticController = {
  statisticTotalUser,
  statisticNewRegisteredUser,
  statisticTotalBooking,
  statisticFinancial,
  statisticTopTeacher,
  statisticBooking
}

export default StatisticController
