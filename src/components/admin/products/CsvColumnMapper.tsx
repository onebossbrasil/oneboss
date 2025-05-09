
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface CsvColumnMapperProps {
  headers: string[];
  mapping: Record<string, string>;
  setMapping: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const CsvColumnMapper = ({ 
  headers, 
  mapping, 
  setMapping 
}: CsvColumnMapperProps) => {
  const productFields = [
    { id: 'name', label: 'Nome do Produto' },
    { id: 'price', label: 'Preço' },
    { id: 'description', label: 'Descrição' },
    { id: 'category', label: 'Categoria' },
    { id: 'subcategories', label: 'Subcategorias' },
    { id: 'featured', label: 'Destaque' },
    { id: 'images', label: 'Imagens' },
    { id: 'none', label: 'Ignorar Coluna' }
  ];

  const handleMappingChange = (csvHeader: string, productField: string) => {
    setMapping(prev => ({
      ...prev,
      [csvHeader]: productField
    }));
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coluna no CSV</TableHead>
            <TableHead>Mapear para</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {headers.map((header) => (
            <TableRow key={header}>
              <TableCell className="font-medium">{header}</TableCell>
              <TableCell>
                <Select
                  value={mapping[header] || 'none'}
                  onValueChange={(value) => handleMappingChange(header, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar campo" />
                  </SelectTrigger>
                  <SelectContent>
                    {productFields.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CsvColumnMapper;
