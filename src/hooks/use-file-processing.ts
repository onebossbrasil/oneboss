
import { useState } from "react";
import { parseCSVData, createInitialMapping } from "@/utils/csvUtils";
import { ParsedCsvRow } from "@/types/csv";

export const useFileProcessing = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedCsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const csvFile = e.target.files[0];
      setFile(csvFile);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          try {
            const { headers, rows } = parseCSVData(event.target.result);
            setHeaders(headers);
            setParsedData(rows);
            setMapping(createInitialMapping(headers));
          } catch (error) {
            console.error('Error parsing CSV file:', error);
          }
        }
      };
      reader.readAsText(csvFile);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  
  const resetFiles = () => {
    setFile(null);
    setImageFile(null);
    setParsedData([]);
    setHeaders([]);
    setMapping({});
  };
  
  return {
    file,
    imageFile,
    parsedData,
    headers,
    mapping,
    setMapping,
    handleCsvUpload,
    handleImageUpload,
    resetFiles
  };
};
