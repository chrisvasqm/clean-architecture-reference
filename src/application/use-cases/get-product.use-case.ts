import { Product } from '../../domain/entities/product.entity.js';
import { NotFoundError } from '../../domain/errors/domain-errors.js';
import { IProductRepository } from '../../domain/repositories/product.repository.interface.js';

export class GetProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product', id);
    }
    return product;
  }
}
