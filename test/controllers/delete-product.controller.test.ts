import { describe, expect, it } from 'vitest';
import { It, Mock, Times } from 'moq.ts';
import { Request, Response } from 'express';
import { DeleteProductController } from '../../src/presentation/controllers/delete-product.controller.js';
import { DeleteProductUseCase } from '../../src/application/use-cases/delete-product.use-case.js';

describe('DeleteProductController', () => {
  it('should return 200 with deletion message when successfully deleted', async () => {
    const useCaseMock = new Mock<DeleteProductUseCase>()
      .setup((instance) => instance.execute('prod-delete-id'))
      .returns(Promise.resolve());

    const reqMock = new Mock<Request<{ id: string }>>()
      .setup((instance) => instance.params)
      .returns({ id: 'prod-delete-id' });

    const resMock = new Mock<Response>();
    resMock.setup((instance) => instance.status(200)).returns(resMock.object());
    resMock.setup((instance) => instance.json(It.IsAny())).returns(resMock.object());

    const controller = new DeleteProductController(useCaseMock.object());

    await controller.handle(reqMock.object(), resMock.object());

    useCaseMock.verify((instance) => instance.execute('prod-delete-id'), Times.Once());
    resMock.verify((instance) => instance.status(200), Times.Once());
    resMock.verify(
      (instance) =>
        instance.json(
          It.Is(
            (body: any) =>
              body.message === 'Product with id "prod-delete-id" was deleted successfully'
          )
        ),
      Times.Once()
    );
  });
});
