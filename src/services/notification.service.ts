import { Request } from "express"
import Notification from "../models/notification"
import response from "../utils/response"
import {
  CreateNotificationDTO,
  SeenNotificationDTO
} from "../dtos/notification.dto"

const fncCreateNotification = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const notification = await Notification.create({
      ...req.body as CreateNotificationDTO,
      Sender: UserID
    })
    return response(notification, false, "Thêm mới thành công", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangeStatusNotification = async (req: Request) => {
  try {
    const ReceiverID = req.params.ReceiverID
    const notification = await Notification.updateMany(
      { IsNew: true, Receiver: ReceiverID },
      { IsNew: false }
    )
    return response(notification, false, "Change", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListNotification = async (req: Request) => {
  try {
    const ReceiverID = req.params.ReceiverID
    const notifications = await Notification
      .find({
        Receiver: ReceiverID
      })
      .populate('Sender', ['_id', 'FullName', 'RoleID'])
      .sort({
        createdAt: -1
      })
      .limit(5)
    const notificationsNew = notifications.filter(i => !!i.IsNew)
    return response(
      { List: notifications, IsNew: notificationsNew.length },
      false,
      "Lấy data thành công",
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncSeenNotification = async (req: Request) => {
  try {
    const { ReceiverID, NotificationID } = req.body as SeenNotificationDTO
    const updateNotification = await Notification.findOneAndUpdate(
      {
        _id: NotificationID,
        Receiver: ReceiverID,
      },
      {
        IsSeen: true
      }
    )
    if (!updateNotification) return response({}, true, "Có lỗi xảy ra", 200)
    return response({}, false, "Seen", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const NotificationService = {
  fncCreateNotification,
  fncChangeStatusNotification,
  fncGetListNotification,
  fncSeenNotification
}

export default NotificationService
