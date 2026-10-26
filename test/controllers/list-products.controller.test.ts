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
  let responseMock: Mock<Response>;
  let controller: ListProductsController;

  beforeEach(() => {
    useCaseMock = new Mock<ListProductsUseCase>();
    responseMock = new Mock<Response>();
    responseMock.setup((response) => response.status(200)).returns(responseMock.object());
    responseMock.setup((response) => response.json(It.IsAny())).returns(responseMock.object());
    controller = new ListProductsController(useCaseMock.object());
  });

  it('should return 200 with all products and count', async () => {
    // Arrange
    useCaseMock.setup((useCase) => useCase.execute()).returns(Promise.resolve(mockProducts));

    // Act
    await controller.handle({} as Request, responseMock.object());

    // Assert
    responseMock.verify((response) => response.status(200), Times.Once());
    responseMock.verify(
      (response) =>
        response.json(
          It.Is(
            (body: any) =>
              body.data === mockProducts && body.count === 1
          )
        ),
      Times.Once()
    );
  });
});
