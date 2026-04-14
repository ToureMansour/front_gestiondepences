import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  User, 
  Expense, 
  LoginRequest, 
  RegisterRequest, 
  CreateExpenseRequest, 
  AuthResponse,
  Stats,
  ApiResponse 
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post('/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post('/register', userData);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/logout');
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get('/profile');
    return response.data;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.api.put('/profile', userData);
    return response.data;
  }

  async getExpenses(): Promise<Expense[]> {
    const response = await this.api.get('/expenses');
    return response.data;
  }

  async getExpense(id: number): Promise<Expense> {
    const response = await this.api.get(`/expenses/${id}`);
    return response.data;
  }

  async createExpense(expenseData: CreateExpenseRequest): Promise<Expense> {
    const formData = new FormData();
    
    formData.append('title', expenseData.title);
    formData.append('amount', expenseData.amount.toString());
    formData.append('description', expenseData.description);
    formData.append('category', expenseData.category);
    formData.append('expense_date', expenseData.expense_date);
    
    if (expenseData.proof_image) {
      formData.append('proof', {
        uri: expenseData.proof_image.uri,
        type: 'image/jpeg',
        name: expenseData.proof_image.name || 'proof.jpg',
      } as any);
    }

    const response = await this.api.post('/expenses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateExpense(id: number, expenseData: Partial<CreateExpenseRequest>): Promise<Expense> {
    const response = await this.api.put(`/expenses/${id}`, expenseData);
    return response.data;
  }

  async deleteExpense(id: number): Promise<void> {
    await this.api.delete(`/expenses/${id}`);
  }

  async approveExpense(id: number): Promise<Expense> {
    const response = await this.api.post(`/expenses/${id}/approve`);
    return response.data;
  }

  async rejectExpense(id: number): Promise<Expense> {
    const response = await this.api.post(`/expenses/${id}/reject`);
    return response.data;
  }

  async markExpenseAsPaid(id: number): Promise<Expense> {
    const response = await this.api.post(`/expenses/${id}/pay`);
    return response.data;
  }

  async getStats(): Promise<Stats> {
    const response = await this.api.get('/stats');
    return response.data;
  }

  async getUsers(): Promise<User[]> {
    const response = await this.api.get('/users');
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await this.api.get(`/users/${id}`);
    return response.data;
  }
}

export default new ApiService();
