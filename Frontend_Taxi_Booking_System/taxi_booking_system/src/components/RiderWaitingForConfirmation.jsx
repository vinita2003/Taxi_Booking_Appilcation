import { useSocket } from "../context/SocketContext"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function RiderWaitingForConfirmation() {
    const {socket} = useSocket()
    const {user} = useAuth()
    const navigate = useNavigate()
useEffect(() => {
    if (!socket) return;
    socket.on("rider:rideAcceptedByDriver", (ride) => {
        console.log(ride);
        navigate("/rider/rideAccepted", {state : ride, replace: true})
    })
return () => {
      socket.off("rider:rideAcceptedByDriver");
    };
}, [socket]);
    const handleCancel = () => {
        console.log(user)
        socket.emit("ride:cancel", {rider : user})
        navigate('/rider/pickupAndDropLocation', {replace: true})
    }

  return (
    <div>
      <h1 className="text-xl font-bold text-center">Waiting For confirmation</h1>
      <p className="text-sm text-center"> We are searching for a driver The usually takes a few seconds</p>
      <p className= "text-xl text-center">Searching...................</p>
       <button onClick={handleCancel} className=" absolute bottom-15 left-4 w-[90%] mt-4  bg-black text-white py-3 rounded-xl shadow-lg hover:bg-gray-400">
          Cancel
        </button>
    </div>
  )
}
