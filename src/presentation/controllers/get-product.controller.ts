import { Request, Response } from 'express';
import { GetProductUseCase } from '../../application/use-cases/get-product.use-case.js';

export class GetProductController {
  constructor(private readonly getProductUseCase: GetProductUseCase) {}

  handle = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const product = await this.getProductUseCase.execute(req.params.id);
    res.status(200).json({
      data: product,
    });
  };
}
