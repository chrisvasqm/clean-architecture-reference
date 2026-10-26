import { z } from 'zod';

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Product name is required.')
    .min(2, 'Product name must be at least 2 characters.'),
  description: z.string().trim().optional(),
  price: z
    .number({ message: 'Price must be a valid number.' })
    .min(0, 'Price must be a non-negative number.'),
  stock: z
    .number({ message: 'Stock must be an integer.' })
    .int('Stock must be a whole number.')
    .min(0, 'Stock cannot be negative.'),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
