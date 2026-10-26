import { Request, Response } from 'express';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case.js';

export class UpdateProductController {
  constructor(private readonly updateProductUseCase: UpdateProductUseCase) {}

  handle = async (request: Request<{ id: string }>, response: Response): Promise<void> => {
    const { name, description, price, stock } = request.body;
    const updated = await this.updateProductUseCase.execute(request.params.id, {
      name,
      description,
      price,
      stock,
    });

    response.status(200).json({
      data: updated,
      message: 'Product updated successfully',
    });
  };
}
