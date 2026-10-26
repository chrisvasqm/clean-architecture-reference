import { Request, Response } from 'express';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case.js';

export class CreateProductController {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    const { name, description, price, stock } = req.body;
    const product = await this.createProductUseCase.execute({
      name,
      description,
      price,
      stock,
    });

    res.status(201).json({
      data: product,
      message: 'Product created successfully',
    });
  };
}
