export interface User {
  id: number;
  name: string;
  email: string;
  role: 'employee' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  receipt_image?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateExpenseRequest {
  title: string;
  description: string;
  amount: number;
  receipt_image?: string;
}
