import { Navigate } from 'react-router-dom';
import { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RiderPrivateRoutes({children, allowedRoles}) {
    // const [loading, setLoading] = useState(true);
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const [role, setRole] = useState(null);
    // const navigate = useNavigate();
     
    // useEffect(() => {
    //     const verifyAuthentication = async () => {
    //     try{
    //         const response = await fetch('http://localhost:3000/rider/auth/check', {
    //         method: 'GET',
    //         credentials: 'include',
    //     });
       
    //     if (response.ok) {
    //         const data = await response.json();
    //         setIsAuthenticated(data.success);
    //         setRole(data.user.role);
    //     } 
    // }catch (error) {
        
    //     setIsAuthenticated(false);
    //     setRole(null);
    //     if(!isAuthenticated) {
    //     console.log("Not authenticated, redirecting to login");
    //     navigate('/rider/login'); 
    // }
        
    // }
    // setLoading(false);
    // };
    // verifyAuthentication();

    
    // }, []);

    // if(loading) {
    //     return <div>Loading...</div>; 
    // }

    // if(!isAuthenticated){
       
    //     return null;
    // }

    const {user, ready} = useAuth();
    if(!ready) return <div>Loading...</div>
    if(!user) return <Navigate to="/login" replace/>;

    if(allowedRoles && !allowedRoles.includes(user.role)){
        return <Navigate to="/driver/dashboard" replace/>
    }
    return children;
  
}
