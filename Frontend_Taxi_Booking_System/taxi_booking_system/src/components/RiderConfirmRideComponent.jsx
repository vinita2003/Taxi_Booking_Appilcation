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


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
function Routing({ pickupLocation, dropLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(pickupLocation[0], pickupLocation[1]),
        L.latLng(dropLocation[0], dropLocation[1]),
      ],
      lineOptions: {
        styles: [{ color: "black", weight: 5 }],
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false, // hides the default control box
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, pickupLocation, dropLocation]);

  return null;
}
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function RiderConfirmRideComponent() {
  const location = useLocation();
  const { carTypeAmountDetails } = location.state || {};
  const { user } = useAuth();
  const [selectedCar, setSelectedCar] = useState("hatchback");
  const navigate = useNavigate()


  useEffect(() => {
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
      lat: pickup.lat,
      lon: pickup.lon
    });

    socket.on("drivers:nearby", (drivers) => {
      setDriversNearby(drivers);
    });

    return () => {
      socket.off("drivers:nearby");
    };
  }, [pickup]);



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

          
          <Marker position={pickupLocation} icon= {greenIcon}></Marker>

        
          <Marker position={dropLocation} icon={redIcon}></Marker>

          
          <Routing pickupLocation={pickupLocation} dropLocation={dropLocation} />
        </MapContainer>
      </div>

      <div className=" p-2 bg-white shadow-lg rounded-t-2xl ">
        <h2 className="text-lg font-semibold mb-3">Choose your Ride</h2>

        <div className="grid gap-3">
          {carTypeAmountDetails?.map((car) => (
            <button
              key={car.carType}
            onClick={() => setSelectedCar(car.carType)}

              className={`p-3 flex justify-between rounded-xl border shadow text-center hover:bg-gray-100 ${selectedCar === car.carType ? "border-2 border-black" : "border-gray-300"}`}
            >
              <p className="font-medium">{car.carType}</p>
              <p className="text-sm text-gray-600">₹{car.amount}</p>
            </button>
          ))}
        </div>

        {/* Confirm Button */}
        <button className="w-full mt-4  bg-black text-white py-3 rounded-xl shadow-lg hover:bg-gray-400">
          Confirm Ride
        </button>
      </div>
    </div>
  );
}
