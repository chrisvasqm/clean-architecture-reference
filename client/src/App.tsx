import React, { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
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
import { Product } from './types.js';
import { ProductFormValues } from './schemas/product.schema.js';
import { getErrorMessage } from './lib/utils.js';

export const App: React.FC = () => {
  // Bottom sheet state (Create or Edit)
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Selected checkboxes for bulk deletion
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  useEffect(() => {
    if (!notification) return;

    const timeout = setTimeout(() => setNotification(null), 3500);
    return () => clearTimeout(timeout);
  }, [notification]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const handleOpenNew = () => {
    setEditingProduct(null);
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsSheetOpen(true);
  };

  const handleSheetSubmit = async (formData: ProductFormValues) => {
    if (editingProduct) {
      await updateMutation.mutateAsync({
        id: editingProduct.id,
        payload: formData,
      });
      showNotification('success', `"${formData.name}" updated successfully`);
    } else {
      await createMutation.mutateAsync(formData);
      showNotification('success', `"${formData.name}" added successfully`);
    }
  };

  const handleDeleteSingle = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      const [result] = await deleteMutation.mutateAsync([product.id]);
      if (result.status === 'rejected') {
        throw result.reason;
      }
      setSelectedIds((previousIds) => previousIds.filter((id) => id !== product.id));
      showNotification('success', `"${product.name}" deleted`);
    } catch (error) {
      showNotification('error', getErrorMessage(error, 'Failed to delete product'));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((previousIds) => {
      const selectedIdSet = new Set(previousIds);
      if (selectedIdSet.has(id)) {
        selectedIdSet.delete(id);
      } else {
        selectedIdSet.add(id);
      }
      return Array.from(selectedIdSet);
    });
  };

  const handleToggleSelectAll = (ids: string[]) => {
    setSelectedIds((previousIds) => {
      const previousIdSet = new Set(previousIds);
      const targetIdSet = new Set(ids);
      const allSelected =
        ids.length > 0 && ids.every((id) => previousIdSet.has(id));

      if (allSelected) {
        return previousIds.filter((id) => !targetIdSet.has(id));
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

    try {
      const results = await deleteMutation.mutateAsync(selectedIds);
      const succeededIds = selectedIds.filter(
        (_id, index) => results[index]?.status === 'fulfilled'
      );
      const failedCount = results.length - succeededIds.length;
      const succeededIdSet = new Set(succeededIds);

      setSelectedIds((previousIds) =>
        previousIds.filter((id) => !succeededIdSet.has(id))
      );

      if (failedCount === 0) {
        showNotification('success', `Successfully deleted ${succeededIds.length} item(s)`);
      } else if (succeededIds.length === 0) {
        showNotification('error', 'Failed to delete the selected items');
      } else {
        showNotification(
          'error',
          `Deleted ${succeededIds.length} item(s); ${failedCount} failed`
        );
      }
    } catch (error) {
      showNotification('error', getErrorMessage(error, 'Failed to complete deletion'));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      {/* 1. Navbar */}
      <Navbar onOpenNew={handleOpenNew} productCount={data?.count} />

      {/* Main Content Area with 350ms smooth fade in */}
      <m.main
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-4"
      >
        {/* Toast Notification with 300ms motion */}
        <AnimatePresence>
          {notification && (
            <m.div
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
                type="button"
                onClick={() => setNotification(null)}
                aria-label="Dismiss notification"
                className="text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </m.div>
          )}
        </AnimatePresence>

        {/* 2. Datatable with columns, rows, checkboxes and bulk deletion */}
        <ProductDatatable
          products={data?.products ?? []}
          isLoading={isLoading}
          isError={isError}
          error={error}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onBulkDelete={handleBulkDelete}
          isBulkDeleting={deleteMutation.isPending}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteSingle}
          onNew={handleOpenNew}
        />
      </m.main>

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
