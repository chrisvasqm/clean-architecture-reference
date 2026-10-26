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
  let responseMock: Mock<Response>;
  let controller: GetProductController;

  beforeEach(() => {
    useCaseMock = new Mock<GetProductUseCase>();
    responseMock = new Mock<Response>();
    responseMock.setup((response) => response.status(200)).returns(responseMock.object());
    responseMock.setup((response) => response.json(It.IsAny())).returns(responseMock.object());
    controller = new GetProductController(useCaseMock.object());
  });

  it('should return 200 with the product when found', async () => {
    // Arrange
    useCaseMock.setup((useCase) => useCase.execute('prod-123')).returns(Promise.resolve(mockProduct));

    // Act
    await controller.handle({ params: { id: 'prod-123' } } as Request<{ id: string }>, responseMock.object());

    // Assert
    responseMock.verify((response) => response.status(200), Times.Once());
    responseMock.verify((response) => response.json(It.Is((body: any) => body.data === mockProduct)), Times.Once());
  });
});
