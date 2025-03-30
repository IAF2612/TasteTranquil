import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/Hero";
import IngredientSelector from "@/components/IngredientSelector";
import CategoryFilters from "@/components/CategoryFilters";
import RecipeList from "@/components/RecipeList";
import { Recipe } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Recipes");
  
  const { data: featuredRecipes, isLoading: featuredLoading } = useQuery({
    queryKey: ["/api/recipes/featured"],
  });
  
  const { data: popularRecipes, isLoading: popularLoading } = useQuery({
    queryKey: ["/api/recipes/popular"],
  });
  
  const { data: suggestedRecipes, isLoading: suggestedLoading, refetch: refetchSuggested } = useQuery({
    queryKey: ["/api/recipes/suggested", searchQuery, selectedCategory],
    enabled: false,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    refetchSuggested();
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    refetchSuggested();
  };

  const handleSuggestRecipes = async (selectedIngredients: string[]) => {
    try {
      await apiRequest('POST', '/api/recipes/suggest', { ingredients: selectedIngredients });
      refetchSuggested();
    } catch (error) {
      console.error("Error suggesting recipes:", error);
    }
  };

  return (
    <main className="container mx-auto pt-20 pb-10 px-4">
      <Hero onSearch={handleSearch} />
      
      <IngredientSelector onSuggestRecipes={handleSuggestRecipes} />
      
      <CategoryFilters onCategorySelect={handleCategorySelect} />
      
      {suggestedRecipes && suggestedRecipes.length > 0 && (
        <RecipeList 
          title="Suggested Recipes" 
          recipes={suggestedRecipes} 
          viewAllLink="/browse" 
        />
      )}
      
      {featuredLoading ? (
        <div className="h-60 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B81]"></div>
        </div>
      ) : (
        featuredRecipes && (
          <RecipeList 
            title="Featured Recipes" 
            recipes={featuredRecipes} 
            viewAllLink="/browse" 
          />
        )
      )}
      
      {popularLoading ? (
        <div className="h-60 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B81]"></div>
        </div>
      ) : (
        popularRecipes && (
          <RecipeList 
            title="Popular This Week" 
            recipes={popularRecipes} 
            viewAllLink="/browse" 
            columns={4}
            compact={true}
          />
        )
      )}
    </main>
  );
};

export default Home;
