import { createContext, use, useContext, useEffect, useState } from "react";
import api, {setAccessToken} from "../api/client.js";

const AuthContext = createContext();
export const useAuth = () =>  useContext(AuthContext);

export default function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

useEffect(() => {
    const checkAuth = async () => {
        try {
            let response = await api.get('/rider/auth/refresh', { withCredentials: true });
            console.log(response.data.user)
            setUser(response.data.user);
            setAccessToken(response.data.accessToken);
        } catch (error) {
            try {
                // agar rider fail ho gaya to driver try karo
                const response = await api.get('/driver/auth/refresh', { withCredentials: true });
                setUser(response.data.user);
                setAccessToken(response.data.accessToken);
            } catch (err) {
                console.error("Authentication failed:", err);
                setUser(null);
                setAccessToken(null);
            }
        } finally {
            setReady(true);
        }
    };

    checkAuth();
}, []);

    const login = async (phone, password, title) => {
        try {
            const response = await api.post(`/${title.toLowerCase()}/login`, { phone, password }, { withCredentials: true });
            console.log("Login response:", response.data);
            setUser(response.data.user);
            setAccessToken(response.data.accessToken);
            return response.data;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    }

    const logout = async (title) => {
        try {
            await api.get(`/${title.toLowerCase()}/logout`, { withCredentials: true });
            setUser(null);
            setAccessToken(null);
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user,setUser, ready, login, logout }}>
            {ready ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    );
}
