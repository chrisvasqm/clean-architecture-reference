import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string({ message: 'Product name is required.' })
    .trim()
    .min(1, 'Product name is required.')
    .min(2, 'Product name must be at least 2 characters long.'),
  description: z.string().trim().optional().default(''),
  price: z
    .number({ message: 'Product price is required.' })
    .min(0, 'Product price must be a non-negative number.'),
  stock: z
    .number()
    .int('Product stock must be an integer.')
    .min(0, 'Product stock must be a non-negative integer.')
    .optional()
    .default(0),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Product name must be at least 2 characters long.')
    .optional(),
  description: z.string().trim().optional(),
  price: z
    .number()
    .min(0, 'Product price must be a non-negative number.')
    .optional(),
  stock: z
    .number()
    .int('Product stock must be an integer.')
    .min(0, 'Product stock must be a non-negative integer.')
    .optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
