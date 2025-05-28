
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

const ProductGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <Card key={index} className="h-full overflow-hidden border animate-pulse">
          <div className="relative">
            <AspectRatio ratio={4/3}>
              <Skeleton className="w-full h-full" />
            </AspectRatio>
          </div>
          
          <CardContent className="p-3 md:p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
