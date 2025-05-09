
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type ProductImage = {
  id: string;
  url: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string | null;
  subcategoryValues: Record<string, string>;
  featured: boolean;
  stockQuantity: number;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
};

type ProductContextType = {
  products: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'images'>, images: File[]) => Promise<void>;
  updateProduct: (id: string, productData: Partial<Product>, newImages?: File[]) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch products from Supabase
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        throw productsError;
      }

      // Fetch all product images
      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .order('sort_order');

      if (imagesError) {
        throw imagesError;
      }

      // Map images to their products
      const imagesByProduct: Record<string, ProductImage[]> = {};
      
      imagesData.forEach((image: any) => {
        if (!imagesByProduct[image.product_id]) {
          imagesByProduct[image.product_id] = [];
        }
        
        imagesByProduct[image.product_id].push({
          id: image.id,
          url: image.url,
          sortOrder: image.sort_order
        });
      });

      // Create final products array with images
      const formattedProducts: Product[] = productsData.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: parseFloat(product.price),
        categoryId: product.category_id,
        subcategoryValues: product.subcategory_values || {},
        featured: product.featured || false,
        stockQuantity: product.stock_quantity || 0,
        images: imagesByProduct[product.id] || [],
        createdAt: product.created_at,
        updatedAt: product.updated_at
      }));

      setProducts(formattedProducts);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message);
      toast({
        title: 'Erro ao carregar produtos',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProductImage = async (productId: string, imageFile: File, sortOrder: number = 0) => {
    try {
      // Create a unique file name
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, imageFile);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);
      
      const publicUrl = urlData.publicUrl;
      
      // Save image information to the database
      const { data: imageData, error: imageError } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          url: publicUrl,
          sort_order: sortOrder
        })
        .select()
        .single();
      
      if (imageError) throw imageError;
      
      return imageData;
    } catch (err) {
      console.error('Error uploading product image:', err);
      throw err;
    }
  };

  const addProduct = async (
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'images'>, 
    images: File[]
  ) => {
    try {
      setIsLoading(true);
      
      // Insert new product
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          description: product.description,
          price: product.price,
          category_id: product.categoryId,
          subcategory_values: product.subcategoryValues,
          featured: product.featured,
          stock_quantity: product.stockQuantity
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Upload images if any
      if (images.length > 0) {
        await Promise.all(
          images.map((image, index) => 
            uploadProductImage(data.id, image, index)
          )
        );
      }
      
      // Refresh products list
      await fetchProducts();
      
      toast({
        title: 'Produto adicionado',
        description: `${product.name} foi adicionado com sucesso.`,
      });
    } catch (err: any) {
      console.error('Error adding product:', err);
      toast({
        title: 'Erro ao adicionar produto',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (
    id: string, 
    productData: Partial<Product>, 
    newImages?: File[]
  ) => {
    try {
      setIsLoading(true);
      
      // Prepare product data for update
      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString()
      };
      
      if (productData.name !== undefined) updateData.name = productData.name;
      if (productData.description !== undefined) updateData.description = productData.description;
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.categoryId !== undefined) updateData.category_id = productData.categoryId;
      if (productData.subcategoryValues !== undefined) updateData.subcategory_values = productData.subcategoryValues;
      if (productData.featured !== undefined) updateData.featured = productData.featured;
      if (productData.stockQuantity !== undefined) updateData.stock_quantity = productData.stockQuantity;
      
      // Update product in database
      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);
        
      if (error) throw error;
      
      // Upload new images if any
      if (newImages && newImages.length > 0) {
        // Get current number of images to determine sort_order for new ones
        const { data: existingImages } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', id);
          
        const startSortOrder = existingImages ? existingImages.length : 0;
        
        await Promise.all(
          newImages.map((image, index) => 
            uploadProductImage(id, image, startSortOrder + index)
          )
        );
      }
      
      // Refresh products list
      await fetchProducts();
      
      toast({
        title: 'Produto atualizado',
        description: 'O produto foi atualizado com sucesso.',
      });
    } catch (err: any) {
      console.error('Error updating product:', err);
      toast({
        title: 'Erro ao atualizar produto',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Delete product (images will be automatically deleted due to CASCADE)
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Refresh products list
      await fetchProducts();
      
      toast({
        title: 'Produto removido',
        description: 'O produto foi removido com sucesso.',
      });
    } catch (err: any) {
      console.error('Error deleting product:', err);
      toast({
        title: 'Erro ao remover produto',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProducts = () => fetchProducts();

  // Get featured products as a computed property
  const featuredProducts = products.filter(product => product.featured);

  return (
    <ProductContext.Provider value={{
      products,
      featuredProducts,
      isLoading,
      error,
      addProduct,
      updateProduct,
      deleteProduct,
      refreshProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
