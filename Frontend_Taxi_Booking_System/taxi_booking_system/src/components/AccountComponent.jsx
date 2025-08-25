import { useState, useEffect } from 'react';
import profileImage from '../assets/profileImage.png'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';


export default function AccountComponent() {
    // const [user, setUser] = useState({name: 'vinita shah', rating: 4.5});
    const { user} = useAuth();
    const navigate = useNavigate();
        if(!user) {
            return <h3 className="text-center mt-10">Loading...</h3>
        }
        const handleLogout = async() => {
             try {
                    // const response = await fetch(`http://localhost:3000/${user.role}/logout`, {
                    //     method: 'GET',
                    //     credentials: 'include',
                    // });
                    // if (!response.ok) {
                    //     throw new Error('Network response was not ok');
                    // }
                                        navigate(`/${user.role}/login`);
                    
                    const response = await api.get(`/${user.role}/logout`, { withCredentials: true });
                    console.log(response.data);

                  
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
        }
  return (
    <div className = "flex  flex-col  mx-auto p-1">
      <h1 className="text-3xl text-center font-bold">Account</h1>
       <div className="flex item-centergap-2 my-6 -ml-3">
              <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
              <div>
              <h2 className="text-xl font-bold mt-6">{user.name}</h2>
              <p className="text-gray-500 text-sm ">{user.rating} 4.3</p>
              </div>
            </div>

        <div className=" space-y-4">
        <h1 className="text-2xl font-bold ">App Settings</h1>
        <div className="flex gap-4 item-center"><span className="bg-gray-300 my-auto text-3xl rounded-sm p-1">🔔 </span>
        <span className="font-semibold flex my-auto">Notififcation</span></div>
        <div className="flex gap-4 justify-items-center-safe"><span className="bg-gray-300 my-auto text-3xl rounded-sm p-1">🌐 </span>
        <span className="font-semibold flex my-auto">Language</span></div>
       </div>

        <div className=" my-8 space-y-4">
        <h1 className="text-2xl font-bold ">Support</h1>
        <div className="flex gap-4 item-center"><span className="bg-gray-300 my-auto text-3xl rounded-sm p-1">💬</span>
        <span className="font-semibold flex my-auto">Help</span></div>
        <div className="flex gap-4 item-center"><span className="bg-gray-300 my-auto text-3xl rounded-sm p-1">⚖️</span>
        <span className="font-semibold flex my-auto ">Legal</span></div>
       </div>
         <button onClick={handleLogout} className=' absolute bottom-15 left-5 w-[90%] bg-gray-200 text-black py-2 rounded-lg text-md font-extrabold hover:bg-black hover:text-white transition'>Logout</button>

    </div>
  )
}
