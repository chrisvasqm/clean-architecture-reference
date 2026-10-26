import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../api/products.js';
import { CreateProductDTO, UpdateProductDTO } from '../types.js';

export const PRODUCT_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_KEYS.all, 'list'] as const,
  detail: (id: string | null) => [...PRODUCT_KEYS.all, 'detail', id] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: PRODUCT_KEYS.lists(),
    queryFn: productApi.list,
  });
}

export function useProduct(id: string | null) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => (id ? productApi.getById(id) : Promise.reject('No ID provided')),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductDTO) => productApi.create(payload),
    onSuccess: (newProduct) => {
      // Invalidate list cache
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      // Pre-populate individual detail cache
      queryClient.setQueryData(PRODUCT_KEYS.detail(newProduct.id), newProduct);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductDTO }) =>
      productApi.update(id, payload),
    onSuccess: (updatedProduct) => {
      // Invalidate list so that changed name/price/stock reflects
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      // Update individual product cache immediately
      queryClient.setQueryData(PRODUCT_KEYS.detail(updatedProduct.id), updatedProduct);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: (_result, deletedId) => {
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      // Remove detail entry from cache
      queryClient.removeQueries({ queryKey: PRODUCT_KEYS.detail(deletedId) });
    },
  });
}
