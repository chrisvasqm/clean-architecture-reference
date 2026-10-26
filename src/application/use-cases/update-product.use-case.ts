import { Product, ProductEntity, UpdateProductDTO } from '../../domain/entities/product.entity.js';
import { NotFoundError } from '../../domain/errors/domain-errors.js';
import { IProductRepository } from '../../domain/repositories/product.repository.interface.js';

export class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string, dto: UpdateProductDTO): Promise<Product> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Product', id);
    }

    ProductEntity.validate(dto);

    const updatedProduct: Product = {
      ...existing,
      name: dto.name !== undefined ? dto.name.trim() : existing.name,
      description: dto.description !== undefined ? dto.description.trim() : existing.description,
      price: dto.price !== undefined ? dto.price : existing.price,
      stock: dto.stock !== undefined ? dto.stock : existing.stock,
      updatedAt: new Date(),
    };

    return this.productRepository.update(id, updatedProduct);
  }
}
