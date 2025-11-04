import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cache } from 'react';
import { getCategoryPageData } from './actions/category-actions';
import { getProductDetailPageData } from './actions/product-detail-actions';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility function to format price from cents to display format
 */
export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toLocaleString()}`;
}

/**
 * Formats product name by removing category suffix for headphones
 * Example: "XX99 Mark II Headphones" -> "XX99 Mark II"
 * @param name - Product name
 * @param categorySlug - Category slug
 * @returns Formatted product name
 */
export function formatProductName(name: string, categorySlug: string): string {
  if (categorySlug === 'headphones') {
    return name.replace(/\s+headphones$/i, '').trim();
  }
  return name;
}

export const getCachedCategoryPageData = cache(getCategoryPageData);
export const getCachedProductDetailPageData = cache(getProductDetailPageData);
