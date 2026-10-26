import { beforeEach, describe, expect, it } from 'vitest';
import { Mock, Times } from 'moq.ts';
import { ListProductsUseCase } from '../../src/application/use-cases/list-products.use-case.js';
import { Product } from '../../src/domain/entities/product.entity.js';
import { IProductRepository } from '../../src/domain/repositories/product.repository.interface.js';

describe('ListProductsUseCase', () => {
  const sampleProducts: Product[] = [
    {
      id: 'product-identifier-1',
      name: 'Mechanical Keyboard',
      description: 'Hot-swappable tactile switches',
      price: 119.99,
      stock: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'product-identifier-2',
      name: 'Wireless Mouse',
      description: 'Ergonomic optical mouse',
      price: 49.99,
      stock: 35,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  let productRepositoryMock: Mock<IProductRepository>;
  let useCase: ListProductsUseCase;

  beforeEach(() => {
    productRepositoryMock = new Mock<IProductRepository>();
    useCase = new ListProductsUseCase(productRepositoryMock.object());
  });

  it('should return all products from the repository', async () => {
    // Arrange
    productRepositoryMock
      .setup((productRepository) => productRepository.findAll())
      .returns(Promise.resolve(sampleProducts));

    // Act
    const products = await useCase.execute();

    // Assert
    expect(products).toEqual(sampleProducts);
    expect(products.length).toBe(2);
    productRepositoryMock.verify(
      (productRepository) => productRepository.findAll(),
      Times.Once()
    );
  });
});
