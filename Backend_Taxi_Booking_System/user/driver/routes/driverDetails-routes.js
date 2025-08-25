import express from "express"
import { isAuthenticated } from "../../../middlewares/auth-driver-middleware.js"
import { roleMiddleware } from "../../../middlewares/role-middleware.js"
import { getAllDriverPersonalInformation } from "../controllers/driverDetails-controller.js"

const router = express.Router()
router.get("/getDriverPersonalInformation", isAuthenticated, roleMiddleware("driver"), getAllDriverPersonalInformation)

export default router;