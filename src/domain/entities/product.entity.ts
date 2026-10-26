import { ValidationError } from '../errors/domain-errors.js';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  stock?: number;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export class ProductEntity {
  static validate(properties: Partial<Product>): void {
    if (properties.name !== undefined && properties.name.trim().length < 2) {
      throw new ValidationError('Product name must be at least 2 characters long.');
    }

    if (
      properties.price !== undefined &&
      (typeof properties.price !== 'number' || Number.isNaN(properties.price) || properties.price < 0)
    ) {
      throw new ValidationError('Product price must be a non-negative number.');
    }

    if (
      properties.stock !== undefined &&
      (typeof properties.stock !== 'number' || !Number.isInteger(properties.stock) || properties.stock < 0)
    ) {
      throw new ValidationError('Product stock must be a non-negative integer.');
    }
  }

  static create(id: string, dataTransferObject: CreateProductDTO): Product {
    if (!dataTransferObject.name) {
      throw new ValidationError('Product name is required.');
    }
    if (dataTransferObject.price == null) {
      throw new ValidationError('Product price is required.');
    }

    const now = new Date();
    const product: Product = {
      id,
      name: dataTransferObject.name.trim(),
      description: dataTransferObject.description?.trim() ?? '',
      price: dataTransferObject.price,
      stock: dataTransferObject.stock ?? 0,
      createdAt: now,
      updatedAt: now,
    };

    ProductEntity.validate(product);
    return product;
  }
}
