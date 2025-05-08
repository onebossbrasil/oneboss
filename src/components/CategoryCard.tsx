
import { Link } from "react-router-dom";

type CategoryCardProps = {
  title: string;
  icon: React.ReactNode;
  slug: string;
};

const CategoryCard = ({ title, icon, slug }: CategoryCardProps) => {
  return (
    <Link 
      to={`/loja?categoria=${slug}`}
      className="group animate-scale-in"
    >
      <div className="glassmorphism rounded-xl p-6 flex flex-col items-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-gold/20 group-hover:-translate-y-1">
        <div className="text-gold mb-4 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <h3 className="font-playfair font-medium text-lg text-center">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
