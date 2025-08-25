import { useEffect, useState } from "react"
import api from "../api/client";

export default function RiderRideHistoryComponent() {
    const [totalRides, setTotalRides] = useState([]);
        useEffect(() => {
            const fetchUserData = async () => {
                try {
              const response = await api.get('/rider/riderDetails/getRiderRideHistory', { withCredentials: true });
              console.log(response.data)
              setTotalRides(response.data)
              
            } catch (error) {
                console.error("Authentication check failed:", error);
                setUser(null);
            } 
                   
                } 
            
            fetchUserData();
        }, [])
    
        // if(!user) {
        //     return <h3 className="text-center mt-10">Loading...</h3>
        // }
  return (
    <h1>ride history</h1>
    //   totalRides.map((ride, index) => {
    //     <div key={index} className="ride-history-item">
    //         {ride}
    //       </div>   
    //     },
    )
   
  
}
