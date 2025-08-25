import express from "express";
import authRiderRoutes from "./user/rider/routes/auth-routes.js";
import authDriverRoutes from "./user/driver/routes/auth-routes.js";
import rideDetailsRoutes from "./user/rider/routes/rideDetails-routes.js"
import riderDetailsRoutes from "./user/rider/routes/riderDetails-routes.js";
import driverDetailsRoutes from "./user/driver/routes/driverDetails-routes.js"
import { isAuthenticated as isAuthenticatedRider } from "./middlewares/auth-rider-middleware.js";
import { isAuthenticated as isAuthenticatedDriver } from "./middlewares/auth-driver-middleware.js";

const router = express.Router();
router.use((req, res, next) => {
    console.log(`[MAIN ROUTER] ${req.method} ${req.originalUrl}`);
  next();
});

router.use('/rider', authRiderRoutes);
router.use('/driver', authDriverRoutes);
router.use('/rider/rideDetails', rideDetailsRoutes)
router.use('/rider/riderDetails', riderDetailsRoutes)
router.use('/driver/driverDetails', driverDetailsRoutes)



export default router;