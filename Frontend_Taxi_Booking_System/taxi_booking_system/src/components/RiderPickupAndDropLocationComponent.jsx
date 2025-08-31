import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


function useDebouncedValue(value, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}


async function nominatimSearch(query) {
  if (!query || query.trim().length < 1) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
    query
  )}&addressdetails=1&limit=5&countrycodes=in`;
  const res = await fetch(url, {
    headers: {
      // Browsers set Referer automatically; add a brief identifier via header or query if you self-host.
      "Accept-Language": "en",
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data || []).map((item) => ({
    label: item.display_name,
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
  }));
}



async function nominatimReverse(lat, lon) {
  try {
    
    const res = await api.get('/rider/rideDetails/nominationReverse', {
      params: { lat, lon },
    } );
    // if (!res.ok) return null;
        if (res.status !== 200) return null;
  // const data = await res.json();
  console.log("Reverse geocoding response:", res.data);
  const { address } = res.data;
  console.log("Reverse geocoding data:", address);
    // const data = res.data.display_name;
  return address || null;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}

function AddressInput({
  label,
  value,
  onChange,
  onSelectSuggestion, // ({lat, lon, label}) => void
  onFocus,
  placeholder,
}) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebouncedValue(value, 100);
  const containerRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!debounced || debounced.length < 3) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const results = await nominatimSearch(debounced);
        if (alive) setSuggestions(results);
      } catch (_) {
        if (alive) setSuggestions([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [debounced]);

  // close dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <label className="block font-medium mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          onFocus?.();
          setOpen(true);
        }}
        placeholder={placeholder}
        className="border p-2 w-full rounded"
      />
      {open && (suggestions.length > 0 || loading) && (
        <div className="mt-1 max-h-56 overflow-auto rounded border bg-white shadow">
          {loading && (
            <div className="p-2 text-sm text-gray-500">Searching…</div>
          )}
          {suggestions.map((s, idx) => (
            <button
              key={`${s.lat}-${s.lon}-${idx}`}
              type="button"
              className="block w-full text-left p-2 hover:bg-gray-100"
              onClick={() => {
                setOpen(false);
                onSelectSuggestion({ lat: s.lat, lon: s.lon, label: s.label });
              }}
            >
              {s.label}
            </button>
          ))}
          {!loading && suggestions.length === 0 && (
            <div className="p-2 text-sm text-gray-500">No results</div>
          )}
        </div>
      )}
    </div>
  );
}

// --- Map click handler component ---
function MapClickPicker({ setFromClick }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setFromClick(lat, lng);
    },
  });
  return null;
}

export const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


export default function RiderPickupAndDropLocationComponent() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupLatLng, setPickupLatLng] = useState(null); // {lat, lon}
  const [dropLatLng, setDropLatLng] = useState(null);
  const [activeField, setActiveField] = useState("pickup");
  const [center, setCenter] = useState([28.6139, 77.209]); // Delhi default
  const [showMap, setShowMap] = useState(false); // 🔹 control map modal
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Try browser geolocation on mount
  useEffect(() => {
   
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log(latitude, longitude);
          setCenter([latitude, longitude]);

          // set pickup coords initially
          setPickupLatLng({ lat: latitude, lon: longitude });

          // reverse geocode
          const address = await nominatimReverse(latitude, longitude);
          console.log("Initial pickup address:", address);
          if (address) setPickup(address);
        },
        (err) => {
          console.log("User denied location or error:", err);
        }
      );
    }
  }, []);

  // Handle map click
  const handleMapClick = async (lat, lon) => {
    const address = await nominatimReverse(lat, lon);
    if (activeField === "pickup") {
      setPickupLatLng({ lat, lon });
      if (address) setPickup(address);
    } else {
      setDropLatLng({ lat, lon });
      if (address) setDrop(address);
    }
    setCenter([lat, lon]);
    // setShowMap(false); // close after selection
  };

  const handleNext = async () => {
    if (!pickupLatLng || !dropLatLng) {
      alert("Please select both pickup and drop locations.");
      return;
    }
    setUser((prev) => ({ ...prev,  pickupLatLng, dropLatLng, pickup, drop }));
    console.log("User data updated:", user);
    const response = await api.post('/rider/rideDetails/addLocation', {
        pickupLongitude : pickupLatLng.lon, pickupLatitude : pickupLatLng.lat, dropLongitude: dropLatLng.lon, dropLatitude: dropLatLng.lat,
      pickup,
      drop,
     
    }, { withCredentials: true });
    const { success, carTypeAmountDetails } = response.data;
    if (success) {
      console.log("Pickup and drop set successfully:", carTypeAmountDetails);
      navigate('/rider/confirmRide', { state: { carTypeAmountDetails } });
    } else {
      console.error("Error setting pickup/drop:", message);
      alert("Failed to set pickup/drop locations. Please try again.");
    }
  };

  
  return (
    <div className="p-4 space-y-4">
      {/* Inputs */}
      <div className="grid gap-4">
        <AddressInput
          label="Pickup Location"
          value={pickup}
          onChange={setPickup}
          onFocus={() => setActiveField("pickup")}
          placeholder="Type pickup address"
          onSelectSuggestion={({ lat, lon, label }) => {
            setPickup(label);
            setPickupLatLng({ lat, lon });
            setCenter([lat, lon]);
          }}
        />

        <AddressInput
          label="Drop Location"
          value={drop}
          onChange={setDrop}
          onFocus={() => setActiveField("drop")}
          placeholder="Type drop address"
          onSelectSuggestion={({ lat, lon, label }) => {
            setDrop(label);
            setDropLatLng({ lat, lon });
            setCenter([lat, lon]);
          }}
        />
      </div>

      {/* 🔹 Common Select on Map Button */}
      {!showMap && <button
        onClick={() => setShowMap(true)}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        Select on Map
      </button>}


      {showMap && (
        <div className="absolute inset-0  bg-opacity-40 flex items-center justify-center mt-14">
          <div className="bg-white p-4 rounded-lg w-[90%] md:w-[600px] h-[400px]">
            <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              />

              {/* Markers */}
              {pickupLatLng && <Marker position={[pickupLatLng.lat, pickupLatLng.lon]} icon={greenIcon} />}
              {dropLatLng && <Marker position={[dropLatLng.lat, dropLatLng.lon]}  icon={redIcon}
 />}

              {/* When user clicks on map */}
              <MapClickPicker setFromClick={handleMapClick} />
            </MapContainer>

            <button
              onClick={() => setShowMap(false)}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
            >
              set location
            </button>
          </div>
        </div>
      )}

      {/* Debug / Submit */}
      <div className="flex gap-2">
        <button
          onClick={handleNext}
          className= "absolute bottom-15 left-5 w-[90%] bg-black text-white py-2 rounded-lg text-md font-extrabold hover:bg-gray-200 hover:text-black transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}


  