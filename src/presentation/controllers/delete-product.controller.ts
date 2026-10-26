import { Request, Response } from 'express';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case.js';

export class DeleteProductController {
  constructor(private readonly deleteProductUseCase: DeleteProductUseCase) {}

  handle = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    await this.deleteProductUseCase.execute(req.params.id);
    res.status(200).json({
      message: `Product with id "${req.params.id}" was deleted successfully`,
    });
  };
}
