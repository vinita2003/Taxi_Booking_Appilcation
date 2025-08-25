import express from "express"
import { isAuthenticated } from "../../../middlewares/auth-rider-middleware.js"
import { roleMiddleware } from "../../../middlewares/role-middleware.js"
import { getAllRiderRideHistory, getRiderPersonalInformation } from "../controllers/riderDetails-controller.js"

const router = express.Router()
router.get("/getRiderRideHistory",isAuthenticated, roleMiddleware("rider"), getAllRiderRideHistory)
router.get("/getRiderPersonalInformation", isAuthenticated, roleMiddleware("rider"), getRiderPersonalInformation)

export default router;