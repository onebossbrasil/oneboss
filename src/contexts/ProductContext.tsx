
// This file is deprecated - contexts have been moved to specific providers
// Import the specific provider you need:
// - FeaturedProductProvider for featured products only
// - AdminProductProvider for admin area
// - StoreProductProvider for store area

// Legacy re-export for backward compatibility (will be removed)
import { ProductProvider, useProducts } from './product';

export { ProductProvider, useProducts };
