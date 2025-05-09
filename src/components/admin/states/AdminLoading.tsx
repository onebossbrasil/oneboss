
import React from "react";
import { Loader2 } from "lucide-react";

const AdminLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p>Carregando...</p>
    </div>
  );
};

export default AdminLoading;
