import { useEffect, useState } from "react"
import profileImage from '../assets/profileImage.png'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RiderProfileComponent() {
  const { user } = useAuth();

    const navigate = useNavigate();
    if(!user) {
        return <h3 className="text-center mt-10">Loading...</h3>
    }

    const handleRideHistory = () => {
      navigate('/rider/rideHistory');
    }
  return (
    <>
    <div className = "flex flex-col mx-auto ">
        <h1 className="text-3xl text-center font-bold">Personal Information</h1>
      <div className="flex flex-col item-center justify-center mx-auto my-3">
        <img src={profileImage} alt="Profile" className="w-36 h-36 rounded-full object-cover" />
        <h2 className="text-2xl font-bold mt-2 mx-auto">{user.name}</h2>
        <p className="text-gray-500 text-sm mx-auto">{new Date(user.createdAt).toDateString()}</p>
      </div>

      <div className="my-5 space-y-4">
        <h1 className="text-2xl font-bold ">Details</h1>
        <div className="flex gap-4 item-center"><span className="bg-gray-300 my-auto text-3xl rounded-sm p-1">📞 </span>
        <p><span className="font-semibold flex ">Contact</span> {user.phone}</p></div>
        <div className="flex gap-4 item-center"><span className="bg-gray-300 my-auto text-3xl rounded-sm p-1">⚧ </span>
        <p><span className="font-semibold flex ">Gender</span> {user.gender}</p></div>
       </div>

      <div>
        <h1 className="text-2xl mb-4 font-bold">Rides</h1>
                <div className="flex  gap-4 item-center"><span className="bg-gray-300 my-auto text-3xl rounded-sm p-1">🕒 </span>
              <button onClick= {handleRideHistory} className=' text-black py-2 rounded-lg text-xl  hover:bg-gray-300 hover:text-white transition p-2'>Ride History</button>
              </div>
      </div>
      </div>
    </>
  )
}
