import axios from 'axios';
// Assuming User type is exported from AuthContext
import type { User } from '../context/AuthContext';
import {BASE_URL} from "../Constants.ts";

const API_URL = BASE_URL + 'buildings/';

// Define the shape of our data for TypeScript
interface Building {
    id: string;
    name: string;
    location?: string;
}

// This is the shape of a single checklist item in the creation payload
interface ChecklistItemPayload {
    question: string;
    type: 'NUMERIC' | 'BOOLEAN' | 'TEXT';
}

// This is the shape of the entire payload for the POST request
interface CreateBuildingPayload {
    name: string;
    location?: string;
    checklistItems: ChecklistItemPayload[];
}

const getAuthHeader = () => {
    const user: User | null = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

const getAllBuildings = () => {
    return axios.get<Building[]>(API_URL, { headers: getAuthHeader() });
};

// --- NEW FUNCTION ---
const createBuildingWithChecklist = (payload: CreateBuildingPayload) => {
    return axios.post<Building>(API_URL, payload, { headers: getAuthHeader() });
};


export default {
    getAllBuildings,
    createBuildingWithChecklist, // Export the new function
};