export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  description: string;
  category: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID' | 'CANCELLED';
  expense_date: string;
  proof_image?: string;
  user_id: number;
  user?: User;
  created_at: string;
  updated_at: string;
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
  role?: 'admin' | 'employee';
}

export interface CreateExpenseRequest {
  title: string;
  amount: number;
  description: string;
  category: string;
  expense_date: string;
  proof_image?: File;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Stats {
  total_expenses: number;
  pending_expenses: number;
  approved_expenses: number;
  rejected_expenses: number;
  paid_expenses: number;
  total_amount: number;
}
