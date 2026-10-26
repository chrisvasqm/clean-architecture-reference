import { Request, Response } from 'express';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case.js';
import { createProductSchema } from '../validation/product.schema.js';

export class CreateProductController {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

  handle = async (request: Request, response: Response): Promise<void> => {
    const validated = createProductSchema.parse(request.body);
    const product = await this.createProductUseCase.execute(validated);

    response.setHeader('Location', `/api/products/${product.id}`);
    response.status(201).json({
      data: product,
      message: 'Product created successfully',
    });
  };
}
