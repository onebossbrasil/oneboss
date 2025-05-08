
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

type CategoryCardProps = {
  title: string;
  icon: React.ReactNode;
  slug: string;
};

const CategoryCard = ({ title, icon, slug }: CategoryCardProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Link 
      to={`/loja?categoria=${slug}`}
      className="group animate-scale-in w-full block"
    >
      <div className="glassmorphism rounded-xl p-4 md:p-6 flex flex-row md:flex-col items-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-gold/20 group-hover:-translate-y-1 h-full">
        <div className={`text-gold ${isMobile ? 'mr-4 md:mr-0' : 'mb-4'} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
        <h3 className={`font-playfair font-medium text-base md:text-lg ${isMobile ? 'text-left md:text-center' : 'text-center'}`}>
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
