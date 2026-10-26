import { describe, it } from 'vitest';
import { It, Mock, Times } from 'moq.ts';
import { Request, Response } from 'express';
import { GetProductController } from '../../src/presentation/controllers/get-product.controller.js';
import { GetProductUseCase } from '../../src/application/use-cases/get-product.use-case.js';
import { Product } from '../../src/domain/entities/product.entity.js';

describe('GetProductController', () => {
  it('should return 200 with the product when found', async () => {
    const mockProduct: Product = {
      id: 'prod-123',
      name: 'Wireless Mouse',
      description: 'Ergonomic',
      price: 49.99,
      stock: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const useCaseMock = new Mock<GetProductUseCase>()
      .setup((instance) => instance.execute('prod-123'))
      .returns(Promise.resolve(mockProduct));

    const reqMock = new Mock<Request<{ id: string }>>()
      .setup((instance) => instance.params)
      .returns({ id: 'prod-123' });

    const resMock = new Mock<Response>();
    resMock.setup((instance) => instance.status(200)).returns(resMock.object());
    resMock.setup((instance) => instance.json(It.IsAny())).returns(resMock.object());

    const controller = new GetProductController(useCaseMock.object());

    await controller.handle(reqMock.object(), resMock.object());

    useCaseMock.verify((instance) => instance.execute('prod-123'), Times.Once());
    resMock.verify((instance) => instance.status(200), Times.Once());
    resMock.verify(
      (instance) =>
        instance.json(It.Is((body: any) => body.data === mockProduct)),
      Times.Once()
    );
  });
});
