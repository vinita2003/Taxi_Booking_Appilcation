import React, {createContext, useContext, useEffect, useState} from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children}) => {
    const [socket, setSocket] = useState(null);

    // const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      autoConnect: true,
      reconnection: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    //   setSocketId(newSocket.id);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    //   setSocketId(null);
    });

    setSocket(newSocket);

    return () => {
        newSocket.off("connect")
        newSocket.off("disconnect");
      newSocket.disconnect();
    };
  }, []);



    return (
        <SocketContext.Provider value= {{socket}}>
            {children}
        </SocketContext.Provider>
    );
}