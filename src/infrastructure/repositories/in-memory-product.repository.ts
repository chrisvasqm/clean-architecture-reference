import { Product } from '../../domain/entities/product.entity.js';
import { IProductRepository } from '../../domain/repositories/product.repository.interface.js';

export class InMemoryProductRepository implements IProductRepository {
  private readonly products = new Map<string, Product>();

  constructor(products: Product[] = []) {
    for (const product of products) {
      this.products.set(product.id, { ...product });
    }
  }

  async create(product: Product): Promise<Product> {
    this.products.set(product.id, { ...product });
    return { ...product };
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.products.get(id);
    return product ? { ...product } : null;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values(), (product) => ({ ...product }));
  }

  async update(id: string, product: Product): Promise<Product> {
    this.products.set(id, { ...product });
    return { ...product };
  }

  async delete(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
}
