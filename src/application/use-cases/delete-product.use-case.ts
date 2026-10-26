import { NotFoundError } from '../../domain/errors/domain-errors.js';
import { IProductRepository } from '../../domain/repositories/product.repository.interface.js';

export class DeleteProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Product', id);
    }
  }
}
