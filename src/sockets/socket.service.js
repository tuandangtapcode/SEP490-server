export let userOnlines = []

const addUserOnline = (socket) => {
  return data => {
    if (!!data) {
      const user = userOnlines.find(i => i.UserID === data)
      if (!user) {
        userOnlines.push({
          UserID: data,
          SocketID: socket.id
        })
      }
      console.log("userOnlines", userOnlines);
    }
  }
}

const sendNotification = (socket) => {
  return data => {
    const user = userOnlines.find(i => i.UserID === data.Receiver)
    if (!!user) {
      socket.to(user.SocketID).emit('get-notification', data)
    }
  }
}

const sendComment = (io) => {
  return data => {
    io.to(data.RoomID).emit("get-comment", data)
  }
}

const sendDeactiveAccount = (socket) => {
  return data => {
    // io.sockets.emit('get-deactive', data)
  }
}

const joinRoom = (socket) => {
  return data => {
    socket.join(data)
  }
}

const leaveRoom = (socket) => {
  return data => {
    socket.leave(data)
  }
}

const sendMessage = (socket) => {
  return data => {
    const user = userOnlines.find(i => i.UserID === data.Receiver)
    if (!!user) {
      socket.to(user.SocketID).emit("get-message", data)
    }
  }
}

const userLogout = () => {
  return data => {
    const index = userOnlines.findIndex(i => i.UserID === data)
    userOnlines.splice(index, 1)
  }
}

const joinMeetingRoom = (socket) => {
  return data => {
    socket.join(data.RoomID)
    socket.broadcast.to(data.RoomID).emit("user-connected-meeting-room", {
      PeerID: data.PeerID,
      Stream: data.Stream,
      UserID: data.UserID,
      FullName: data.FullName,
      Avatar: data.Avatar,
      IsViewVideo: data.IsViewVideo,
      Muted: data.Muted
    })
  }
}

const toggleHandler = (io) => {
  return data => {
    io.to(data.RoomID).emit("listen-toggle-handler", data)
  }
}

const leaveMeetingRoom = (socket) => {
  return data => {
    socket.broadcast.to(data.RoomID).emit("user-leave-meeting-room", data.PeerID)
  }
}

const inactiveAccount = (socket) => {
  return data => {
    const user = userOnlines.find(i => i.UserID === data)
    if (!!user) {
      socket.to(user.SocketID).emit('listen-inactive-account', data)
    }
  }
}

const sendMessageMeetingRoom = (io) => {
  return data => {
    io.to(data.RoomID).emit("listen-send-message-meeting-room", data)
  }
}

const SocketService = {
  addUserOnline,
  sendNotification,
  sendComment,
  sendDeactiveAccount,
  joinRoom,
  leaveRoom,
  sendMessage,
  userLogout,
  joinMeetingRoom,
  toggleHandler,
  inactiveAccount,
  leaveMeetingRoom,
  sendMessageMeetingRoom
}

export default SocketService
