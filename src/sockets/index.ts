import SocketService, { userOnlines } from "./socket.service"

const socket = (io: any) => {

  io.on("connection", (socket: any) => {

    console.log(`người dùng ${socket.id} đã kết nối`)

    socket.on("add-user-online", SocketService.addUserOnline(socket))

    socket.on('send-notification', SocketService.sendNotification(socket))

    socket.on('send-feedback', SocketService.sendFeedback(io))

    socket.on('send-deactive', SocketService.sendDeactiveAccount(socket))

    socket.on("join-room", SocketService.joinRoom(socket))

    socket.on("leave-room", SocketService.leaveRoom(socket))

    socket.on("send-message", SocketService.sendMessage(socket))

    socket.on("user-logout", SocketService.userLogout())

    socket.on("join-meeting-room", SocketService.joinMeetingRoom(socket))

    socket.on("toggle-handler", SocketService.toggleHandler(io))

    socket.on("inactive-account", SocketService.inactiveAccount(socket))

    socket.on("leave-meeting-room", SocketService.leaveMeetingRoom(socket))

    socket.on("send-message-meeting-room", SocketService.sendMessageMeetingRoom(io))

    socket.on("send-noted-confirm", SocketService.sendNotedConfirm(socket))

    socket.on('disconnect', () => {
      console.log(`người dùng ${socket.id} đã ngắt kết nối`)
      const index = userOnlines.findIndex((i: any) => i.SocketID === socket.id)
      userOnlines.splice(index, 1)
      console.log(userOnlines)
    })
  })

}

export default socket
