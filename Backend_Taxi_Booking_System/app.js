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

  socket.on("driver:online", ({driverId, driverCarType, lat, lon}) => {
    onlineDrivers[driverId] = { socketId: socket.id, lat: lat, lon: lon, carType : driverCarType };
    console.log(`Driver ${driverId} is online ${driverCarType}`);          
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

  socket.on("ride:request", ({ riderData}) => {
    for(let driverId in onlineDrivers) {
      const driver = onlineDrivers[driverId];
       if (!driver.carType) {
      console.log(`Driver ${driverId} has no carType`);
      continue;
    }
    console.log(riderData)
      const distance = getDistanceInKm(driver.lat, driver.lon, riderData.pickupLatLng.lat, riderData.pickupLatLng.lon);
      console.log(distance)
      if (distance <= 20 && driver.carType.toLowerCase() == riderData.carType) {
        console.log("VINITA");
        io.to(driver.socketId).emit("ride:new", {riderData, driver, distance });
        console.log(`Ride offer sent to driver ${driverId}`);
      }
    }
  });

  socket.on("ride:cancel", ({ rider }) => {
    console.log("Ride cancelled:", rider);

    for(let driverId in onlineDrivers) {
      const driver = onlineDrivers[driverId];
       if (!driver.carType) {
      console.log(`Driver ${driverId} has no carType`);
      continue;
    }
    
      const distance = getDistanceInKm(driver.lat, driver.lon, rider.pickupLatLng.lat, rider.pickupLatLng.lon);
      console.log(distance)
      if (distance <= 20 && driver.carType.toLowerCase() == rider.carType) {
        console.log("VINITA");
        io.to(driver.socketId).emit("ride:cancelled", {riderId : rider._id });
        
      }
    }
  });

  socket.on("rider:subscribeDrivers", ({ lat, lon}) => {
    const nearbyDrivers = [];
    console.log(`Rider subscribed for nearby drivers at location: ${lat}, ${lon}`);
  for(let driverId in onlineDrivers) {
      const driver = onlineDrivers[driverId];
      
      const distance = getDistanceInKm(driver.lat, driver.lon, lat, lon);
      if (distance <= 10) { 
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

  socket.on("driver:rideAccepted", ({ride}) => {
    for(let driverId in onlineDrivers) {
      const driver = onlineDrivers[driverId];
    //    if (!driver.carType) {
    //   console.log(`Driver ${driverId} has no carType`);
    //   continue;
    // }
    
      const distance = getDistanceInKm(ride.driver.lat, ride.driver.lon, ride.riderData.pickupLatLng.lat, ride.riderData.pickupLatLng.lon);
      console.log(distance)
      if (distance <= 20 && driver.carType.toLowerCase() == ride.riderData.carType && ride.driver.socketId != driver.socketId) {
        console.log("VINITA");
        io.to(driver.socketId).emit("ride:cancelled", {riderId : ride.riderData.riderId });
       
      }
    }
    socket.to(ride.riderData.socketId).emit("rider:rideAcceptedByDriver", {ride})
  })

  socket.on("driver:navigateToPickup", ({riderSocketId}) => {
    console.log("navigateToPickup", riderSocketId)

    socket.to(riderSocketId).emit("rider:navigateToPickup")
  })
  socket.on("driver:beginToJourney", ({riderSocketId}) => {
    console.log("beginToJourney", riderSocketId);
    socket.to(riderSocketId).emit("rider:beginToJourney")
  })

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
