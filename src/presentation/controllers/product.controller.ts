import { Request, Response } from 'express';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case.js';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case.js';
import { GetProductUseCase } from '../../application/use-cases/get-product.use-case.js';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case.js';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case.js';

export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase
  ) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const products = await this.listProductsUseCase.execute();
    res.status(200).json({
      data: products,
      count: products.length,
    });
  };

  getById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const product = await this.getProductUseCase.execute(req.params.id);
    res.status(200).json({
      data: product,
    });
  };

  create = async (req: Request, res: Response): Promise<void> => {
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

  update = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
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

  delete = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    await this.deleteProductUseCase.execute(req.params.id);
    res.status(200).json({
      message: `Product with id "${req.params.id}" was deleted successfully`,
    });
  };
}
