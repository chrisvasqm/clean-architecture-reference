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
  let resMock: Mock<Response>;
  let controller: UpdateProductController;

  beforeEach(() => {
    useCaseMock = new Mock<UpdateProductUseCase>();
    resMock = new Mock<Response>();
    resMock.setup((r) => r.status(200)).returns(resMock.object());
    resMock.setup((r) => r.json(It.IsAny())).returns(resMock.object());
    controller = new UpdateProductController(useCaseMock.object());
  });

  it('should return 200 with updated product and success message', async () => {
    // Arrange
    useCaseMock.setup((u) => u.execute('prod-1', It.IsAny())).returns(Promise.resolve(updatedProduct));

    // Act
    await controller.handle(
      { params: { id: 'prod-1' }, body: updatePayload } as Request<{ id: string }>,
      resMock.object()
    );

    // Assert
    resMock.verify((r) => r.status(200), Times.Once());
    resMock.verify(
      (r) =>
        r.json(
          It.Is(
            (b: any) =>
              b.data === updatedProduct &&
              b.message === 'Product updated successfully'
          )
        ),
      Times.Once()
    );
  });
});
