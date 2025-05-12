
// This file now re-exports the refactored hook for backward compatibility
import { useProductOperations } from "@/hooks/product/use-product-operations";

// Re-export for backwards compatibility
export { useProductOperations };

// Export everything from the module
export * from "./product/use-product-operations";
