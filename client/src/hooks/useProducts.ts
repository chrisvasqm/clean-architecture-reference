import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../api/products.js';
import { CreateProductDTO, UpdateProductDTO } from '../types.js';

export const PRODUCT_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_KEYS.all, 'list'] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: PRODUCT_KEYS.lists(),
    queryFn: productApi.list,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductDTO) => productApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductDTO }) =>
      productApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      Promise.allSettled(ids.map((id) => productApi.delete(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
    },
  });
}
