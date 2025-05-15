
import React from "react";
import { Button } from "@/components/ui/button";

interface ModernCardProps {
  title: string;
  description: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  buttonIcon?: React.ReactNode;
  children?: React.ReactNode; // for additional elements if needed
}

const ModernCard: React.FC<ModernCardProps> = ({
  title,
  description,
  buttonLabel,
  onButtonClick,
  buttonIcon,
  children,
}) => {
  return (
    <div className="bg-[#fcf8ed] border border-gold px-8 py-6 rounded-lg shadow-md w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 animate-fade-in max-w-3xl mx-auto mb-8">
      <div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "#C9A227" }}>{title}</h2>
        <p className="text-muted-foreground mb-2">{description}</p>
      </div>
      {buttonLabel && (
        <Button
          variant="default"
          className="flex items-center font-bold px-6 py-3 text-base shadow border border-gold bg-gold hover:bg-gold/80 text-white"
          onClick={onButtonClick}
          style={{
            backgroundColor: "#C9A227",
            borderColor: "#C9A227",
            color: "#fff"
          }}
        >
          {buttonIcon && <span className="mr-2">{buttonIcon}</span>}
          {buttonLabel}
        </Button>
      )}
      {children && children}
    </div>
  );
};

export default ModernCard;
