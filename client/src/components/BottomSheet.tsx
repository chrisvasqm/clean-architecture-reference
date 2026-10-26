import React, { useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { X, Loader2 } from 'lucide-react';
import { Product } from '../types.js';
import { ProductFormValues, productFormSchema } from '../schemas/product.schema.js';
import { getErrorMessage } from '../lib/utils.js';
import { Button } from './ui/button.js';
import { Input } from './ui/input.js';
import { Textarea } from './ui/textarea.js';

type ProductField = keyof ProductFormValues | 'form';
type ProductFieldErrors = Partial<Record<ProductField, string>>;

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  initialData?: Product | null;
  isSubmitting: boolean;
}

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

interface ProductFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  type?: 'text' | 'number';
  step?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

function collectFieldErrors(
  issues: { path: PropertyKey[]; message: string }[]
): ProductFieldErrors {
  const errors: ProductFieldErrors = {};

  for (const issue of issues) {
    const fieldName =
      (issue.path[0]?.toString() as ProductField | undefined) ?? 'form';
    if (!errors[fieldName]) {
      errors[fieldName] = issue.message;
    }
  }

  return errors;
}

const ProductField: React.FC<ProductFieldProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  required = false,
  type = 'text',
  step,
  placeholder,
  multiline = false,
  rows,
}) => {
  const errorId = `${id}-error`;
  const fieldClassName = error
    ? 'border-destructive focus-visible:ring-destructive'
    : '';
  const accessibilityProps = {
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId : undefined,
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {multiline ? (
        <Textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClassName}
          {...accessibilityProps}
        />
      ) : (
        <Input
          id={id}
          type={type}
          step={step}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClassName}
          {...accessibilityProps}
        />
      )}
      {error && (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
}) => {
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [price, setPrice] = useState(initialData ? String(initialData.price) : '');
  const [stock, setStock] = useState(String(initialData?.stock ?? 0));
  const [fieldErrors, setFieldErrors] = useState<ProductFieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const isEdit = Boolean(initialData);

  const fieldSetters = {
    name: setName,
    price: setPrice,
    stock: setStock,
  };

  const handleFieldChange = (field: keyof typeof fieldSetters, value: string) => {
    fieldSetters[field](value);
    setFieldErrors((previousErrors) =>
      previousErrors[field] ? { ...previousErrors, [field]: '' } : previousErrors
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFieldErrors({});
    setApiError(null);

    const result = productFormSchema.safeParse({
      name,
      description: description.trim(),
      price: price === '' ? undefined : Number(price),
      stock: stock === '' ? undefined : Number(stock),
    });

    if (!result.success) {
      setFieldErrors(collectFieldErrors(result.error.issues));
      return;
    }

    try {
      await onSubmit(result.data);
      onClose();
    } catch (error) {
      setApiError(
        getErrorMessage(error, 'An error occurred while saving the product')
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      {apiError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive"
        >
          {apiError}
        </div>
      )}

      <ProductField
        id="product-name"
        label="Product Name"
        required
        placeholder="e.g. Ergonomic Mechanical Keyboard"
        value={name}
        onChange={(value) => handleFieldChange('name', value)}
        error={fieldErrors.name}
      />

      <ProductField
        id="product-description"
        label="Description"
        placeholder="Key features, specifications, and warranty information..."
        value={description}
        onChange={setDescription}
        multiline
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <ProductField
          id="product-price"
          label="Price ($)"
          required
          type="number"
          step="0.01"
          placeholder="99.99"
          value={price}
          onChange={(value) => handleFieldChange('price', value)}
          error={fieldErrors.price}
        />

        <ProductField
          id="product-stock"
          label="Stock Quantity"
          required
          type="number"
          step="1"
          placeholder="25"
          value={stock}
          onChange={(value) => handleFieldChange('stock', value)}
          error={fieldErrors.stock}
        />
      </div>

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
  );
};

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}) => {
  const isEdit = Boolean(initialData);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <m.button
            type="button"
            aria-label="Close product form"
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={onClose}
          />

          <m.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-sheet-title"
            className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl border-t bg-background shadow-2xl p-6 pb-8"
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.5 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-12 h-1.5 rounded-full bg-muted-foreground/25 mx-auto mb-4" />

            <div className="flex items-start justify-between pb-4 border-b">
              <div>
                <h2
                  id="product-sheet-title"
                  className="text-lg font-semibold tracking-tight text-foreground"
                >
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

            <ProductForm
              key={initialData?.id ?? 'new'}
              initialData={initialData}
              onSubmit={onSubmit}
              onClose={onClose}
              isSubmitting={isSubmitting}
            />
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};
