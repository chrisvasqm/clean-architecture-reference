import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pencil, Trash2, PackageX, AlertCircle, Loader2, Search, X, Plus } from 'lucide-react';
import { Product } from '../types.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table.js';
import { Badge } from './ui/badge.js';
import { Button } from './ui/button.js';
import { Card } from './ui/card.js';
import { Input } from './ui/input.js';

interface ProductDatatableProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (ids: string[]) => void;
  onBulkDelete: () => void;
  isBulkDeleting: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onNew: () => void;
}

export const ProductDatatable: React.FC<ProductDatatableProps> = ({
  products,
  isLoading,
  isError,
  error,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onBulkDelete,
  isBulkDeleting,
  onEdit,
  onDelete,
  onNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (stockFilter === 'out_of_stock') return product.stock === 0;
      if (stockFilter === 'low_stock') return product.stock > 0 && product.stock <= 10;
      if (stockFilter === 'in_stock') return product.stock > 10;
      return true;
    });
  }, [products, searchTerm, stockFilter]);

  const selectedVisibleCount = useMemo(
    () => filteredProducts.filter((product) => selectedIds.includes(product.id)).length,
    [filteredProducts, selectedIds]
  );

  const isAllSelected =
    filteredProducts.length > 0 && selectedVisibleCount === filteredProducts.length;

  const isPartiallySelected = selectedVisibleCount > 0 && !isAllSelected;

  if (isLoading) {
    return (
      <Card className="p-8 shadow-xs border">
        <div className="space-y-4 animate-pulse">
          <div className="flex justify-between">
            <div className="h-9 bg-muted rounded-md w-1/3"></div>
            <div className="h-9 bg-muted rounded-md w-1/4"></div>
          </div>
          <div className="h-64 bg-muted/60 rounded-md"></div>
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/40 bg-destructive/5 p-8 text-center shadow-xs">
        <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
        <h3 className="font-semibold text-foreground text-sm">Failed to load products</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          {error?.message || 'Unable to retrieve inventory data from server.'}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search & Stock Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'in_stock', 'low_stock', 'out_of_stock'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStockFilter(filter)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                stockFilter === filter
                  ? 'bg-secondary text-secondary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              {filter === 'all' && 'All'}
              {filter === 'in_stock' && 'In Stock'}
              {filter === 'low_stock' && 'Low Stock (≤10)'}
              {filter === 'out_of_stock' && 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Bar with smooth motion */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between rounded-lg border bg-secondary/80 px-4 py-2 text-xs shadow-xs">
              <span className="font-medium text-secondary-foreground">
                {selectedIds.length} {selectedIds.length === 1 ? 'product' : 'products'} selected
              </span>

              <Button
                variant="destructive"
                size="sm"
                onClick={onBulkDelete}
                disabled={isBulkDeleting}
                className="h-7 text-xs gap-1.5 cursor-pointer"
              >
                {isBulkDeleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                <span>Delete Selected</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Datatable */}
      <Card className="overflow-hidden shadow-xs border">
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="p-12 text-center text-muted-foreground"
          >
            <PackageX className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <h4 className="font-semibold text-foreground text-sm">No products found</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              {searchTerm || stockFilter !== 'all'
                ? 'Try adjusting your search terms or filter selection.'
                : 'Your inventory is currently empty. Get started by adding a product.'}
            </p>
            {!searchTerm && stockFilter === 'all' && (
              <Button size="sm" onClick={onNew} className="mt-4 gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>Add Product</span>
              </Button>
            )}
          </motion.div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isPartiallySelected;
                    }}
                    onChange={() => onToggleSelectAll(filteredProducts.map((product) => product.id))}
                    className="h-4 w-4 rounded border-input accent-primary cursor-pointer align-middle"
                    aria-label="Select all products"
                  />
                </TableHead>
                <TableHead className="w-[45%] text-xs">Product</TableHead>
                <TableHead className="text-xs">Price</TableHead>
                <TableHead className="text-xs">Stock</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-right text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product, index) => {
                const isSelected = selectedIds.includes(product.id);
                const isOut = product.stock === 0;
                const isLow = product.stock > 0 && product.stock <= 10;

                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(index * 0.025, 0.25),
                      ease: 'easeOut',
                    }}
                    className={`border-b transition-colors hover:bg-muted/40 ${
                      isSelected ? 'bg-muted/50' : ''
                    }`}
                  >
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(product.id)}
                        className="h-4 w-4 rounded border-input accent-primary cursor-pointer align-middle"
                        aria-label={`Select ${product.name}`}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="font-medium text-foreground text-sm">{product.name}</div>
                      {product.description && (
                        <div className="text-xs text-muted-foreground truncate max-w-sm mt-0.5">
                          {product.description}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="font-semibold text-foreground text-sm">
                      ${product.price.toFixed(2)}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {product.stock} units
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={isOut ? 'destructive' : isLow ? 'warning' : 'success'}
                        className="text-xs font-normal"
                      >
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="inline-flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(product)}
                          title="Edit Product"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(product)}
                          title="Delete Product"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};
