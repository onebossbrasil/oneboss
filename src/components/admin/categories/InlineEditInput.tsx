
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

const InlineEditInput = ({ value, onChange, onSave, onCancel, loading, className }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <div className={`flex gap-2 items-center ${className || ""}`}>
      <input
        ref={inputRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") onSave();
          if (e.key === "Escape") onCancel();
        }}
        disabled={loading}
        className="border rounded w-36 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
      <Button variant="ghost" size="icon" onClick={onSave} disabled={loading || !value.trim()}>
        <Check className="h-4 w-4 text-green-600" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onCancel} disabled={loading}>
        <X className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
};

export default InlineEditInput;
