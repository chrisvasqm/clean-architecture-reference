import { NextFunction, Request, Response } from 'express';
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

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products = await this.listProductsUseCase.execute();
      res.status(200).json({
        data: products,
        count: products.length,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.getProductUseCase.execute(id as string);
      res.status(200).json({
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
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
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, description, price, stock } = req.body;
      const updated = await this.updateProductUseCase.execute(id as string, {
        name,
        description,
        price,
        stock,
      });
      res.status(200).json({
        data: updated,
        message: 'Product updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.deleteProductUseCase.execute(id as string);
      res.status(200).json({
        message: `Product with id "${id}" was deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  };
}
