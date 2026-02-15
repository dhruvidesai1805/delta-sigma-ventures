import axios from 'axios';
import { User, UserFormData } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

const INITIAL_USERS: User[] = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'joindoe123@gmail.com', phone: '123-456-7890' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'janesmith456@gmailo.com', phone: '987-654-3210' },
];

const getLocalUsers = (): User[] => {
    const users = localStorage.getItem('users');
    if (!users) {
        localStorage.setItem('users', JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
    }
    return JSON.parse(users);
};

const setLocalUsers = (users: User[]) => {
    localStorage.setItem('users', JSON.stringify(users));
};

// API Implementation
export const userService = {
    getAll: async (): Promise<User[]> => {
        if (USE_MOCK_API) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return getLocalUsers();
        }
        const response = await axios.get(`${API_URL}/users`);
        return response.data;
    },

    getById: async (id: string): Promise<User | undefined> => {
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return getLocalUsers().find(u => u.id === id);
        }
        const response = await axios.get(`${API_URL}/users/${id}`);
        return response.data;
    },

    create: async (user: UserFormData): Promise<User> => {
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const users = getLocalUsers();
            const newUser = { ...user, id: crypto.randomUUID() };
            users.push(newUser);
            setLocalUsers(users);
            return newUser;
        }
        const response = await axios.post(`${API_URL}/users`, user);
        return response.data;
    },

    update: async (id: string, user: UserFormData): Promise<User> => {
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const users = getLocalUsers();
            const index = users.findIndex(u => u.id === id);
            if (index === -1) throw new Error('User not found');

            const updatedUser = { ...user, id };
            users[index] = updatedUser;
            setLocalUsers(users);
            return updatedUser;
        }
        const response = await axios.put(`${API_URL}/users/${id}`, user);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        if (USE_MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const users = getLocalUsers();
            const filteredUsers = users.filter(u => u.id !== id);
            setLocalUsers(filteredUsers);
            return;
        }
        await axios.delete(`${API_URL}/users/${id}`);
    }
};
