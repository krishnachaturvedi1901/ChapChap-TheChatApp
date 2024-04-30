import cookie from "cookie";
export const initializeSocketIo = (io) => {
  return io.on("connection", async (socket) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      console.log("cookies obj after connection established-", cookies);
    } catch (error) {}
  });
};
