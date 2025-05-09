
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface CsvPreviewTableProps {
  headers: string[];
  data: Record<string, string>[];
  maxRows?: number;
}

const CsvPreviewTable = ({
  headers,
  data,
  maxRows = 5
}: CsvPreviewTableProps) => {
  const displayData = data.slice(0, maxRows);
  
  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((header) => (
                <TableCell key={`${rowIndex}-${header}`}>
                  {row[header]}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {data.length > maxRows && (
            <TableRow>
              <TableCell 
                colSpan={headers.length} 
                className="text-center text-sm text-muted-foreground"
              >
                ...e mais {data.length - maxRows} linhas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CsvPreviewTable;
