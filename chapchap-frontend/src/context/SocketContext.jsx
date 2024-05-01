import { config } from "../config/config";
import { TOKEN_ENUMS } from "../enums/enums";
import socketio from "socket.io-client";
import { createContext, useEffect, useState } from "react";
const getSocket = () => {
  const token = JSON.parse(localStorage.getItem(TOKEN_ENUMS.ACCESSTOKEN));

  return socketio(config.api_url, {
    withCredentials: true,
    auth: { token },
  });
};

export const SocketContext = createContext({ socket: null });
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);
  }, []);
  console.log("SocketInstance from frontend context-", socket);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
