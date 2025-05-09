
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface CsvSuccessMessageProps {
  resetForm: () => void;
}

const CsvSuccessMessage: React.FC<CsvSuccessMessageProps> = ({ resetForm }) => {
  return (
    <div className="space-y-4 text-center py-8">
      <div className="flex justify-center">
        <div className="bg-green-100 p-4 rounded-full">
          <Check className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <h3 className="text-xl font-medium">Importação concluída com sucesso!</h3>
      <p className="text-muted-foreground">Todos os produtos foram importados e estão disponíveis na loja.</p>
      <Button onClick={resetForm}>
        Realizar nova importação
      </Button>
    </div>
  );
};

export default CsvSuccessMessage;
