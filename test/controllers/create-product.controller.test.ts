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
  let resMock: Mock<Response>;
  let controller: CreateProductController;

  beforeEach(() => {
    useCaseMock = new Mock<CreateProductUseCase>();
    resMock = new Mock<Response>();
    resMock.setup((r) => r.status(201)).returns(resMock.object());
    resMock.setup((r) => r.json(It.IsAny())).returns(resMock.object());
    controller = new CreateProductController(useCaseMock.object());
  });

  it('should return 201 with created product and success message', async () => {
    // Arrange
    useCaseMock.setup((u) => u.execute(It.IsAny())).returns(Promise.resolve(createdProduct));

    // Act
    await controller.handle({ body: payload } as Request, resMock.object());

    // Assert
    resMock.verify((r) => r.status(201), Times.Once());
    resMock.verify(
      (r) =>
        r.json(
          It.Is(
            (b: any) =>
              b.data === createdProduct &&
              b.message === 'Product created successfully'
          )
        ),
      Times.Once()
    );
  });
});
