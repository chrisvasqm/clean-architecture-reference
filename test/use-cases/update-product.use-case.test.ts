import { beforeEach, describe, expect, it } from 'vitest';
import { It, Mock, Times } from 'moq.ts';
import { UpdateProductUseCase } from '../../src/application/use-cases/update-product.use-case.js';
import { Product, UpdateProductDTO } from '../../src/domain/entities/product.entity.js';
import { IProductRepository } from '../../src/domain/repositories/product.repository.interface.js';
import { NotFoundError, ValidationError } from '../../src/domain/errors/domain-errors.js';

describe('UpdateProductUseCase', () => {
  const existingProduct: Product = {
    id: 'product-identifier-1',
    name: 'Standard Keyboard',
    description: 'Basic membrane keyboard',
    price: 29.99,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const updateDataTransferObject: UpdateProductDTO = {
    name: 'Upgraded Mechanical Keyboard',
    price: 89.99,
  };

  let productRepositoryMock: Mock<IProductRepository>;
  let useCase: UpdateProductUseCase;

  beforeEach(() => {
    productRepositoryMock = new Mock<IProductRepository>();
    useCase = new UpdateProductUseCase(productRepositoryMock.object());
  });

  it('should update and return product when valid update data is provided', async () => {
    // Arrange
    productRepositoryMock
      .setup((productRepository) => productRepository.findById('product-identifier-1'))
      .returns(Promise.resolve(existingProduct));

    productRepositoryMock
      .setup((productRepository) => productRepository.update('product-identifier-1', It.IsAny()))
      .callback((interaction) => Promise.resolve(interaction.args[1] as Product));

    // Act
    const updatedProduct = await useCase.execute('product-identifier-1', updateDataTransferObject);

    // Assert
    expect(updatedProduct.name).toBe('Upgraded Mechanical Keyboard');
    expect(updatedProduct.price).toBe(89.99);
    expect(updatedProduct.description).toBe(existingProduct.description);
    expect(updatedProduct.stock).toBe(existingProduct.stock);
    productRepositoryMock.verify(
      (productRepository) => productRepository.findById('product-identifier-1'),
      Times.Once()
    );
    productRepositoryMock.verify(
      (productRepository) => productRepository.update('product-identifier-1', It.IsAny()),
      Times.Once()
    );
  });

  it('should throw NotFoundError when product does not exist', async () => {
    // Arrange
    productRepositoryMock
      .setup((productRepository) => productRepository.findById('non-existent-product-identifier'))
      .returns(Promise.resolve(null));

    // Act & Assert
    await expect(
      useCase.execute('non-existent-product-identifier', updateDataTransferObject)
    ).rejects.toThrow(NotFoundError);
    productRepositoryMock.verify(
      (productRepository) => productRepository.findById('non-existent-product-identifier'),
      Times.Once()
    );
    productRepositoryMock.verify(
      (productRepository) => productRepository.update(It.IsAny(), It.IsAny()),
      Times.Never()
    );
  });

  it('should throw ValidationError when invalid update properties are provided', async () => {
    // Arrange
    productRepositoryMock
      .setup((productRepository) => productRepository.findById('product-identifier-1'))
      .returns(Promise.resolve(existingProduct));

    const invalidUpdateDataTransferObject: UpdateProductDTO = {
      price: -20,
    };

    // Act & Assert
    await expect(
      useCase.execute('product-identifier-1', invalidUpdateDataTransferObject)
    ).rejects.toThrow(ValidationError);
    productRepositoryMock.verify(
      (productRepository) => productRepository.update(It.IsAny(), It.IsAny()),
      Times.Never()
    );
  });
});
