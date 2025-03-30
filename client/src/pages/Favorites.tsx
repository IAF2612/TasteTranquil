import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/Hero";
import RecipeList from "@/components/RecipeList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Favorites = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: favorites, isLoading } = useQuery({
    queryKey: ["/api/recipes/favorites", searchQuery],
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Group recipes by category
  const categorizedFavorites = favorites?.reduce((acc: Record<string, any[]>, recipe: any) => {
    const category = recipe.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(recipe);
    return acc;
  }, {});

  const categories = categorizedFavorites ? Object.keys(categorizedFavorites) : [];

  return (
    <main className="container mx-auto pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="font-bold text-3xl text-[#343A40] mb-2">Your Favorite Recipes</h1>
        <p className="text-[#343A40]">All your saved recipes in one place</p>
      </div>
      
      <Hero onSearch={handleSearch} />
      
      {isLoading ? (
        <div className="h-60 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B81]"></div>
        </div>
      ) : favorites?.length > 0 ? (
        <>
          {categories.length > 1 ? (
            <Tabs defaultValue={categories[0]} className="mt-6">
              <TabsList className="mb-6 bg-white">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="data-[state=active]:bg-[#FFD1DC] data-[state=active]:text-[#343A40]"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map((category) => (
                <TabsContent key={category} value={category}>
                  <RecipeList 
                    title={category}
                    recipes={categorizedFavorites[category]} 
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <RecipeList 
              title="Your Favorites"
              recipes={favorites} 
            />
          )}
        </>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm mt-6 max-w-md mx-auto">
          <div className="text-[#FF6B81] text-5xl mb-4">
            <i className="far fa-heart"></i>
          </div>
          <h2 className="text-xl font-bold text-[#343A40]">No favorites yet</h2>
          <p className="mt-2 text-[#343A40] mb-4">
            Start saving your favorite recipes as you browse our collection
          </p>
          <a href="/browse" className="inline-block bg-[#7FB3D5] hover:bg-[#ADD8E6] text-white font-medium py-2 px-4 rounded-full transition">
            Browse Recipes
          </a>
        </div>
      )}
    </main>
  );
};

export default Favorites;
