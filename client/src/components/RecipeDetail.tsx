import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Clock, Utensils, Flame, Heart, X, IndianRupee,
  PanelTop, Bean, Triangle, ChefHat, Cookie, Sandwich, CircleOff, Flower
} from "lucide-react";
import { Recipe } from "@/lib/types";
import { Link } from "wouter";
import RecipeCard from "./RecipeCard";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

interface RecipeDetailProps {
  recipeId: string;
}

const RecipeDetail = ({ recipeId }: RecipeDetailProps) => {
  const { data: recipe, isLoading, error } = useQuery<Recipe>({
    queryKey: [`/api/recipes/${recipeId}`],
  });

  const { data: similarRecipes = [], isLoading: isLoadingSimilar } = useQuery<Recipe[]>({
    queryKey: [`/api/recipes/${recipeId}/similar`],
  });

  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRating = async (rating: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await apiRequest('POST', `/api/recipes/${recipeId}/rating`, { rating });
      setUserRating(rating);
      queryClient.invalidateQueries({ queryKey: [`/api/recipes/${recipeId}`] });
      toast({ title: 'Rating updated!', duration: 2000 });
    } catch (error) {
      toast({ 
        title: 'Error updating rating', 
        description: "Could not update rating",
        variant: 'destructive' 
      });
    }
  };

  useEffect(() => {
    if (recipe) {
      setIsFavorite(recipe.isFavorite || false);
    }
  }, [recipe]);

  const handleFavoriteToggle = async () => {
    try {
      await apiRequest('POST', `/api/recipes/${recipeId}/favorite`, { isFavorite: !isFavorite });
      setIsFavorite(!isFavorite);
      
      toast({
        title: !isFavorite ? "Added to favorites" : "Removed from favorites",
        duration: 3000,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recipes/favorites'] });
      queryClient.invalidateQueries({ queryKey: [`/api/recipes/${recipeId}`] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update favorites",
        variant: "destructive",
      });
    }
  };
  
  const renderRecipeIcon = (iconName?: string) => {
    if (!iconName) return null;
    
    const iconProps = {
      size: 24,
      className: "text-[#7FB3D5] mr-2"
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B81]"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold text-[#343A40]">Recipe not found</h2>
        <p className="mt-2 text-[#343A40]">Sorry, we couldn't find the recipe you're looking for.</p>
        <Link href="/browse">
          <Button className="mt-4 bg-[#7FB3D5]">Browse Recipes</Button>
        </Link>
      </div>
    );
  }

  return (
    <Card className="bg-white rounded-xl max-w-4xl mx-auto mt-6 shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            {recipe.icon && renderRecipeIcon(recipe.icon)}
            <h2 className="font-bold text-2xl text-[#343A40]">{recipe.name}</h2>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleFavoriteToggle}
              className="text-[#FF6B81] hover:text-[#FFD1DC] transition"
            >
              <Heart className={`h-6 w-6 ${isFavorite ? 'fill-[#FF6B81]' : ''}`} />
            </Button>
            <Link href="/browse">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-[#343A40] hover:text-[#FF6B81] transition"
              >
                <X className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center mt-4 mb-6">
          <div 
            className="flex text-yellow-400 cursor-pointer items-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
              setIsHovering(false);
              setHoverRating(0);
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`${
                  (isHovering ? hoverRating >= star : userRating >= star)
                    ? "fill-yellow-400"
                    : ""
                } h-6 w-6 transition-all cursor-pointer`}
                onMouseEnter={() => setHoverRating(star)}
                onClick={(e) => handleRating(star, e)}
              />
            ))}
            <span className="ml-2 text-sm text-[#343A40]">
              {userRating > 0 ? `Your rating: ${userRating}` : 'Rate this recipe'}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="md:w-1/2">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.name} 
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="flex flex-wrap justify-between mt-4 gap-2">
              <div className="flex items-center">
                <Clock className="text-[#7FB3D5]" size={16} />
                <span className="ml-2 font-medium">{recipe.cookingTime} minutes</span>
              </div>
              <div className="flex items-center">
                <Utensils className="text-[#7FB3D5]" size={16} />
                <span className="ml-2 font-medium">{recipe.servings} servings</span>
              </div>
              <div className="flex items-center">
                <Flame className="text-[#FF6B81]" size={16} />
                <span className="ml-2 font-medium">{recipe.calories} kcal</span>
              </div>
              {recipe.averagePrice && (
                <div className="flex items-center">
                  <IndianRupee className="text-[#7FB3D5]" size={16} />
                  <span className="ml-2 font-medium">{recipe.averagePrice} INR</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-1/2">
            <h3 className="font-medium text-xl text-[#FF6B81] mb-3">Ingredients</h3>
            <ul className="space-y-2 mb-4">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-baseline">
                  <i className="fas fa-circle text-xs text-[#7FB3D5] mr-2"></i>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium text-xl text-[#FF6B81] mb-3">Instructions</h3>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex">
                <span className="bg-[#7FB3D5] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                  {index + 1}
                </span>
                <p>{instruction}</p>
              </li>
            ))}
          </ol>
        </div>
        
        {similarRecipes && similarRecipes.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-xl text-[#FF6B81] mb-3">Similar Recipes You Might Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similarRecipes.slice(0, 3).map((similarRecipe: Recipe) => (
                <Link key={similarRecipe.id} href={`/recipe/${similarRecipe.id}`}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                    <img 
                      src={similarRecipe.imageUrl} 
                      alt={similarRecipe.name} 
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-2">
                      <div className="flex items-center">
                        {similarRecipe.icon && renderRecipeIcon(similarRecipe.icon)}
                        <h4 className="font-medium text-sm">{similarRecipe.name}</h4>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecipeDetail;
