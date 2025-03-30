
import { useState } from "react";
import { Heart, IndianRupee, PanelTop, Bean, Triangle, ChefHat, Cookie, Flame, Flower, Sandwich, CircleOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
}

const RecipeCard = ({ recipe, compact }: RecipeCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [, navigate] = useLocation();

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  const renderRecipeIcon = (iconName?: string) => {
    if (!iconName) return null;
    
    const iconProps = {
      size: compact ? 16 : 20,
      className: "text-[#7FB3D5]"
    };
    
    switch (iconName) {
      case 'PanelTop': return <PanelTop {...iconProps} />;
      case 'Bean': return <Bean {...iconProps} />;
      case 'Triangle': return <Triangle {...iconProps} />;
      case 'ChefHat': return <ChefHat {...iconProps} />;
      case 'Cookie': return <Cookie {...iconProps} />;
      case 'Flame': return <Flame {...iconProps} />;
      case 'Flower': return <Flower {...iconProps} />;
      case 'Sandwich': return <Sandwich {...iconProps} />;
      case 'CircleOff': return <CircleOff {...iconProps} />;
      default: return null;
    }
  };

  if (compact) {
    return (
      <div 
        onClick={handleCardClick}
        className="recipe-card bg-white rounded-xl overflow-hidden shadow-md transition duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      >
        <div className="relative">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.name} 
            className="w-full h-40 object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 text-white bg-[#FF6B81] rounded-full w-7 h-7 flex items-center justify-center hover:bg-[#FFD1DC] transition`}
            onClick={handleFavoriteToggle}
          >
            <Heart 
              className={`text-sm ${isFavorite ? 'fill-white' : ''}`} 
              size={14}
            />
          </Button>
        </div>
        <div className="p-3">
          <div className="flex items-center">
            {recipe.icon && <span className="mr-2">{renderRecipeIcon(recipe.icon)}</span>}
            <h3 className="font-bold text-base text-[#343A40] mb-1">{recipe.name}</h3>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <span className="ml-1 text-xs text-[#343A40]">({recipe.reviewCount || 0})</span>
            </div>
            <div className="flex items-center gap-2">
              {recipe.averagePrice && (
                <Badge variant="outline" className="bg-white text-[#FF6B81] text-xs font-medium px-2 py-1 rounded-full flex items-center">
                  <div className="flex items-center text-xs font-medium text-[#FF6B81]">
                    <IndianRupee size={10} className="mr-0.5" />
                    {recipe.averagePrice}
                  </div>
                </Badge>
              )}
              <span className="text-xs font-medium text-[#7FB3D5]">{recipe.cookingTime} min</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="recipe-card bg-white rounded-xl overflow-hidden shadow-md transition duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    >
      <div className="relative">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.name} 
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 text-white bg-[#FF6B81] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#FFD1DC] transition`}
          onClick={handleFavoriteToggle}
        >
          <Heart 
            className={`text-sm ${isFavorite ? 'fill-white' : ''}`} 
            size={16}
          />
        </Button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-[#FF6B81] text-white text-xs font-medium px-2 py-1 rounded-full">
              {recipe.cookingTime} min
            </Badge>
            <Badge variant="outline" className="bg-[#ADD8E6] text-[#343A40] text-xs font-medium px-2 py-1 rounded-full">
              {recipe.difficulty}
            </Badge>
            {recipe.averagePrice && (
              <Badge variant="outline" className="bg-white text-[#FF6B81] text-xs font-medium px-2 py-1 rounded-full flex items-center">
                <div className="flex items-center text-xs font-medium text-[#FF6B81]">
                  <IndianRupee size={10} className="mr-0.5" />
                  {recipe.averagePrice}
                </div>
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center">
          {recipe.icon && <span className="mr-2">{renderRecipeIcon(recipe.icon)}</span>}
          <h3 className="font-bold text-lg text-[#343A40]">{recipe.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
