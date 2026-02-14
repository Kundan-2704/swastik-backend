class SocketService {
  init(io) {
    io.on("connection", (socket) => {
      socket.on("join", (userId) => {
        socket.join(userId.toString());
      });
    });
  }
}

module.exports = new SocketService();
