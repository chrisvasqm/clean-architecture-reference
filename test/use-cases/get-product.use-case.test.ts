import { beforeEach, describe, expect, it } from 'vitest';
import { Mock, Times } from 'moq.ts';
import { GetProductUseCase } from '../../src/application/use-cases/get-product.use-case.js';
import { Product } from '../../src/domain/entities/product.entity.js';
import { IProductRepository } from '../../src/domain/repositories/product.repository.interface.js';
import { NotFoundError } from '../../src/domain/errors/domain-errors.js';

describe('GetProductUseCase', () => {
  const sampleProduct: Product = {
    id: 'product-identifier-1',
    name: 'Ergonomic Vertical Mouse',
    description: 'Wireless ergonomic mouse with rechargeable battery',
    price: 59.99,
    stock: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let productRepositoryMock: Mock<IProductRepository>;
  let useCase: GetProductUseCase;

  beforeEach(() => {
    productRepositoryMock = new Mock<IProductRepository>();
    useCase = new GetProductUseCase(productRepositoryMock.object());
  });

  it('should return product when product exists', async () => {
    // Arrange
    productRepositoryMock
      .setup((productRepository) => productRepository.findById('product-identifier-1'))
      .returns(Promise.resolve(sampleProduct));

    // Act
    const foundProduct = await useCase.execute('product-identifier-1');

    // Assert
    expect(foundProduct).toEqual(sampleProduct);
    productRepositoryMock.verify(
      (productRepository) => productRepository.findById('product-identifier-1'),
      Times.Once()
    );
  });

  it('should throw NotFoundError when product does not exist', async () => {
    // Arrange
    productRepositoryMock
      .setup((productRepository) => productRepository.findById('non-existent-product-identifier'))
      .returns(Promise.resolve(null));

    // Act & Assert
    await expect(useCase.execute('non-existent-product-identifier')).rejects.toThrow(NotFoundError);
    productRepositoryMock.verify(
      (productRepository) => productRepository.findById('non-existent-product-identifier'),
      Times.Once()
    );
  });
});
