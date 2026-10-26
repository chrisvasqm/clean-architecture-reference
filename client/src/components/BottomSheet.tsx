import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2 } from 'lucide-react';
import { Product, CreateProductDTO, UpdateProductDTO } from '../types.js';
import { productFormSchema } from '../schemas/product.schema.js';
import { Button } from './ui/button.js';
import { Input } from './ui/input.js';
import { Textarea } from './ui/textarea.js';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductDTO | UpdateProductDTO) => Promise<void>;
  initialData?: Product | null;
  isSubmitting: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setPrice(String(initialData.price));
      setStock(String(initialData.stock ?? 0));
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setStock('0');
    }
    setFieldErrors({});
    setApiError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setApiError(null);

    // Frontend Zod validation
    const result = productFormSchema.safeParse({
      name,
      description: description.trim(),
      price: price === '' ? undefined : Number(price),
      stock: stock === '' ? undefined : Number(stock),
    });

    if (!result.success) {
      const errors: { [key: string]: string } = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0]?.toString() || 'form';
        if (!errors[fieldName]) {
          errors[fieldName] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    try {
      await onSubmit({
        name: result.data.name,
        description: result.data.description,
        price: result.data.price,
        stock: result.data.stock,
      });
      onClose();
    } catch (err: any) {
      setApiError(err.message || 'An error occurred while saving the product');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop with 300ms smooth fade in/out */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={onClose}
          />

          {/* Bottom Sheet Modal with 350ms slide up */}
          <motion.div
            className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl border-t bg-background shadow-2xl p-6 pb-8"
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.5 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Grab handle affordance */}
            <div className="w-12 h-1.5 rounded-full bg-muted-foreground/25 mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {isEdit ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isEdit
                    ? 'Update product pricing, inventory quantity, or description.'
                    : 'Enter details to add an item to your active inventory.'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {apiError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
                  {apiError}
                </div>
              )}

              {/* Name field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Product Name <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Ergonomic Mechanical Keyboard"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) {
                      setFieldErrors((prev) => ({ ...prev, name: '' }));
                    }
                  }}
                  className={fieldErrors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {fieldErrors.name && (
                  <p className="text-xs text-destructive">{fieldErrors.name}</p>
                )}
              </div>

              {/* Description field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Description
                </label>
                <Textarea
                  rows={3}
                  placeholder="Key features, specifications, and warranty information..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Price & Stock fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Price ($) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="99.99"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (fieldErrors.price) {
                        setFieldErrors((prev) => ({ ...prev, price: '' }));
                      }
                    }}
                    className={fieldErrors.price ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {fieldErrors.price && (
                    <p className="text-xs text-destructive">{fieldErrors.price}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Stock Quantity <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    step="1"
                    placeholder="25"
                    value={stock}
                    onChange={(e) => {
                      setStock(e.target.value);
                      if (fieldErrors.stock) {
                        setFieldErrors((prev) => ({ ...prev, stock: '' }));
                      }
                    }}
                    className={fieldErrors.stock ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {fieldErrors.stock && (
                    <p className="text-xs text-destructive">{fieldErrors.stock}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
                  <span>{isEdit ? 'Save Changes' : 'Create Product'}</span>
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
