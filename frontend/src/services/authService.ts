import axios from 'axios';

import {BASE_URL} from "../Constants.ts";

interface LoginResponse {
    token: string;
}

const login = (email: string, password: string) => {

    return axios.post<LoginResponse>( BASE_URL + 'auth/login', {
        email,
        password,
    });
};

const logout = () => {
    localStorage.removeItem('user');
};

export default {
    login,
    logout,
};