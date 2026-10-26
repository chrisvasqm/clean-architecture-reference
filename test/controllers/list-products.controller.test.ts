import { beforeEach, describe, it } from 'vitest';
import { It, Mock, Times } from 'moq.ts';
import { Request, Response } from 'express';
import { ListProductsController } from '../../src/presentation/controllers/list-products.controller.js';
import { ListProductsUseCase } from '../../src/application/use-cases/list-products.use-case.js';
import { Product } from '../../src/domain/entities/product.entity.js';

describe('ListProductsController', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Keyboard',
      description: 'Mechanical',
      price: 99,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  let useCaseMock: Mock<ListProductsUseCase>;
  let resMock: Mock<Response>;
  let controller: ListProductsController;

  beforeEach(() => {
    useCaseMock = new Mock<ListProductsUseCase>();
    resMock = new Mock<Response>();
    resMock.setup((r) => r.status(200)).returns(resMock.object());
    resMock.setup((r) => r.json(It.IsAny())).returns(resMock.object());
    controller = new ListProductsController(useCaseMock.object());
  });

  it('should return 200 with all products and count', async () => {
    // Arrange
    useCaseMock.setup((u) => u.execute()).returns(Promise.resolve(mockProducts));

    // Act
    await controller.handle({} as Request, resMock.object());

    // Assert
    resMock.verify((r) => r.status(200), Times.Once());
    resMock.verify((r) => r.json(It.Is((b: any) => b.data === mockProducts && b.count === 1)), Times.Once());
  });
});
