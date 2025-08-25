import { Link } from "react-router-dom"
import { FaHome, FaUser, FaWallet } from "react-icons/fa"

export default function FooterComponent({role}) {
  return (
    
    <div className= "absolute bottom-0 left-0 w-full bg-white shadow-md border-t rounded-b-2xl py-2">
        <div className="flex justify-around item-center text-gray-700">
            <Link to="/driver/dashboard" className="flex flex-col items-center">
                <FaHome className="text-2xl" />
                <span className="text-xs">Home</span>
            </Link>
            <Link to="/driver/profile" className="flex flex-col items-center">
                <FaUser className="text-2xl" />
                <span className="text-xs">Profile</span>
            </Link>
            <Link to="/driver/account" className="flex flex-col items-center">
                <FaWallet className="text-2xl" />
                <span className="text-xs">Account</span>
            </Link>
        </div>
      </div>
    
  )
}
