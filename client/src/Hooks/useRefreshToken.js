import axios from "../Api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refreshToken = async () => {
        const response = await axios.get("/auth/refresh", {
            withCredentials: true
        });

        setAuth(prev => {
            return {
                ...prev,
                role: response.data.role,
                username: response.data.username,
                accessToken: response.data.accessToken
            }
        });

        return response.data.accessToken;
    };

    return refreshToken;
};

export default useRefreshToken;