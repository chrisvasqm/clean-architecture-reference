import { beforeEach, describe, it } from 'vitest';
import { It, Mock, Times } from 'moq.ts';
import { Request, Response } from 'express';
import { CreateProductController } from '../../src/presentation/controllers/create-product.controller.js';
import { CreateProductUseCase } from '../../src/application/use-cases/create-product.use-case.js';
import { CreateProductDTO, Product } from '../../src/domain/entities/product.entity.js';

describe('CreateProductController', () => {
  const payload: CreateProductDTO = {
    name: 'Mechanical Keyboard',
    description: 'RGB Backlit',
    price: 129.99,
    stock: 20,
  };

  const createdProduct: Product = {
    id: 'prod-new',
    ...payload,
    description: payload.description ?? '',
    stock: payload.stock ?? 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let useCaseMock: Mock<CreateProductUseCase>;
  let responseMock: Mock<Response>;
  let controller: CreateProductController;

  beforeEach(() => {
    useCaseMock = new Mock<CreateProductUseCase>();
    responseMock = new Mock<Response>();
    responseMock.setup((response) => response.status(201)).returns(responseMock.object());
    responseMock.setup((response) => response.json(It.IsAny())).returns(responseMock.object());
    controller = new CreateProductController(useCaseMock.object());
  });

  it('should return 201 with created product and success message', async () => {
    // Arrange
    useCaseMock.setup((useCase) => useCase.execute(It.IsAny())).returns(Promise.resolve(createdProduct));

    // Act
    await controller.handle({ body: payload } as Request, responseMock.object());

    // Assert
    responseMock.verify((response) => response.status(201), Times.Once());
    responseMock.verify(
      (response) =>
        response.json(
          It.Is(
            (body: any) =>
              body.data === createdProduct &&
              body.message === 'Product created successfully'
          )
        ),
      Times.Once()
    );
  });
});
