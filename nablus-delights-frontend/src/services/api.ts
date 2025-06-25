// File: src/services/api.ts

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface RegisterData {
  username?: string;
  email?: string;
  password?: string;
}

export interface LoginData {
  username?: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
}

export interface CreateDishData {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5221';

// Public functions
export async function getDishes(): Promise<Dish[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (!response.ok) throw new Error('Failed to fetch dishes');
    return response.json();
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return [];
  }
}

export async function registerUser(data: RegisterData) {
  const response = await fetch(`${API_BASE_URL}/api/identity/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response;
}

export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/identity/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
}

export async function createOrder(items: { dishId: number, quantity: number }[], token: string) {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ orderItems: items }),
  });
  if (!response.ok) throw new Error('Failed to create order');
  return response.json();
}

// Admin functions
export async function createDish(dishData: CreateDishData, token: string): Promise<Dish> {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dishData)
    });
    if (!response.ok) throw new Error('Failed to create dish');
    return response.json();
}

export async function updateDish(id: number, dishData: CreateDishData, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dishData)
    });
    if (!response.ok) throw new Error('Failed to update dish');
}

export async function deleteDish(id: number, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Failed to delete dish');
}