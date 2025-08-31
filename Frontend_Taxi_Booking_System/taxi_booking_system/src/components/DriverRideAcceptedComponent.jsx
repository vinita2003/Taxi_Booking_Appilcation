import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import profileImage from "../assets/profileImage.png";
import pickup_icon from "../assets/pickup_icon.png";
import drop_icon from "../assets/drop_icon.png";
import car_icon from "../assets/car.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useSocket} from "../context/SocketContext"

export default function DriverRideAcceptedComponent() {
     const location = useLocation();
  const rideDetails = location.state;


  console.log(rideDetails);

  const driverLocation = { lat: rideDetails.driver.lat, lng: rideDetails.driver.lon }; 
  const pickupLocation = { lat: rideDetails.riderData.pickupLatLng.lat, lng: rideDetails.riderData.pickupLatLng.lon }; // Pickup
  const dropLocation = { lat: rideDetails.riderData.dropLatLng.lat, lng: rideDetails.riderData.dropLatLng.lon }; // Drop (example)
 const { socket } = useSocket();

   
  const [current, setCurrent] = useState(driverLocation);
  const [showNavigateBtn, setShowNavigateBtn] = useState(true);
  const [showBeginBtn, setShowBeginBtn] = useState(false);

  const carMarkerRef = useRef(null);
  const mapRef = useRef(null);
  const routeLineRef = useRef(null);
  const coordinatesRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const map = L.map("map", {
      center: [driverLocation.lat, driverLocation.lng],
      zoom: 13,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Car marker
    const carMarker = L.marker([current.lat, current.lng], {
      icon: L.icon({
        iconUrl: car_icon,
        iconSize: [35, 35],
      }),
    }).addTo(map);
    carMarkerRef.current = carMarker;

    // Pickup marker
    L.marker([pickupLocation.lat, pickupLocation.lng], {
      icon: L.icon({
        iconUrl: pickup_icon,
        iconSize: [40, 40],
      }),
    }).addTo(map);

    return () => map.remove();
  }, []);

  // 🔹 generic route + animate function
  const animateRoute = (start, end, onFinish) => {
    if (!mapRef.current) return;

    // clear old line
    if (routeLineRef.current) {
      mapRef.current.removeLayer(routeLineRef.current);
    }

    // Routing
    const control = L.Routing.control({
      waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
      lineOptions: { styles: [{ color: "", weight: 4, opacity: 0.7 }] },
      createMarker: () => null,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(mapRef.current);

    control.on("routesfound", function (e) {
      coordinatesRef.current = e.routes[0].coordinates;

      // custom shrinkable line
      routeLineRef.current = L.polyline(
        coordinatesRef.current.map((c) => [c.lat, c.lng]),
        { color: "black", weight: 4 }
      ).addTo(mapRef.current);

      let i = 0;
      const interval = setInterval(() => {
        if (i >= coordinatesRef.current.length) {
          clearInterval(interval);
          if (onFinish) onFinish();
          return;
        }

        const point = coordinatesRef.current[i];
        setCurrent({ lat: point.lat, lng: point.lng });

        if (carMarkerRef.current) {
          carMarkerRef.current.setLatLng([point.lat, point.lng]);
        }

        if (routeLineRef.current) {
          const remaining = coordinatesRef.current
            .slice(i)
            .map((c) => [c.lat, c.lng]);
          routeLineRef.current.setLatLngs(remaining);
        }

        i++;
      }, 200);
    });
  };

  // 🔹 Navigate to pickup
  const navigateToPickup = () => {
    setShowNavigateBtn(false); // hide button
    socket.emit("driver:navigateToPickup", {riderSocketId : rideDetails.riderData.socketId})
    animateRoute(driverLocation, pickupLocation, () => {
      // jab pickup reach ho jaye
      setShowBeginBtn(true);
    });
  };

  // 🔹 Begin journey (pickup → drop)
  const beginJourney = () => {
    setShowBeginBtn(false);
    socket.emit("driver:beginToJourney", {riderSocketId : rideDetails.riderData.socketId})
    // Drop marker add karo
    L.marker([dropLocation.lat, dropLocation.lng], {
      icon: L.icon({
        iconUrl: drop_icon,
        iconSize: [40, 40],
      }),
    }).addTo(mapRef.current);

    animateRoute(pickupLocation, dropLocation, () => {
      navigate("/driver/rideCompleted", {replace: true})
      alert("Journey Completed ✅");
    });
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Section */}
      <div className="flex items-center justify-between px-2 shadow-md bg-white">
        <div className="flex items-center space-x-1">
          <img
            src={profileImage}
            alt="Driver"
            className="w-12 h-12 rounded-full"
          />
          <h2 className="font-semibold text-lg">{rideDetails.riderData.name}</h2>
        </div>
        <p className="text-gray-500">4.8</p>
      </div>

      {/* Map Section */}
      <div id="map" className="flex-1 w-full"></div>

      {/* Bottom Section */}
      <div className="p-4 bg-white border-t mb-18 overflow-y-auto">
        <div className="mb-2 flex flex-col gap-1 ">
          <div className="flex gap-4 item-center">
            <span className="bg-gray-300 my-auto text-3xl rounded-sm p-1">
              📍
            </span>
            <span className="font-semibold flex my-auto">
              {rideDetails.riderData.pickup}
            </span>
          </div>
          <div className="flex gap-4 item-center">
            <span className="bg-gray-300 my-auto text-3xl rounded-sm p-1">
              📍
            </span>
            <span className="font-semibold flex my-auto">
               {rideDetails.riderData.drop}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center mb-3 w-full">
          <div className="flex justify-between w-full">
            <span className="font-bold">Distance:</span> <span>{rideDetails.distance}</span>
          </div>
          <div className="flex justify-between w-full">
            <span className="font-bold">ETA</span> <span>8min</span>
          </div>
          <div className="flex justify-between w-full">
            <span className="font-bold">Amount:</span> <span>{rideDetails.riderData.fareAmount}</span>
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          {showNavigateBtn && (
            <button
              onClick={navigateToPickup}
              className="flex-1 bg-black text-white py-2 rounded-lg"
            >
              Navigate to Pickup
            </button>
          )}

          {showBeginBtn && (
            <button
              onClick={beginJourney}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg"
            >
              Begin Journey
            </button>
          )}

          <button className="flex-1 bg-gray-500 text-white py-2 rounded-lg">
            Cancel Ride
          </button>
        </div>
      </div>
    </div>
  );
} 