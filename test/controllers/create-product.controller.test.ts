import { describe, expect, it } from 'vitest';
import { It, Mock, Times } from 'moq.ts';
import { Request, Response } from 'express';
import { CreateProductController } from '../../src/presentation/controllers/create-product.controller.js';
import { CreateProductUseCase } from '../../src/application/use-cases/create-product.use-case.js';
import { CreateProductDTO, Product } from '../../src/domain/entities/product.entity.js';

describe('CreateProductController', () => {
  it('should return 201 with created product and success message', async () => {
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

    const useCaseMock = new Mock<CreateProductUseCase>()
      .setup((instance) =>
        instance.execute(
          It.Is(
            (dto: CreateProductDTO) =>
              dto.name === payload.name &&
              dto.description === payload.description &&
              dto.price === payload.price &&
              dto.stock === payload.stock
          )
        )
      )
      .returns(Promise.resolve(createdProduct));

    const reqMock = new Mock<Request>()
      .setup((instance) => instance.body)
      .returns(payload);

    const resMock = new Mock<Response>();
    resMock.setup((instance) => instance.status(201)).returns(resMock.object());
    resMock.setup((instance) => instance.json(It.IsAny())).returns(resMock.object());

    const controller = new CreateProductController(useCaseMock.object());

    await controller.handle(reqMock.object(), resMock.object());

    useCaseMock.verify(
      (instance) => instance.execute(It.IsAny()),
      Times.Once()
    );
    resMock.verify((instance) => instance.status(201), Times.Once());
    resMock.verify(
      (instance) =>
        instance.json(
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
