import { Navigate } from 'react-router-dom';
import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export default function DriverPrivateRoutes({children, allowedRoles}) {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();
     
    useEffect(() => {
        const verifyAuthentication = async () => {
        try{
            const response = await fetch('http://localhost:3000/driver/auth/check', {
            method: 'GET',
            credentials: 'include',
        });
       
        if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(data.success);
            setRole(data.user.role);
        } 
    }catch (error) {
        setIsAuthenticated(false);
        setRole(null);
        if(!isAuthenticated) {
        console.log("Not authenticated, redirecting to login");
        navigate('/rider/login'); 
    }
        
    }
    setLoading(false);
    };
    verifyAuthentication();

    
    }, []);

    if(loading) {
        return <div>Loading...</div>; 
    }

    if(!isAuthenticated){
       
        return null;
    }

    if(allowedRoles && !allowedRoles.includes(role)){
        return <Navigate to="/driver/dashboard" replace/>
    }
    return children;
  
}
