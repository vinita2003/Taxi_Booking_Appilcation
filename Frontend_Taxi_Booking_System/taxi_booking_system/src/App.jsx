import DriverLoginPage from "./pages/driver/LoginPage.jsx";
import RiderLoginPage from "./pages/rider/loginPage.jsx";
import DriverRegisterPage from "./pages/driver/registerPage"
import RiderRegisterPage from "./pages/rider/registerRiderPage.jsx";
import RiderProfilePage from "./pages/rider/ProfilePage.jsx"
import DriverProfilePage from "./pages/driver/ProfilePage.jsx"
import DriverAccountPage from "./pages/driver/AccountPage.jsx"
import RiderAccountPage from "./pages/rider/AccountPage.jsx";
import RiderRideHistoryPage from "./pages/rider/RideHistoryPage.jsx";
import DriverDashBoardPage from "./pages/driver/DashBoardPage.jsx";
import RiderPickupAndDropLocationPage from "./pages/rider/pickupAndDropLocationPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import RiderComfirmRidePage from "./pages/rider/ConfirmRidePage.jsx";
import WaitingForRideConfirmationPage from "./pages/rider/WaitingForRideConfirmationPage.jsx";
import DriverRideAcceptedPage from "./pages/driver/RideAccptedPage.jsx"
import DriverRideCompletedPage from "./pages/driver/RideCompletedPage.jsx"
import RiderRideAcceptedPage from "./pages/rider/RideAcceptedPage.jsx"
import RiderRideCompletedPage from "./pages/rider/RideCompletedPage.jsx"
import DriverFooterComponent from "./components/DriverFooterComponent.jsx";
import RiderFooterComponent from "./components/RiderFooterComponent.jsx";
import DriverPrivateRoutes from "./routes/DriverPrivateRoutes.jsx";
import RiderPrivateRoutes from "./routes/RiderPrivateRoutes.jsx";
import { Route, Routes } from "react-router-dom"
import { useLocation } from "react-router-dom";
import { useAuth } from './context/AuthContext.jsx';



function App() {
  const {user} = useAuth();
  const location = useLocation();
  const hideFooterPaths = [
    "/rider/login", "/driver/login",
    "/rider/register", "/driver/register"]
    const shouldHideFooter = hideFooterPaths.includes(location.pathname);
    return (
     
    < div className='min-h-screen flex items-center justify-center bg-gray-800 px-4'>
        <div className='w-full relative max-w-sm h-screen bg-white rounded-2xl p-6'>
        <Routes>
        <Route path= "/" element= {<LandingPage/>}></Route>
       <Route path= "/rider/login" element= {<RiderLoginPage />}></Route>
       <Route path= "/driver/login" element= {<DriverLoginPage />}></Route>
       <Route path= "/rider/register" element= {<RiderRegisterPage/>}></Route>
       <Route path= "/driver/register" element= {<DriverRegisterPage/>}></Route>
       <Route path= "/rider/profile" element = {<RiderPrivateRoutes><RiderProfilePage/></RiderPrivateRoutes>}></Route>
       <Route path= "/rider/account" element= {<RiderPrivateRoutes><RiderAccountPage/></RiderPrivateRoutes>}></Route>
       <Route path= "/rider/rideHistory" element= {<RiderPrivateRoutes><RiderRideHistoryPage/></RiderPrivateRoutes>}></Route>
       <Route path= "/rider/pickupAndDropLocation" element= {<RiderPrivateRoutes><RiderPickupAndDropLocationPage/></RiderPrivateRoutes>}></Route>
       <Route path= "/driver/profile" element= {<DriverPrivateRoutes><DriverProfilePage/></DriverPrivateRoutes>}></Route>
       <Route path= "/driver/account" element= {<DriverPrivateRoutes><DriverAccountPage/></DriverPrivateRoutes>}></Route>
       <Route path= "/driver/dashboard" element= {<DriverPrivateRoutes><DriverDashBoardPage/></DriverPrivateRoutes>}></Route>
        <Route path= "/rider/confirmRide" element= {<RiderPrivateRoutes><RiderComfirmRidePage/></RiderPrivateRoutes>}></Route>
        <Route path= "/rider/waitingForRideConfirmation" element= {<RiderPrivateRoutes><WaitingForRideConfirmationPage/></RiderPrivateRoutes>}></Route>
        <Route path= "/driver/rideAccepted" element= {<DriverPrivateRoutes><DriverRideAcceptedPage/></DriverPrivateRoutes>}></Route>
        <Route path= "/driver/rideCompleted" element= {<DriverPrivateRoutes><DriverRideCompletedPage/></DriverPrivateRoutes>}></Route>
        <Route path= "/rider/rideAccepted" element= {<RiderPrivateRoutes><RiderRideAcceptedPage/></RiderPrivateRoutes>}></Route>
        <Route path= "/rider/rideCompleted" element= {<RiderPrivateRoutes><RiderRideCompletedPage/></RiderPrivateRoutes>}></Route>
      </Routes>
       

      {user && user.role === "rider" && !shouldHideFooter && <RiderFooterComponent />}
      {user && user.role === "driver" && !shouldHideFooter && <DriverFooterComponent />}
       
      
    </div>
    </div>
    
  )
}

export default App
