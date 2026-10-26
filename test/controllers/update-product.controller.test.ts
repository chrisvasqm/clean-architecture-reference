import { beforeEach, describe, it } from 'vitest';
import { It, Mock, Times } from 'moq.ts';
import { Request, Response } from 'express';
import { UpdateProductController } from '../../src/presentation/controllers/update-product.controller.js';
import { UpdateProductUseCase } from '../../src/application/use-cases/update-product.use-case.js';
import { Product, UpdateProductDTO } from '../../src/domain/entities/product.entity.js';

describe('UpdateProductController', () => {
  const updatePayload: UpdateProductDTO = { price: 89.99, stock: 40 };
  const updatedProduct: Product = {
    id: 'prod-1',
    name: 'Keyboard',
    description: 'RGB',
    price: 89.99,
    stock: 40,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let useCaseMock: Mock<UpdateProductUseCase>;
  let responseMock: Mock<Response>;
  let controller: UpdateProductController;

  beforeEach(() => {
    useCaseMock = new Mock<UpdateProductUseCase>();
    responseMock = new Mock<Response>();
    responseMock.setup((response) => response.status(200)).returns(responseMock.object());
    responseMock.setup((response) => response.json(It.IsAny())).returns(responseMock.object());
    controller = new UpdateProductController(useCaseMock.object());
  });

  it('should return 200 with updated product and success message', async () => {
    // Arrange
    useCaseMock.setup((useCase) => useCase.execute('prod-1', It.IsAny())).returns(Promise.resolve(updatedProduct));

    // Act
    await controller.handle(
      { params: { id: 'prod-1' }, body: updatePayload } as Request<{ id: string }>,
      responseMock.object()
    );

    // Assert
    responseMock.verify((response) => response.status(200), Times.Once());
    responseMock.verify(
      (response) =>
        response.json(
          It.Is(
            (body: any) =>
              body.data === updatedProduct &&
              body.message === 'Product updated successfully'
          )
        ),
      Times.Once()
    );
  });
});
