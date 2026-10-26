import {
  ApiErrorResponse,
  ApiResponse,
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from '../types.js';

const API_BASE = '/api/products';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, init);

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as
      | ApiErrorResponse
      | null;
    throw new Error(errorPayload?.message ?? `HTTP error ${response.status}`);
  }

  return (await response.json()) as T;
}

export const productApi = {
  // GET /api/products - List all products
  async list(): Promise<{ products: Product[]; count: number }> {
    const payload = await request<ApiResponse<Product[]>>('');
    return {
      products: payload.data,
      count: payload.count ?? payload.data.length,
    };
  },

  // POST /api/products - Create a product
  async create(payload: CreateProductDTO): Promise<Product> {
    const response = await request<ApiResponse<Product>>('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  // PUT /api/products/:id - Replace a product
  async update(id: string, payload: UpdateProductDTO): Promise<Product> {
    const response = await request<ApiResponse<Product>>(`/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  // DELETE /api/products/:id - Delete a product
  async delete(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};
