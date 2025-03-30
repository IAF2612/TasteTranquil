import { useParams } from "wouter";
import RecipeDetail from "@/components/RecipeDetail";
import { useQuery } from "@tanstack/react-query";
import RecipeList from "@/components/RecipeList";

const RecipeView = () => {
  const { id } = useParams();
  
  const { data: recommendedRecipes } = useQuery({
    queryKey: [`/api/recipes/recommended`],
  });

  return (
    <main className="container mx-auto pt-20 pb-10 px-4">
      <RecipeDetail recipeId={id} />
      
      {recommendedRecipes && recommendedRecipes.length > 0 && (
        <RecipeList 
          title="You Might Also Like" 
          recipes={recommendedRecipes.slice(0, 3)} 
          viewAllLink="/browse"
          columns={3}
        />
      )}
    </main>
  );
};

export default RecipeView;
