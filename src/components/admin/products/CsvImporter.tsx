
import { Card, CardContent } from "@/components/ui/card";
import { useCsvImport } from "@/hooks/use-csv-import";
import CsvStep1Upload from "./csv/CsvStep1Upload";
import CsvStep2Mapping from "./csv/CsvStep2Mapping";
import CsvStep3Images from "./csv/CsvStep3Images";
import CsvPreviewImport from "./csv/CsvPreviewImport";
import CsvSuccessMessage from "./csv/CsvSuccessMessage";
import CsvErrorAlert from "./csv/CsvErrorAlert";

const CsvImporter = () => {
  const {
    file,
    imageFile,
    headers,
    mapping,
    setMapping,
    parsedData,
    previewMode,
    setPreviewMode,
    importedProducts,
    errors,
    success,
    isImporting,
    handleCsvUpload,
    handleImageUpload,
    previewImport,
    processImport,
    resetForm
  } = useCsvImport();
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-playfair font-semibold">Importação em massa de produtos</h2>
          
          {!previewMode && !success && (
            <ImportSteps 
              file={file}
              imageFile={imageFile}
              headers={headers}
              mapping={mapping}
              setMapping={setMapping}
              parsedData={parsedData}
              handleCsvUpload={handleCsvUpload}
              handleImageUpload={handleImageUpload}
              previewImport={previewImport}
            />
          )}
          
          {previewMode && (
            <CsvPreviewImport 
              errors={errors} 
              importedProducts={importedProducts}
              processImport={processImport}
              setPreviewMode={setPreviewMode}
              isImporting={isImporting}
            />
          )}
          
          {success && <CsvSuccessMessage resetForm={resetForm} />}
          
          {errors.length > 0 && !previewMode && <CsvErrorAlert errors={errors} />}
        </div>
      </CardContent>
    </Card>
  );
};

interface ImportStepsProps {
  file: File | null;
  imageFile: File | null;
  headers: string[];
  mapping: Record<string, string>;
  setMapping: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  parsedData: any[];
  handleCsvUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewImport: () => void;
}

const ImportSteps = ({
  file,
  imageFile,
  headers,
  mapping,
  setMapping,
  parsedData,
  handleCsvUpload,
  handleImageUpload,
  previewImport
}: ImportStepsProps) => {
  return (
    <div className="space-y-6">
      <CsvStep1Upload handleCsvUpload={handleCsvUpload} file={file} />
      
      {headers.length > 0 && (
        <CsvStep2Mapping 
          headers={headers} 
          mapping={mapping} 
          setMapping={setMapping} 
        />
      )}
      
      {parsedData.length > 0 && (
        <CsvStep3Images 
          handleImageUpload={handleImageUpload} 
          imageFile={imageFile}
          previewImport={previewImport}
          showButton={parsedData.length > 0}
        />
      )}
    </div>
  );
};

export default CsvImporter;
