import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { LoginRequest, RegisterRequest, AuthResponse, Expense, CreateExpenseRequest, User } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    const baseURL = Platform.OS === 'web' 
      ? 'http://127.0.0.1:8001/api' 
      : 'http://192.168.100.3:8001/api';

    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentification
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post('/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post('/register', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get('/user');
    return response.data;
  }

  // Gestion des dépenses
  async getExpenses(): Promise<Expense[]> {
    const response = await this.api.get('/expenses');
    return response.data;
  }

  async getExpense(id: number): Promise<Expense> {
    const response = await this.api.get(`/expenses/${id}`);
    return response.data;
  }

  async createExpense(expenseData: CreateExpenseRequest): Promise<Expense> {
    const response = await this.api.post('/expenses', expenseData);
    return response.data;
  }

  async updateExpense(id: number, expenseData: Partial<CreateExpenseRequest>): Promise<Expense> {
    const response = await this.api.put(`/expenses/${id}`, expenseData);
    return response.data;
  }

  async deleteExpense(id: number): Promise<void> {
    await this.api.delete(`/expenses/${id}`);
  }

  async uploadImage(uri: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', {
      uri,
      type: 'image/jpeg',
      name: 'receipt.jpg',
    } as any);

    const response = await this.api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  }

  // Admin uniquement
  async getAllExpenses(): Promise<Expense[]> {
    const response = await this.api.get('/admin/expenses');
    return response.data;
  }

  async updateExpenseStatus(id: number, status: 'approved' | 'rejected'): Promise<Expense> {
    const response = await this.api.patch(`/admin/expenses/${id}/status`, { status });
    return response.data;
  }
}

export default new ApiService();
