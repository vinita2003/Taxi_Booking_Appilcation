import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


export default function DriverRideCompletedComponent() {
   const mapRef = useRef(null);
  const navigate = useNavigate();
  const drop = { lat: 24.6177, lng: 73.7085 }

  useEffect(() => {
    if (!drop) return;

    const map = L.map(mapRef.current, {
      center: [drop.lat, drop.lng],
      zoom: 15,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Drop location marker
    L.marker([drop.lat, drop.lng])
      .addTo(map)
      .bindPopup("Drop Location")
      .openPopup();

    return () => map.remove();
  }, [drop]);

  return (
    <div className="h-screen flex flex-col">
      {/* Map */}
      <div ref={mapRef} className="flex-1"></div>

      {/* Overlay Message */}
      <div className=" mb-20 p-6 text-center bg-white shadow-md">
        <h2 className="text-2xl font-bold mb-4">Ride Completed ✅</h2>
        <p className="mb-4">
          Thank you for using this application! We hope you had a smooth ride.
        </p>
        <button
          onClick={() => navigate("/driver/dashboard", {replace: true})}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
