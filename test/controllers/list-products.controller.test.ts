import { describe, expect, it } from 'vitest';
import { It, Mock, Times } from 'moq.ts';
import { Request, Response } from 'express';
import { ListProductsController } from '../../src/presentation/controllers/list-products.controller.js';
import { ListProductsUseCase } from '../../src/application/use-cases/list-products.use-case.js';
import { Product } from '../../src/domain/entities/product.entity.js';

describe('ListProductsController', () => {
  it('should return 200 with all products and count', async () => {
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

    const useCaseMock = new Mock<ListProductsUseCase>()
      .setup((instance) => instance.execute())
      .returns(Promise.resolve(mockProducts));

    const reqMock = new Mock<Request>();
    const resMock = new Mock<Response>();

    resMock.setup((instance) => instance.status(200)).returns(resMock.object());
    resMock.setup((instance) => instance.json(It.IsAny())).returns(resMock.object());

    const controller = new ListProductsController(useCaseMock.object());

    await controller.handle(reqMock.object(), resMock.object());

    useCaseMock.verify((instance) => instance.execute(), Times.Once());
    resMock.verify((instance) => instance.status(200), Times.Once());
    resMock.verify(
      (instance) =>
        instance.json(
          It.Is((body: any) => body.data === mockProducts && body.count === 1)
        ),
      Times.Once()
    );
  });
});
