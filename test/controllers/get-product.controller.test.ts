import { beforeEach, describe, it } from 'vitest';
import { It, Mock, Times } from 'moq.ts';
import { Request, Response } from 'express';
import { GetProductController } from '../../src/presentation/controllers/get-product.controller.js';
import { GetProductUseCase } from '../../src/application/use-cases/get-product.use-case.js';
import { Product } from '../../src/domain/entities/product.entity.js';

describe('GetProductController', () => {
  const mockProduct: Product = {
    id: 'prod-123',
    name: 'Wireless Mouse',
    description: 'Ergonomic',
    price: 49.99,
    stock: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let useCaseMock: Mock<GetProductUseCase>;
  let resMock: Mock<Response>;
  let controller: GetProductController;

  beforeEach(() => {
    useCaseMock = new Mock<GetProductUseCase>();
    resMock = new Mock<Response>();
    resMock.setup((r) => r.status(200)).returns(resMock.object());
    resMock.setup((r) => r.json(It.IsAny())).returns(resMock.object());
    controller = new GetProductController(useCaseMock.object());
  });

  it('should return 200 with the product when found', async () => {
    // Arrange
    useCaseMock.setup((u) => u.execute('prod-123')).returns(Promise.resolve(mockProduct));

    // Act
    await controller.handle({ params: { id: 'prod-123' } } as Request<{ id: string }>, resMock.object());

    // Assert
    resMock.verify((r) => r.status(200), Times.Once());
    resMock.verify((r) => r.json(It.Is((b: any) => b.data === mockProduct)), Times.Once());
  });
});
