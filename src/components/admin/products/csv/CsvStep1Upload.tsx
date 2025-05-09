
import React from "react";
import { Input } from "@/components/ui/input";

interface CsvStep1UploadProps {
  handleCsvUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
}

const CsvStep1Upload: React.FC<CsvStep1UploadProps> = ({ handleCsvUpload, file }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">1. Faça upload do arquivo CSV</h3>
      <p className="text-sm text-muted-foreground">
        O arquivo CSV deve conter cabeçalhos para nome, preço, descrição, categoria, subcategorias e imagens.
      </p>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
        <Input
          type="file"
          accept=".csv"
          onChange={handleCsvUpload}
          className="w-full sm:w-auto"
        />
        {file && <p className="text-sm font-medium">{file.name}</p>}
      </div>
    </div>
  );
};

export default CsvStep1Upload;
