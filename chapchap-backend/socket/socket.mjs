import cookie from "cookie";
export const initializeSocketIo = (io) => {
  return io.on("connection", async (socket) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      console.log("cookies obj after connection established-", cookies);
      let token = cookies?.accessToken;
      if (!token) {
        token = socket.handshake.auth?.token;
      }
      console.log(
        "full socketInstance after connection-",
        socket.handshake.auth,
        "socket.id-",
        socket.id
      );
    } catch (error) {
      console.log("socket connection error", error);
    }
  });
};
