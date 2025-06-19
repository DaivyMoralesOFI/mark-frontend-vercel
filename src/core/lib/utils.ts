// utils.ts
//
// This file provides utility functions for class name merging and conditional class application.
// It is used to compose Tailwind CSS class names in a clean and maintainable way.

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * cn
 *
 * Utility function to merge and deduplicate class names using clsx and tailwind-merge.
 * Useful for conditionally applying Tailwind CSS classes in React components.
 *
 * @param inputs List of class values (strings, arrays, objects)
 * @returns {string} Merged class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
