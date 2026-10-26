import { Product, ProductEntity, UpdateProductDTO } from '../../domain/entities/product.entity.js';
import { NotFoundError } from '../../domain/errors/domain-errors.js';
import { IProductRepository } from '../../domain/repositories/product.repository.interface.js';

export class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string, dataTransferObject: UpdateProductDTO): Promise<Product> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Product', id);
    }

    ProductEntity.validate(dataTransferObject);

    const updatedProduct: Product = {
      ...existing,
      name: dataTransferObject.name !== undefined ? dataTransferObject.name.trim() : existing.name,
      description: dataTransferObject.description !== undefined ? dataTransferObject.description.trim() : existing.description,
      price: dataTransferObject.price ?? existing.price,
      stock: dataTransferObject.stock ?? existing.stock,
      updatedAt: new Date(),
    };

    return this.productRepository.update(id, updatedProduct);
  }
}
