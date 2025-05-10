
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ToggleFieldsProps {
  published: boolean;
  featured: boolean;
  onPublishedChange: (value: boolean) => void;
  onFeaturedChange: (value: boolean) => void;
}

const ToggleFields: React.FC<ToggleFieldsProps> = ({
  published,
  featured,
  onPublishedChange,
  onFeaturedChange,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={published}
          onCheckedChange={onPublishedChange}
        />
        <Label htmlFor="published">Produto publicado na loja</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={featured}
          onCheckedChange={onFeaturedChange}
        />
        <Label htmlFor="featured">Destaque na página inicial</Label>
      </div>
    </div>
  );
};

export default ToggleFields;
