
import { supabase } from "@/integrations/supabase/client";

export const logServiceAction = (action: string, details?: any) => {
  console.log(`Category Service - ${action}:`, details || '');
};
