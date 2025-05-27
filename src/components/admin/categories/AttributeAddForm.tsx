
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  value: string;
  setValue: (val: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

const AttributeAddForm = ({
  value, setValue, onConfirm, onCancel, loading = false,
}: Props) => (
  <div className="flex gap-2 items-center mb-1">
    <Input
      placeholder="Novo atributo..."
      value={value}
      onChange={e => setValue(e.target.value)}
      className="h-9 w-full md:w-40"
      disabled={loading}
    />
    <Button variant="ghost" size="icon" onClick={onConfirm} disabled={!value || loading} className="h-9">
      <span className="text-green-600 font-bold">✔</span>
    </Button>
    <Button variant="ghost" size="icon" onClick={onCancel} className="h-9" disabled={loading}>
      <span className="text-muted-foreground font-bold">✗</span>
    </Button>
  </div>
);

export default AttributeAddForm;
