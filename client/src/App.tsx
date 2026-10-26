import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Navbar } from './components/Navbar.js';
import { ProductDatatable } from './components/ProductDatatable.js';
import { BottomSheet } from './components/BottomSheet.js';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from './hooks/useProducts.js';
import { CreateProductDTO, Product, UpdateProductDTO } from './types.js';

export const App: React.FC = () => {
  // Bottom sheet state (Create or Edit)
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Selected checkboxes for bulk deletion
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Notification toast
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // TanStack Query hooks (behind the scenes caching)
  const { data, isLoading, isError, error } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  const handleOpenNew = () => {
    setEditingProduct(null);
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsSheetOpen(true);
  };

  const handleSheetSubmit = async (formData: CreateProductDTO | UpdateProductDTO) => {
    if (editingProduct) {
      await updateMutation.mutateAsync({
        id: editingProduct.id,
        payload: formData,
      });
      showNotification('success', `"${formData.name}" updated successfully`);
    } else {
      await createMutation.mutateAsync(formData as CreateProductDTO);
      showNotification('success', `"${formData.name}" added successfully`);
    }
  };

  const handleDeleteSingle = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(product.id);
      setSelectedIds((prev) => prev.filter((id) => id !== product.id));
      showNotification('success', `"${product.name}" deleted`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete product');
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (ids: string[]) => {
    setSelectedIds((previousIds) => {
      const allSelected = ids.length > 0 && ids.every((id) => previousIds.includes(id));
      if (allSelected) {
        return previousIds.filter((id) => !ids.includes(id));
      }
      return Array.from(new Set([...previousIds, ...ids]));
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected item(s)?`
      )
    ) {
      return;
    }

    setIsBulkDeleting(true);
    try {
      await Promise.all(selectedIds.map((id) => deleteMutation.mutateAsync(id)));
      showNotification(
        'success',
        `Successfully deleted ${selectedIds.length} item(s)`
      );
      setSelectedIds([]);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to complete deletion');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      {/* 1. Navbar */}
      <Navbar onOpenNew={handleOpenNew} productCount={data?.count} />

      {/* Main Content Area with 350ms smooth fade in */}
      <motion.main
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-4"
      >
        {/* Toast Notification with 300ms motion */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`p-3 rounded-lg border flex items-center justify-between shadow-xs ${
                notification.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                  : 'bg-destructive/10 border-destructive/20 text-destructive'
              }`}
            >
              <div className="flex items-center space-x-2 text-xs font-medium">
                {notification.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                )}
                <span>{notification.message}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. Datatable with columns, rows, checkboxes and bulk deletion */}
        <ProductDatatable
          products={data?.products ?? []}
          isLoading={isLoading}
          isError={isError}
          error={error as Error}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onBulkDelete={handleBulkDelete}
          isBulkDeleting={isBulkDeleting}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteSingle}
          onNew={handleOpenNew}
        />
      </motion.main>

      {/* 3. Bottom Sheet Modal for Product Form (Create / Edit) */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSubmit={handleSheetSubmit}
        initialData={editingProduct}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};
