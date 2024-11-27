
export const Roles = {
  ROLE_ADMIN: 1,
  ROLE_STAFF: 2,
  ROLE_TEACHER: 3,
  ROLE_STUDENT: 4,
}

// ------------------------------------
// Tài liệu để group socket id
// https://socket.io/docs/v4/emit-cheatsheet/
//Phòng:https://stackoverflow.com/questions/47352134/socket-io-handle-two-different-user-types

// // Thêm ổ cắm vào phòng
// socket.join('một số phòng');

// // Xóa ổ cắm khỏi phòng
// socket.leave('một số phòng');

// // Gửi tới khách hàng hiện tại
// socket.emit('message', 'đây là bản thử nghiệm');

// // Gửi tới tất cả khách hàng bao gồm người gửi
// io.sockets.emit('message', 'đây là bản thử nghiệm');

// // Gửi tới tất cả khách hàng ngoại trừ người gửi
// socket.broadcast.emit('message', 'đây là bản thử nghiệm');

// // Gửi tới tất cả khách hàng trong phòng (kênh) 'trò chơi' ngoại trừ người gửi
// socket.broadcast.to('game').emit('message', 'đây là bản thử nghiệm');

// // Gửi tới tất cả khách hàng trong phòng (kênh) 'trò chơi' bao gồm người gửi
// io.sockets.in('game').emit('message', 'đây là bản thử nghiệm');

// // Gửi tới id ổ cắm riêng lẻ
// io.sockets.socket(socketId).emit('message', 'đây là bản thử nghiệm');
