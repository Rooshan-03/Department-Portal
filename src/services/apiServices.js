import axios from 'axios';
import { setAdmin, setError, setLoading } from '../Redux/admin';

const API_BASE_URL = 'https://pl0bl6km-8000.asse.devtunnels.ms/'

export const loginAdmin = async (e, userData, dispatch) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', userData.email);
    params.append('password', userData.password);
    params.append('scope', '');
    params.append('client_id', 'string');
    params.append('client_secret', '********');

    try {
        dispatch(setLoading(true));

        const response = await axios.post(`${API_BASE_URL}token/`, params, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        console.log('Login Success:', response.data);

        dispatch(setData(response.data));

    } catch (err) {
        const errorMessage = err.response?.data?.detail || "Login failed";
        dispatch(setError(errorMessage));
        console.error('Login Error:', err.response?.data);
    } finally {
        dispatch(setLoading(false));
    }
};



export const registerAdmin = async (e, userData, dispatch) => {
    e.preventDefault();

    const url = `${API_BASE_URL}user/`;

    dispatch(setLoading(true));

    try {
        const response = await axios.post(url, {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: userData.role
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        dispatch(setAdmin(response.data));
        console.log("Admin registered successfully");

    } catch (error) {
        const errorMessage = error.response?.data?.detail || "Something went wrong";
        dispatch(setError(errorMessage));

    } finally {
        dispatch(setLoading(false));
    }
};