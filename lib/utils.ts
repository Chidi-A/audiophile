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

// General error formatter - returns string message
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any): string {
  if (error.name === 'ZodError') {
    const fieldErrors = error.issues.map(
      (issue: { message: string }) => issue.message
    );
    return fieldErrors.join('. ');
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
}

/**
 * Convert a value to a plain object
 * @param value - The value to convert
 * @returns The plain object
 */
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Shipping and tax constants
const SHIPPING_PRICE = 50; // $50 flat rate shipping
const TAX_RATE = 0.2; // 20% VAT

/**
 * Convert price from cents to decimal for Prisma
 */
export function convertCentsToDecimal(cents: number): number {
  return cents / 100;
}

/**
 * Calculate shipping and tax for cart
 */
export function calculateOrderPrices(itemsPrice: number) {
  const itemsPriceInDollars = convertCentsToDecimal(itemsPrice);
  const shippingPrice = SHIPPING_PRICE;
  const taxPrice = itemsPriceInDollars * TAX_RATE;
  const totalPrice = itemsPriceInDollars + shippingPrice + taxPrice;

  return {
    itemsPrice: itemsPriceInDollars,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
}
