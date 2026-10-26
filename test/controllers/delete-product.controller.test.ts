import { beforeEach, describe, it } from 'vitest';
import { It, Mock, Times } from 'moq.ts';
import { Request, Response } from 'express';
import { DeleteProductController } from '../../src/presentation/controllers/delete-product.controller.js';
import { DeleteProductUseCase } from '../../src/application/use-cases/delete-product.use-case.js';

describe('DeleteProductController', () => {
  let useCaseMock: Mock<DeleteProductUseCase>;
  let responseMock: Mock<Response>;
  let controller: DeleteProductController;

  beforeEach(() => {
    useCaseMock = new Mock<DeleteProductUseCase>();
    responseMock = new Mock<Response>();
    responseMock.setup((response) => response.status(200)).returns(responseMock.object());
    responseMock.setup((response) => response.json(It.IsAny())).returns(responseMock.object());
    controller = new DeleteProductController(useCaseMock.object());
  });

  it('should return 200 with deletion message when successfully deleted', async () => {
    // Arrange
    useCaseMock.setup((useCase) => useCase.execute('prod-delete-id')).returns(Promise.resolve());

    // Act
    await controller.handle(
      { params: { id: 'prod-delete-id' } } as Request<{ id: string }>,
      responseMock.object()
    );

    // Assert
    responseMock.verify((response) => response.status(200), Times.Once());
    responseMock.verify(
      (response) =>
        response.json(
          It.Is(
            (body: any) =>
              body.message === 'Product with id "prod-delete-id" was deleted successfully'
          )
        ),
      Times.Once()
    );
  });
});
