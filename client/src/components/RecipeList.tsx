import { Link } from "wouter";
import RecipeCard from "./RecipeCard";
import { Recipe } from "@/lib/types";

interface RecipeListProps {
  title: string;
  recipes: Recipe[];
  viewAllLink?: string;
  columns?: number;
  compact?: boolean;
}

const RecipeList = ({ 
  title, 
  recipes, 
  viewAllLink, 
  columns = 3,
  compact = false
}: RecipeListProps) => {
  return (
    <section className="my-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-2xl text-[#343A40]">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink}>
            <a className="text-[#7FB3D5] hover:underline font-medium">View All</a>
          </Link>
        )}
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${
        columns === 3 ? 'lg:grid-cols-3' : 
        columns === 4 ? 'lg:grid-cols-4' : 
        'lg:grid-cols-3'
      } gap-${compact ? '4' : '6'}`}>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} compact={compact} />
        ))}
      </div>
    </section>
  );
};

export default RecipeList;