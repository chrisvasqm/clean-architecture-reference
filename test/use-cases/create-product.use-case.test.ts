import { beforeEach, describe, expect, it } from 'vitest';
import { It, Mock, Times } from 'moq.ts';
import { CreateProductUseCase } from '../../src/application/use-cases/create-product.use-case.js';
import { CreateProductDTO, Product } from '../../src/domain/entities/product.entity.js';
import { IProductRepository } from '../../src/domain/repositories/product.repository.interface.js';
import { ValidationError } from '../../src/domain/errors/domain-errors.js';

describe('CreateProductUseCase', () => {
  const dataTransferObject: CreateProductDTO = {
    name: 'Mechanical Keyboard',
    description: 'Hot-swappable tactile switches',
    price: 119.99,
    stock: 25,
  };

  let productRepositoryMock: Mock<IProductRepository>;
  let useCase: CreateProductUseCase;

  beforeEach(() => {
    productRepositoryMock = new Mock<IProductRepository>();
    useCase = new CreateProductUseCase(productRepositoryMock.object());
  });

  it('should create and return product when valid data is provided', async () => {
    // Arrange
    productRepositoryMock
      .setup((productRepository) => productRepository.create(It.IsAny()))
      .callback((interaction) => Promise.resolve(interaction.args[0] as Product));

    // Act
    const createdProduct = await useCase.execute(dataTransferObject);

    // Assert
    expect(createdProduct.name).toBe(dataTransferObject.name);
    expect(createdProduct.description).toBe(dataTransferObject.description);
    expect(createdProduct.price).toBe(dataTransferObject.price);
    expect(createdProduct.stock).toBe(dataTransferObject.stock);
    expect(createdProduct.id).toBeDefined();
    productRepositoryMock.verify(
      (productRepository) => productRepository.create(It.IsAny()),
      Times.Once()
    );
  });

  it('should throw ValidationError when name is missing', async () => {
    // Arrange
    const invalidDataTransferObject = { ...dataTransferObject, name: '' };

    // Act & Assert
    await expect(useCase.execute(invalidDataTransferObject)).rejects.toThrow(ValidationError);
    productRepositoryMock.verify(
      (productRepository) => productRepository.create(It.IsAny()),
      Times.Never()
    );
  });
});
