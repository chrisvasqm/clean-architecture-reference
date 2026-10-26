import { randomUUID } from 'node:crypto';
import { CreateProductDTO, Product, ProductEntity } from '../../domain/entities/product.entity.js';
import { IProductRepository } from '../../domain/repositories/product.repository.interface.js';

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(dataTransferObject: CreateProductDTO): Promise<Product> {
    const id = randomUUID();
    const product = ProductEntity.create(id, dataTransferObject);
    return this.productRepository.create(product);
  }
}
