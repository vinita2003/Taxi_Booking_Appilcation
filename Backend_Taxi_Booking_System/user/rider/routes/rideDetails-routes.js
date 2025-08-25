import express from "express";
import { isAuthenticated } from "../../../middlewares/auth-rider-middleware.js";
import {storeRideDetailsPickAndDropLocation, storeRideDetailsCarTypeOrDriverRating, nominationReverse} from "../controllers/rideDetails-controller.js"
import { roleMiddleware } from "../../../middlewares/role-middleware.js";

const router = express.Router();

router.post("/addLocation", isAuthenticated, roleMiddleware("rider"),  storeRideDetailsPickAndDropLocation)
router.patch("/setCarType/:id", isAuthenticated, roleMiddleware("rider"), storeRideDetailsCarTypeOrDriverRating)
router.patch("/setDriverRating/:id", isAuthenticated, roleMiddleware("rider"), storeRideDetailsCarTypeOrDriverRating);
router.get("/nominationReverse", isAuthenticated, roleMiddleware("rider"), nominationReverse)
export default router;