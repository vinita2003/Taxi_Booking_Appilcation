import  { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet-routing-machine";
import { useNavigate } from "react-router-dom";
// import { socket } from "./RiderPickupAndDropLocationComponent.jsx";
import { useSocket } from "../context/SocketContext.jsx";
import driverIconImg from "../assets/car.png";
import pickupMarkerImg from "../assets/pickup_icon.png"
import dropMarkerImg from "../assets/drop_icon.png"


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


import "leaflet-routing-machine";

function Routing({ pickupLocation, dropLocation }) {
  const map = useMap();  // 👈 correct way to get map instance

  useEffect(() => {
    if (!map || !pickupLocation || !dropLocation) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(pickupLocation[0], pickupLocation[1]),
        L.latLng(dropLocation[0], dropLocation[1]),
      ],
      lineOptions: { styles: [{ color: "blue", weight: 4 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
    }).addTo(map);

    return () => {
      map.removeControl(routingControl); 
    };
  }, [map, pickupLocation, dropLocation]);

  return null;
}


export default function RiderConfirmRideComponent() {
  const location = useLocation();
  const { carTypeAmountDetails } = location.state || {};
  const { user, setUser } = useAuth();
  const { socket } = useSocket();
  const [selectedCar, setSelectedCar] = useState("hatchback");
  const [fareAmount, setFareAmount] = useState(0);
  const navigate = useNavigate()
  const [driversNearby, setDriversNearby] = useState([]);
  const driverIcon = new L.Icon({
  iconUrl: driverIconImg,
  iconSize: [32, 32],   // adjust size as per your image
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});


const pickupIcon = new L.Icon({
  iconUrl: pickupMarkerImg,
  iconSize: [25, 41], // default size
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const dropIcon = new L.Icon({
  iconUrl: dropMarkerImg,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


  useEffect(() => {
    console.log(user, "User is here");
    if (!user || !user.pickupLatLng || !user.dropLatLng || !carTypeAmountDetails) {
      console.log("Redirecting to pickup and drop location");
      navigate('/rider/pickupAndDropLocation' ,{replace: true});
    }
  }, [user, carTypeAmountDetails, navigate]);

  if(!user || !user.pickupLatLng || !user.dropLatLng || !carTypeAmountDetails){
    console.log("Redirecting to pickup and drop location");
     return null;
  }

    useEffect(() => {
    socket.emit("rider:subscribeDrivers", {
      lat: user.pickupLatLng.lat,
      lon: user.pickupLatLng.lon
    });

    socket.on("drivers:nearby", (drivers) => {
      setDriversNearby(drivers);
      console.log("Subscribed to nearby drivers", drivers);

    });
    
    return () => {
      socket.off("drivers:nearby");
    };
  }, []);

   const handleConfirm = () => {
    if (!user.pickup || !user.drop) {
      console.log(user.pickup, user.drop);
    alert("Please select pickup and drop location first.");
    navigate("/rider/pickup-drop-location"); // yahan apna pickup/drop page ka route daalo
    return; // stop further execution
  }
  setUser((prev) => ({ ...prev,  carType : selectedCar}));
  console.log(user)
    socket.emit("ride:request", {

    
      riderData: {
        socketId : socket.id,
        riderId: user._id,
        name: user.name,
         pickup:  user.pickup,
      drop:  user.drop,
       pickupLatLng: user.pickupLatLng,
       dropLatLng: user.dropLatLng,
       carType: selectedCar,
      fareAmount
      
      }
    });
   // alert("Ride request sent! Waiting for driver to accept.");
    navigate('/rider/waitingForRideConfirmation', {replace : true});
  };

  const pickupLocation = [user.pickupLatLng.lat, user.pickupLatLng.lon];
  const dropLocation = [user.dropLatLng.lat, user.dropLatLng.lon];

  
  return (
    <div className="flex flex-col h-[95%]">
      <div className="flex-1 ">
        <MapContainer
          center={pickupLocation}
          zoom={13}
          style={{ height: "90%", width: "100%" }}
        >
        
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          
          <Marker position={pickupLocation} icon={pickupIcon}></Marker>

        
          <Marker position={dropLocation} icon={dropIcon}></Marker>

           {driversNearby.map((driver, index) => (
    <Marker
      key={index}
      position={[driver.lat, driver.lon]}
      icon={driverIcon}
    >
      
    </Marker>
  ))}

          
         {pickupLocation && dropLocation && (
  <Routing pickupLocation={pickupLocation} dropLocation={dropLocation} />
)}
        </MapContainer>
      </div>

      <div className=" p-2 bg-white shadow-lg rounded-t-2xl ">
        <h2 className="text-lg font-semibold mb-3">Choose your Ride</h2>

        <div className="grid gap-3">
          {carTypeAmountDetails?.map((car) => (
            <button
              key={car.carType}
            onClick={() => {
              setSelectedCar(car.carType),
              setFareAmount(car.amount)
            }}

              className={`p-3 flex justify-between rounded-xl border shadow text-center hover:bg-gray-100 ${selectedCar === car.carType ? "border-2 border-black" : "border-gray-300"}`}
            >
              <p className="font-medium">{car.carType}</p>
              <p className="text-sm text-gray-600">₹{car.amount}</p>
            </button>
          ))}
        </div>

        {/* Confirm Button */}
        <button onClick = {handleConfirm} className="w-full mt-4  bg-black text-white py-3 rounded-xl shadow-lg hover:bg-gray-400">
          Confirm Ride
        </button>
      </div>
    </div>
  );
}
