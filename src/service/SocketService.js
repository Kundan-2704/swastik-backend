class SocketService {
  init(io) {
    io.on("connection", (socket) => {
      socket.on("join", (userId) => {
        console.log("🟢 USER JOINED:", userId);
        socket.join(userId.toString());
      });
    });
  }
}

module.exports = new SocketService();
