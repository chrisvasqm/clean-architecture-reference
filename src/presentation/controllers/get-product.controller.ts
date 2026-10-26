import { Request, Response } from 'express';
import { GetProductUseCase } from '../../application/use-cases/get-product.use-case.js';

export class GetProductController {
  constructor(private readonly getProductUseCase: GetProductUseCase) {}

  handle = async (request: Request<{ id: string }>, response: Response): Promise<void> => {
    const product = await this.getProductUseCase.execute(request.params.id);
    response.status(200).json({
      data: product,
    });
  };
}
