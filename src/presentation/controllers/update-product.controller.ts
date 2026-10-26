import { Request, Response } from 'express';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case.js';
import { createProductSchema, updateProductSchema } from '../validation/product.schema.js';

export class UpdateProductController {
  constructor(private readonly updateProductUseCase: UpdateProductUseCase) {}

  handle = async (request: Request<{ id: string }>, response: Response): Promise<void> => {
    const payloadSchema = request.method === 'PUT' ? createProductSchema : updateProductSchema;
    const validated = payloadSchema.parse(request.body);
    const updated = await this.updateProductUseCase.execute(request.params.id, validated);

    response.status(200).json({
      data: updated,
      message: 'Product updated successfully',
    });
  };
}
