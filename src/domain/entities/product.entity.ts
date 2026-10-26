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
  static validate(props: Partial<Product>): void {
    if (props.name !== undefined) {
      if (!props.name || props.name.trim().length < 2) {
        throw new ValidationError('Product name must be at least 2 characters long.');
      }
    }

    if (props.price !== undefined) {
      if (typeof props.price !== 'number' || Number.isNaN(props.price) || props.price < 0) {
        throw new ValidationError('Product price must be a non-negative number.');
      }
    }

    if (props.stock !== undefined) {
      if (
        typeof props.stock !== 'number' ||
        !Number.isInteger(props.stock) ||
        props.stock < 0
      ) {
        throw new ValidationError('Product stock must be a non-negative integer.');
      }
    }
  }

  static create(id: string, dto: CreateProductDTO): Product {
    if (!dto.name) {
      throw new ValidationError('Product name is required.');
    }
    if (dto.price === undefined || dto.price === null) {
      throw new ValidationError('Product price is required.');
    }

    const now = new Date();
    const product: Product = {
      id,
      name: dto.name.trim(),
      description: dto.description?.trim() ?? '',
      price: dto.price,
      stock: dto.stock ?? 0,
      createdAt: now,
      updatedAt: now,
    };

    ProductEntity.validate(product);
    return product;
  }
}
