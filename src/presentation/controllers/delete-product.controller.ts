import { Request, Response } from 'express';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case.js';

export class DeleteProductController {
  constructor(private readonly deleteProductUseCase: DeleteProductUseCase) {}

  handle = async (request: Request<{ id: string }>, response: Response): Promise<void> => {
    await this.deleteProductUseCase.execute(request.params.id);
    response.status(200).json({
      message: `Product with id "${request.params.id}" was deleted successfully`,
    });
  };
}
