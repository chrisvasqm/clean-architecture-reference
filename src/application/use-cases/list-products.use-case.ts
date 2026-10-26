import { Product } from '../../domain/entities/product.entity.js';
import { IProductRepository } from '../../domain/repositories/product.repository.interface.js';

export class ListProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
