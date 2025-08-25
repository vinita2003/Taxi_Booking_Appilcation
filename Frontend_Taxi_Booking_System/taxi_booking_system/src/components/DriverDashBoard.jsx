import profileImage from '../assets/ProfileImage.png'
import { useAuth } from '../context/AuthContext.jsx'
import { use, useEffect, useState } from "react";

import io from "socket.io-client";



export default function DriverDashBoard() {
    const { user } = useAuth()
     const [isOn, setIsOn] = useState(JSON.parse(localStorage.getItem("driverOnline")) || false);
     const[location, setLocation] = useState({lat: 0, lon: 0});
        const [socket, setSocket] = useState(null);

        useEffect(() => {
    let watchId;
    let newSocket;

    if (isOn) {
        localStorage.setItem("driverOnline", true);
      // ✅ connect socket only when driver is ON
      newSocket = io("http://localhost:3000"); // replace with your server URL
      setSocket(newSocket);

      // handle socket connection
      newSocket.on("connect", () => {
        console.log("Connected to server");
        newSocket.emit("driver:online", { driverId: user._id });
      });

      // watch driver location
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          newSocket.emit("driver:updateLocation", {
            driverId: user._id,
            lat: latitude,
            lon: longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );

      // listen for rides
      newSocket.on("ride:request", (rideData) => {
        alert(`New ride request from ${rideData}`);
      });
    } else {
        localStorage.setItem("driverOnline", false);
      // ✅ if turned OFF, tell server driver is offline
      if (socket) {
        socket.on("disconnect", () => {
  console.log("Socket disconnected:");
})
        socket.emit("driver:offline", { driverId: user._id });
        socket.disconnect();
; // close socket
        setSocket(null);
      }

      // stop location tracking
      if (watchId) navigator.geolocation.clearWatch(watchId);
      setLocation({ lat: 0, lon: 0 });
    }

    // cleanup on toggle change or unmount
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (newSocket) {
        newSocket.on("disconnect", () => {
  console.log("Socket disconnected:");
});
      }
    };
  }, [isOn, user._id]);


    

  return (
    <div>
      <h1 className='text-2xl font-bold text-center'>DashBoard</h1>
      <div className='flex justify-between'>
       <div className="flex item-centergap-2 my-6 -ml-3">
                    <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                    <div>
                    <h2 className="text-xl font-light mt-6">{user.name}</h2>
                    <p className="text-gray-500 text-sm ">{user.rating} 4.3</p>
                    </div>
                  </div>
    <button
      onClick={() => setIsOn(!isOn)}
      className={`w-14 h-8 mt-14 flex items-center rounded-full p-1 transition-colors ${
        isOn ? "bg-green-500" : "bg-gray-400"
      }`}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
          isOn ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
     </div>
     <h1 className= "text-2xl font-bold ">Live Ride Requests</h1>
    </div>
  )
}
