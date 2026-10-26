import { z } from 'zod';

const MAXIMUM_PRICE = 99_999_999.99;
const MAXIMUM_STOCK = 2_147_483_647;

const productNameSchema = z
  .string({ message: 'Product name is required.' })
  .trim()
  .min(2, 'Product name must be at least 2 characters long.')
  .max(120, 'Product name must be at most 120 characters long.');

const productDescriptionSchema = z
  .string()
  .trim()
  .max(2_000, 'Product description must be at most 2,000 characters long.');

const productPriceSchema = z
  .number({ message: 'Product price is required.' })
  .min(0, 'Product price must be a non-negative number.')
  .max(MAXIMUM_PRICE, 'Product price is too large.');

const productStockSchema = z
  .number({ message: 'Product stock is required.' })
  .int('Product stock must be an integer.')
  .min(0, 'Product stock must be a non-negative integer.')
  .max(MAXIMUM_STOCK, 'Product stock is too large.');

export const createProductSchema = z.object({
  name: productNameSchema,
  description: productDescriptionSchema.optional().default(''),
  price: productPriceSchema,
  stock: productStockSchema.optional().default(0),
});

export const updateProductSchema = z
  .object({
    name: productNameSchema.optional(),
    description: productDescriptionSchema.optional(),
    price: productPriceSchema.optional(),
    stock: productStockSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one product field must be provided.',
  });
