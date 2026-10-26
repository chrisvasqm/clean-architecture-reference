import { describe, it } from 'vitest';
import { It, Mock, Times } from 'moq.ts';
import { Request, Response } from 'express';
import { UpdateProductController } from '../../src/presentation/controllers/update-product.controller.js';
import { UpdateProductUseCase } from '../../src/application/use-cases/update-product.use-case.js';
import { Product, UpdateProductDTO } from '../../src/domain/entities/product.entity.js';

describe('UpdateProductController', () => {
  it('should return 200 with updated product and success message', async () => {
    const updatePayload: UpdateProductDTO = {
      price: 89.99,
      stock: 40,
    };

    const updatedProduct: Product = {
      id: 'prod-1',
      name: 'Mechanical Keyboard',
      description: 'RGB Backlit',
      price: 89.99,
      stock: 40,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const useCaseMock = new Mock<UpdateProductUseCase>()
      .setup((instance) =>
        instance.execute(
          'prod-1',
          It.Is(
            (dto: UpdateProductDTO) =>
              dto.price === updatePayload.price && dto.stock === updatePayload.stock
          )
        )
      )
      .returns(Promise.resolve(updatedProduct));

    const reqMock = new Mock<Request<{ id: string }>>()
      .setup((instance) => instance.params)
      .returns({ id: 'prod-1' })
      .setup((instance) => instance.body)
      .returns(updatePayload);

    const resMock = new Mock<Response>();
    resMock.setup((instance) => instance.status(200)).returns(resMock.object());
    resMock.setup((instance) => instance.json(It.IsAny())).returns(resMock.object());

    const controller = new UpdateProductController(useCaseMock.object());

    await controller.handle(reqMock.object(), resMock.object());

    useCaseMock.verify(
      (instance) => instance.execute('prod-1', It.IsAny()),
      Times.Once()
    );
    resMock.verify((instance) => instance.status(200), Times.Once());
    resMock.verify(
      (instance) =>
        instance.json(
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
