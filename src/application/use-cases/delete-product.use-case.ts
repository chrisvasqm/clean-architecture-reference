import { NotFoundError } from '../../domain/errors/domain-errors.js';
import { IProductRepository } from '../../domain/repositories/product.repository.interface.js';

export class DeleteProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Product', id);
    }
    await this.productRepository.delete(id);
  }
}
