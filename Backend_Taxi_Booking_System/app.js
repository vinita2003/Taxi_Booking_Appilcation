import express from "express";
import { config} from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
 import cors from "cors";
import mainRouter from './mainRouter.js'
import { Server } from "socket.io";
import http from "http";

const app = express();
export const server = http.createServer(app);
config({
    path: "./data/.env",
});

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use('/', mainRouter);
// app.get("/", (req, res) => {
//   res.send("Nice working");
// });

app.use(errorMiddleware);

function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

let onlineDrivers = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("driver:online", ({driverId}) => {
    onlineDrivers[driverId] = { socketId: socket.id, lat: 0, lon: 0 };
    console.log(`Driver ${driverId} is online`);          
  });

  socket.on("driver:offline", ({driverId}) => {
    delete onlineDrivers[driverId];
    console.log(`Driver ${driverId} is offline ${onlineDrivers}`);
  });

  socket.on("driver:updateLocation", ({driverId, lat, lon}) => {
    if (onlineDrivers[driverId]) {
      onlineDrivers[driverId].lat = lat;
      onlineDrivers[driverId].lon = lon;
      console.log(`Driver ${driverId} updated location: ${lat}, ${lon}`);
    }
  });

  socket.on("ride:request", ({pickup, riderData}) => {
    for(let driverId in onlineDrivers) {
      const driver = onlineDrivers[driverId];
      const distance = getDistanceInKm(driver.lat, driver.lon, pickup.lat, pickup.lon);
      if (distance <= 10) { // Assuming 5 km is the max distance to consider
        io.to(driver.socketId).emit("ride:new", { pickup, riderData });
        console.log(`Ride offer sent to driver ${driverId}`);
      }
    }
  });

  socket.on("rider:subscribeDrivers", ({ lat, lon}) => {
    const nearbyDrivers = [];
  for(let driverId in onlineDrivers) {
      const driver = onlineDrivers[driverId];
      const distance = getDistanceInKm(driver.lat, driver.lon, lat, lon);
      if (distance <= 10) { // Assuming 10 km radius
        nearbyDrivers.push({
          driverId,
          lat: driver.lat,
          lon: driver.lon
        });
      }
    }
    socket.emit("drivers:nearby", nearbyDrivers);
    console.log(`Nearby drivers sent to rider: ${nearbyDrivers.length} drivers found`); 
  }
  );

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    for (let driverId in onlineDrivers) {
      if (onlineDrivers[driverId].socketId === socket.id) {
        delete onlineDrivers[driverId];
      }
    }
    console.log("User disconnected", socket.id);
  });
});
