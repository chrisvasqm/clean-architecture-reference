import { ApiResponse, CreateProductDTO, Product, UpdateProductDTO } from '../types.js';

const API_BASE = '/api/products';

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `HTTP error ${response.status}`;
    throw new Error(errorMsg);
  }
  return data as T;
}

export const productApi = {
  // GET /api/products - List all products
  async list(): Promise<{ products: Product[]; count: number }> {
    const res = await fetch(API_BASE);
    const body = await handleResponse<ApiResponse<Product[]>>(res);
    return {
      products: body.data,
      count: body.count ?? body.data.length,
    };
  },

  // GET /api/products/:id - Get product by ID
  async getById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`);
    const body = await handleResponse<ApiResponse<Product>>(res);
    return body.data;
  },

  // POST /api/products - Create a product
  async create(payload: CreateProductDTO): Promise<Product> {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await handleResponse<ApiResponse<Product>>(res);
    return body.data;
  },

  // PUT /api/products/:id - Full/standard update
  async update(id: string, payload: UpdateProductDTO): Promise<Product> {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await handleResponse<ApiResponse<Product>>(res);
    return body.data;
  },

  // PATCH /api/products/:id - Partial update
  async patch(id: string, payload: UpdateProductDTO): Promise<Product> {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await handleResponse<ApiResponse<Product>>(res);
    return body.data;
  },

  // DELETE /api/products/:id - Delete product
  async delete(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return handleResponse<{ message: string }>(res);
  },
};
