import profileImage from '../assets/ProfileImage.png'
import { useAuth } from '../context/AuthContext.jsx'
import {  useEffect, useState } from "react";
import { useSocket } from '../context/SocketContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function DriverDashBoard() {
    const { user } = useAuth()
     const [isOn, setIsOn] = useState(JSON.parse(localStorage.getItem("driverOnline")) || false);
     const[location, setLocation] = useState({lat: 0, lon: 0});
      const [rideRequests, setRideRequests] = useState([]);

   const { socket } = useSocket();
   const navigate = useNavigate();


// useEffect(() => {
//   console.log
//   if (!socket) return;
//    console.log(socket.id)
//    console.log(socketId);
//   const handleConnect = () => {
//     setSocketId(socket.id); 
//   };


//   socket.on("connect", handleConnect);

//   return () => {
//     socket.off("connect", handleConnect);
//   };
// }, [socket]);

useEffect(() => {
  if (!socket || !user?._id) return;
// console.log(socketId)
  let watchId;
  console.log(user);

  if (isOn) {
    localStorage.setItem("driverOnline", true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("driver:online", {
          driverId: user._id,
          driverCarType: user.carType,
          lat: latitude,
          lon: longitude,
        });
      },
      (error) => console.error("Error getting current location:", error),
      { enableHighAccuracy: true }
    );

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        socket.emit("driver:updateLocation", {
          driverId: user._id,
          lat: latitude,
          lon: longitude,
        });
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    socket.on("ride:new", (rideData) => {
      console.log(rideData)
      
      setRideRequests((prev) => [...prev, rideData]);
    });

   socket.on("ride:cancelled", ({ riderId }) => {
        console.log("Ride Cancelled by rider:", riderId);
        setRideRequests((prev) => {
          const updated = prev.filter((ride) => ride.riderData.riderId !== riderId);
          console.log("Updated rideRequests after cancel:", updated);
          return updated;
        });
      });
  } else {
    localStorage.setItem("driverOnline", false);
    socket.emit("driver:offline", { driverId: user._id });
    socket.off("ride:new");
    if (watchId) navigator.geolocation.clearWatch(watchId);
    setLocation({ lat: 0, lon: 0 });
  }

  return () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    socket.off("ride:new");
  };
}, [isOn, user?._id, socket]);


useEffect(() => {
    console.log("RideRequests updated:", rideRequests);
  }, [rideRequests]);


    const handleAccept = (ride) => {
      socket.emit("driver:rideAccepted", {ride})
      navigate('/driver/rideAccepted', { state: ride })
    }

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
     
     {rideRequests.length === 0 ? (
        <p className='text-gray-500'>No ride request yet.</p>
     ): (
        <div className='space-y-1 max-h-112 overflow-y-auto'>
          {rideRequests.map((ride, index) => (
           
                <div key= {index}
                className=' p-4 rounded-lg shadow-md bg-white'>
                  <p><strong>Pickup:</strong> {ride.riderData.pickup}</p>
                  <p><strong>Drop:</strong> {ride.riderData.drop}</p>
                  <p><strong>Fare:</strong> {ride.riderData.fareAmount}</p>
                  <div className='mt-2 flex gap-2'>
                    <button onClick= {() => handleAccept(ride)} className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600'>
                      Accept
                    </button>
                    
                  </div>

                </div>
              ))}
        </div>
     )}
    </div>
  )
}
