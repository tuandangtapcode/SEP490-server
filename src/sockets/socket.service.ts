import { Roles } from "../utils/constant"
import {
  JoinMeetingRoomDTO,
  LeaveMeetingRoomDTO,
  SendFeedbackDTO,
  SendMessageDTO,
  SendMessageMeetingRoomDTO,
  SendNotificationDTO,
  ToggleHandlerDTO,
} from "./socket.dto"

export let userOnlines = [] as any

const addUserOnline = (socket: any) => {
  return (data: string) => {
    if (!!data) {
      const user = userOnlines.find((i: any) => i.UserID === data)
      if (!user) {
        userOnlines.push({
          UserID: data,
          SocketID: socket.id
        })
      }
      console.log("userOnlines", userOnlines)
    }
  }
}

const sendNotification = (socket: any) => {
  return (data: SendNotificationDTO) => {
    const user = userOnlines.find((i: any) => i.UserID === data.Receiver)
    if (!!user) {
      socket.to(user.SocketID).emit('get-notification', data)
    }
  }
}

const sendFeedback = (io: any) => {
  return (data: SendFeedbackDTO) => {
    io.to(data.RoomID).emit("get-feedback", data)
  }
}

const sendDeactiveAccount = (socket: any) => {
  return (data: String) => {
  }
}

const joinRoom = (socket: any) => {
  return (data: String) => {
    socket.join(data)
  }
}

const leaveRoom = (socket: any) => {
  return (data: String) => {
    socket.leave(data)
  }
}

const sendMessage = (socket: any) => {
  return (data: SendMessageDTO) => {
    const user = userOnlines.find((i: any) => i.UserID === data.Receiver)
    if (!!user) {
      socket.to(user.SocketID).emit("get-message", data)
    }
  }
}

const joinMeetingRoom = (socket: any) => {
  return (data: JoinMeetingRoomDTO) => {
    socket.join(data.RoomID)
    socket.broadcast.to(data.RoomID).emit("user-connected-meeting-room", {
      PeerID: data.PeerID,
      UserID: data.UserID,
      FullName: data.FullName,
      Avatar: data.Avatar,
      IsViewVideo: data.IsViewVideo,
      Muted: data.Muted
    })
  }
}

const toggleHandler = (io: any) => {
  return (data: ToggleHandlerDTO) => {
    io.to(data.RoomID).emit("listen-toggle-handler", data)
  }
}

const leaveMeetingRoom = (socket: any) => {
  return (data: LeaveMeetingRoomDTO) => {
    socket.broadcast.to(data.RoomID).emit("user-leave-meeting-room", data.PeerID)
  }
}

const inactiveAccount = (socket: any) => {
  return (data: String) => {
    const user = userOnlines.find((i: any) => i.UserID === data)
    if (!!user) {
      socket.to(user.SocketID).emit('listen-inactive-account', data)
    }
  }
}

const sendMessageMeetingRoom = (io: any) => {
  return (data: SendMessageMeetingRoomDTO) => {
    io.to(data.RoomID).emit("listen-send-message-meeting-room", data)
  }
}

const sendNotedConfirm = (socket: any) => {
  return (data: any) => {
    const user = userOnlines.find((i: any) => i.UserID ===
      data?.[data.RoleID === Roles.ROLE_TEACHER ? "Sender" : "Receiver"]._id)
    if (!!user) {
      socket.to(user.SocketID).emit('listen-noted-confirm', data)
    }
  }
}

const changeReceiveStatus = (socket: any) => {
  return (data: any) => {
    const user = userOnlines.find((i: any) => i.UserID === data.Receiver)
    if (!!user) {
      socket.to(user.SocketID).emit('listen-change-receive-status', data)
    }
  }
}

const SocketService = {
  addUserOnline,
  sendNotification,
  sendFeedback,
  sendDeactiveAccount,
  joinRoom,
  leaveRoom,
  sendMessage,
  joinMeetingRoom,
  toggleHandler,
  inactiveAccount,
  leaveMeetingRoom,
  sendMessageMeetingRoom,
  sendNotedConfirm,
  changeReceiveStatus
}

export default SocketService
