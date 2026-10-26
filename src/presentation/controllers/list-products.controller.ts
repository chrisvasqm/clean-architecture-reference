import { Request, Response } from 'express';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case.js';

export class ListProductsController {
  constructor(private readonly listProductsUseCase: ListProductsUseCase) {}

  handle = async (_req: Request, res: Response): Promise<void> => {
    const products = await this.listProductsUseCase.execute();
    res.status(200).json({
      data: products,
      count: products.length,
    });
  };
}
