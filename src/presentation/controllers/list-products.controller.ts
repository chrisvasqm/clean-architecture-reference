import { Request, Response } from 'express';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case.js';

export class ListProductsController {
  constructor(private readonly listProductsUseCase: ListProductsUseCase) {}

  handle = async (_request: Request, response: Response): Promise<void> => {
    const products = await this.listProductsUseCase.execute();
    response.status(200).json({
      data: products,
      count: products.length,
    });
  };
}
