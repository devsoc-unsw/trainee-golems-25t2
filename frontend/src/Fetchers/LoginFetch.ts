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