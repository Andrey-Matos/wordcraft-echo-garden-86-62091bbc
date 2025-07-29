
import axios from 'axios';
import { Neologism, Category } from '../types/neologism';

// Create an axios instance with baseURL and authorization header
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

// Add authorization header to all requests if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication service
export const authService = {
  async login(username: string, password: string) {
    const response = await api.post('/auth/login/', { username, password });
    localStorage.setItem('auth_token', response.data.token);
    return response.data;
  },
  
  async register(username: string, email: string, password: string) {
    const response = await api.post('/auth/register/', { username, email, password });
    return response.data;
  },
  
  async logout() {
    localStorage.removeItem('auth_token');
    return true;
  },
  
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }
};

// Neologism service
export const neologismService = {
  async getNeologisms() {
    const response = await api.get<Neologism[]>('/neologisms/');
    return response.data;
  },
  
  async getNeologismById(id: string) {
    const response = await api.get<Neologism>(`/neologisms/${id}/`);
    return response.data;
  },
  
  async createNeologism(neologism: Omit<Neologism, 'id' | 'createdAt'>) {
    const response = await api.post<Neologism>('/neologisms/', neologism);
    return response.data;
  },
  
  async updateNeologism(id: string, neologism: Partial<Neologism>) {
    const response = await api.put<Neologism>(`/neologisms/${id}/`, neologism);
    return response.data;
  },
  
  async updateNeologismStatus(id: string, status: string) {
    const response = await api.patch<Neologism>(`/neologisms/${id}/`, { status });
    return response.data;
  }
};

// Category service
export const categoryService = {
  async getCategories() {
    const response = await api.get<Category[]>('/categories/');
    return response.data;
  },
  
  async createCategory(name: string) {
    const response = await api.post<Category>('/categories/', { name });
    return response.data;
  }
};
