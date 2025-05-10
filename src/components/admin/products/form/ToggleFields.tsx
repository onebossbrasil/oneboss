
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

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
    <div className="flex flex-col gap-3 mt-4">
      <div className="flex items-center justify-between border p-3 rounded-md bg-muted/20">
        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={published}
            onCheckedChange={onPublishedChange}
          />
          <Label className="flex items-center" htmlFor="published">
            Produto publicado na loja
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quando ativado, o produto estará visível na loja.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
        </div>
      </div>
      
      <div className="flex items-center justify-between border p-3 rounded-md bg-muted/20">
        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={featured}
            onCheckedChange={onFeaturedChange}
          />
          <Label className="flex items-center" htmlFor="featured">
            Destaque na página inicial
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quando ativado, o produto será exibido na seção de destaques.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ToggleFields;
