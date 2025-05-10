
import React from "react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
  error?: string;
  optional?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ 
  id, 
  label, 
  children, 
  className = "",
  error,
  optional 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between">
        <Label htmlFor={id}>
          {label}
          {optional && <span className="text-muted-foreground text-sm ml-2">(opcional)</span>}
        </Label>
      </div>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default FormField;
