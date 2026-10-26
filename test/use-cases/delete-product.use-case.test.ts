import { beforeEach, describe, expect, it } from 'vitest';
import { Mock, Times } from 'moq.ts';
import { DeleteProductUseCase } from '../../src/application/use-cases/delete-product.use-case.js';
import { IProductRepository } from '../../src/domain/repositories/product.repository.interface.js';
import { NotFoundError } from '../../src/domain/errors/domain-errors.js';

describe('DeleteProductUseCase', () => {
  let productRepositoryMock: Mock<IProductRepository>;
  let useCase: DeleteProductUseCase;

  beforeEach(() => {
    productRepositoryMock = new Mock<IProductRepository>();
    useCase = new DeleteProductUseCase(productRepositoryMock.object());
  });

  it('should delete product successfully when product exists', async () => {
    // Arrange
    productRepositoryMock
      .setup((productRepository) => productRepository.delete('product-identifier-1'))
      .returns(Promise.resolve(true));

    // Act
    await useCase.execute('product-identifier-1');

    // Assert
    productRepositoryMock.verify(
      (productRepository) => productRepository.delete('product-identifier-1'),
      Times.Once()
    );
  });

  it('should throw NotFoundError when product does not exist in repository', async () => {
    // Arrange
    productRepositoryMock
      .setup((productRepository) => productRepository.delete('non-existent-product-identifier'))
      .returns(Promise.resolve(false));

    // Act & Assert
    await expect(useCase.execute('non-existent-product-identifier')).rejects.toThrow(NotFoundError);
    productRepositoryMock.verify(
      (productRepository) => productRepository.delete('non-existent-product-identifier'),
      Times.Once()
    );
  });
});
