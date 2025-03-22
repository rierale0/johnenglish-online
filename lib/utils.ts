// This code combines Tailwind CSS classes efficiently
// It uses clsx to merge class names and tailwind-merge to handle Tailwind-specific conflicts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// cn (className) utility function that combines multiple class values
// and resolves any Tailwind CSS conflicts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
