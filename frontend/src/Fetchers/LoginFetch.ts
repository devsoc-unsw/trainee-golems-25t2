import axios from 'axios';
const URL = 'http://localhost:3000';

export const loginUser = async (email: string, password: string) => {
    try {
        const payload = {email, password}
        console.log (payload);
        const response = await axios.post(`${URL}/auth/login`, payload, {
            withCredentials: true,
        });
        console.log(response.data);
        return response;
    }
    catch (error) {
        console.error(error)
    }
};

export const fetchUserProfile = async () => {
    try {
        const response = await axios.get(`${URL}/api/user/profile`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await axios.post(`${URL}/auth/logout`, {}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to logout:', error);
        throw error;
    }
};