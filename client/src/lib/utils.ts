import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const LOW_STOCK_THRESHOLD = 10;

export type StockStatus = 'out_of_stock' | 'low_stock' | 'in_stock';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStockStatus(stock: number): StockStatus {
  if (stock === 0) {
    return 'out_of_stock';
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return 'low_stock';
  }
  return 'in_stock';
}

export function getErrorMessage(error: unknown, fallbackMessage: string): string {
  return error instanceof Error && error.message ? error.message : fallbackMessage;
}
