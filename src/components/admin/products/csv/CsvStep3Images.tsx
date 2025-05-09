
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CsvStep3ImagesProps {
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageFile: File | null;
  previewImport: () => void;
  showButton: boolean;
}

const CsvStep3Images: React.FC<CsvStep3ImagesProps> = ({ 
  handleImageUpload, 
  imageFile, 
  previewImport,
  showButton
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">3. Faça upload do arquivo ZIP com as imagens (opcional)</h3>
      <p className="text-sm text-muted-foreground">
        Se seus produtos usam imagens locais, faça upload do arquivo ZIP contendo todas as imagens.
        Caso contrário, certifique-se que a coluna de imagens no CSV contenha URLs válidas.
      </p>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Input
          type="file"
          accept=".zip"
          onChange={handleImageUpload}
          className="w-full sm:w-auto"
        />
        {imageFile && <p className="text-sm font-medium">{imageFile.name}</p>}
      </div>
      
      {showButton && (
        <div className="pt-4">
          <Button onClick={previewImport}>
            Pré-visualizar Importação
          </Button>
        </div>
      )}
    </div>
  );
};

export default CsvStep3Images;
