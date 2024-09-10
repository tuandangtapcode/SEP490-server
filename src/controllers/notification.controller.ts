import { Request, Response } from "express"
import NotificationService from "../services/notification.service"

const createNotification = async (req: Request, res: Response) => {
  try {
    const response = await NotificationService.fncCreateNotification(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const changeStatusNotification = async (req: Request, res: Response) => {
  try {
    const response = await NotificationService.fncChangeStatusNotification(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListNotification = async (req: Request, res: Response) => {
  try {
    const response = await NotificationService.fncGetListNotification(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const seenNotification = async (req: Request, res: Response) => {
  try {
    const response = await NotificationService.fncSeenNotification(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const NotificationController = {
  createNotification,
  changeStatusNotification,
  getListNotification,
  seenNotification
}

export default NotificationController
