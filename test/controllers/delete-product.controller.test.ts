import { beforeEach, describe, it } from 'vitest';
import { It, Mock, Times } from 'moq.ts';
import { Request, Response } from 'express';
import { DeleteProductController } from '../../src/presentation/controllers/delete-product.controller.js';
import { DeleteProductUseCase } from '../../src/application/use-cases/delete-product.use-case.js';

describe('DeleteProductController', () => {
  let useCaseMock: Mock<DeleteProductUseCase>;
  let resMock: Mock<Response>;
  let controller: DeleteProductController;

  beforeEach(() => {
    useCaseMock = new Mock<DeleteProductUseCase>();
    resMock = new Mock<Response>();
    resMock.setup((r) => r.status(200)).returns(resMock.object());
    resMock.setup((r) => r.json(It.IsAny())).returns(resMock.object());
    controller = new DeleteProductController(useCaseMock.object());
  });

  it('should return 200 with deletion message when successfully deleted', async () => {
    // Arrange
    useCaseMock.setup((u) => u.execute('prod-delete-id')).returns(Promise.resolve());

    // Act
    await controller.handle(
      { params: { id: 'prod-delete-id' } } as Request<{ id: string }>,
      resMock.object()
    );

    // Assert
    resMock.verify((r) => r.status(200), Times.Once());
    resMock.verify(
      (r) =>
        r.json(
          It.Is(
            (b: any) =>
              b.message === 'Product with id "prod-delete-id" was deleted successfully'
          )
        ),
      Times.Once()
    );
  });
});
