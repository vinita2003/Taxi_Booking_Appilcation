import profileImage from '../assets/ProfileImage.png'
import { useAuth } from "../context/AuthContext";

export default function DriverProfileComponent() {
    const { user } = useAuth();
        
    
        if(!user) {
            return <h3 className="text-center mt-10">Loading...</h3>
        }
  return (
    <div className = "flex flex-col p-3">
       <h1 className="text-3xl text-center font-bold">Profile</h1>
            <div className="flex flex-col item-center justify-center mx-auto my-3">
              <img src={profileImage} alt="Profile" className="w-36 h-36 rounded-full object-cover" />
              <h2 className="text-2xl font-bold mt-2 mx-auto">{user.name}</h2>
              <p className="text-gray-500 text-sm mx-auto">{new Date(user.createdAt).toDateString()}</p>
            </div>

            <div className="my-3 space-y-4">
        <h1 className="text-2xl font-bold ">Personal Info</h1>
        <div className="flex gap-4 item-center"><span className="bg-gray-300 my-auto text-3xl rounded-sm p-1">📞 </span>
        <p><span className="font-semibold flex ">Contact</span> {user.phone}</p></div>
        <div className="flex gap-4 item-center"><span className="bg-gray-300 my-auto text-3xl rounded-sm p-1">⚧ </span>
        <p><span className="font-semibold flex ">Gender</span> {user.gender}</p></div>
        <div className="flex gap-4 item-center"><span className="bg-gray-300 my-auto text-3xl rounded-sm p-1">⚧ </span>
        <p><span className="font-semibold flex ">Aadhar Card Number</span> {user.aadharCardNumber}</p></div>
       </div>
       
       <div className="my-3 space-y-4">
        <h1 className="text-2xl font-bold ">Vehicle</h1>
        <div className="flex gap-4 item-center"><span className="bg-gray-300 my-auto text-3xl rounded-sm p-1">📞 </span>
        <p><span className="font-semibold flex ">Car</span> {user.carType}</p></div>
        <div className="flex gap-4 item-center"><span className="bg-gray-300 my-auto text-3xl rounded-sm p-1">⚧ </span>
        <p><span className="font-semibold flex ">Car Number</span> {user.carNumber}</p></div>
        <div className="flex gap-4 item-center"><span className="bg-gray-300 my-auto text-3xl rounded-sm p-1">⚧ </span>
        <p><span className="font-semibold flex ">Driving License Number</span> {user.licenseCardNumber}</p></div>
       </div>

      <div>
        <h1 className="text-2xl font-bold mt-3">Statistics</h1>
       <div className="flex  gap-3">
       <div className="flex  flex-col gap-2 mt-5 border-2 border-gray-300 rounded-2xl p-4">
        <h1 className="text-2xl">Total Rides</h1>
        <p className="text-xl">567</p>
       </div>

        <div className="flex flex-col gap-2 mt-5 border-2 border-gray-300 rounded-2xl p-4 pr-10">
        <h1 className="text-2xl">Earnings</h1>
        <p className="text-xl">12,345</p>
       </div>
       </div>
       <div className="flex flex-col gap-2 mt-5 mb-10 border-2 border-gray-300 rounded-2xl p-4 ">
        <h1 className="text-2xl">Distance</h1>
        <p className="text-xl">10,000 KM</p>
       </div>
       </div>
    </div>
  )
}
