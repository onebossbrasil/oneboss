
import React from "react";
import CsvColumnMapper from "../CsvColumnMapper";

interface CsvStep2MappingProps {
  headers: string[];
  mapping: Record<string, string>;
  setMapping: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const CsvStep2Mapping: React.FC<CsvStep2MappingProps> = ({ 
  headers, 
  mapping, 
  setMapping 
}) => {
  if (headers.length === 0) return null;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">2. Mapeie as colunas CSV para campos de produto</h3>
      <CsvColumnMapper 
        headers={headers} 
        mapping={mapping} 
        setMapping={setMapping} 
      />
    </div>
  );
};

export default CsvStep2Mapping;
