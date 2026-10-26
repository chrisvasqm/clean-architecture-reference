import { Request, Response } from 'express';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case.js';

export class UpdateProductController {
  constructor(private readonly updateProductUseCase: UpdateProductUseCase) {}

  handle = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { name, description, price, stock } = req.body;
    const updated = await this.updateProductUseCase.execute(req.params.id, {
      name,
      description,
      price,
      stock,
    });

    res.status(200).json({
      data: updated,
      message: 'Product updated successfully',
    });
  };
}
