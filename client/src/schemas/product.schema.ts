import { z } from 'zod';

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Product name must be at least 2 characters.')
    .max(120, 'Product name must be at most 120 characters.'),
  description: z
    .string()
    .trim()
    .max(2_000, 'Description must be at most 2,000 characters.')
    .optional(),
  price: z
    .number({ message: 'Price must be a valid number.' })
    .min(0, 'Price must be a non-negative number.')
    .max(99_999_999.99, 'Price is too large.'),
  stock: z
    .number({ message: 'Stock must be an integer.' })
    .int('Stock must be a whole number.')
    .min(0, 'Stock cannot be negative.')
    .max(2_147_483_647, 'Stock is too large.'),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
