import { Recipe } from "@shared/schema";

/**
 * Calculate the number of matching ingredients between a recipe and provided ingredients
 */
export function countMatchingIngredients(recipeIngredients: string[], providedIngredients: string[]): number {
  const lowerCaseProvided = providedIngredients.map(ing => ing.toLowerCase());
  
  // Count how many of the recipe's ingredients match the provided ingredients
  let matches = 0;
  
  for (const recipeIngredient of recipeIngredients) {
    // For each recipe ingredient, check if any provided ingredient is contained within it
    if (lowerCaseProvided.some(provided => 
      recipeIngredient.toLowerCase().includes(provided)
    )) {
      matches++;
    }
  }
  
  return matches;
}

/**
 * Calculate the percentage of recipe ingredients that match the provided ingredients
 */
export function calculateIngredientMatchPercentage(recipeIngredients: string[], providedIngredients: string[]): number {
  const matches = countMatchingIngredients(recipeIngredients, providedIngredients);
  return (matches / recipeIngredients.length) * 100;
}

/**
 * Filter recipes based on provided ingredients, returning those with the most matches
 */
export function filterRecipesByIngredients(
  recipes: Recipe[], 
  providedIngredients: string[], 
  threshold = 20 // Minimum percentage of ingredients that should match
): Recipe[] {
  if (providedIngredients.length === 0) return [];
  
  // Calculate match percentages for each recipe
  const recipesWithScores = recipes.map(recipe => {
    const matchPercentage = calculateIngredientMatchPercentage(recipe.ingredients, providedIngredients);
    return { recipe, matchPercentage };
  });
  
  // Filter recipes that meet the threshold
  const matchingRecipes = recipesWithScores
    .filter(item => item.matchPercentage >= threshold)
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .map(item => item.recipe);
  
  return matchingRecipes;
}

/**
 * Find similar recipes based on ingredient overlap
 */
export function getSimilarRecipesByIngredients(
  sourceRecipe: Recipe,
  allRecipes: Recipe[],
  limit = 3
): Recipe[] {
  // Create a set of ingredients from the source recipe
  const sourceIngredients = sourceRecipe.ingredients;
  const sourceCategory = sourceRecipe.category;
  const sourceTags = sourceRecipe.tags;
  
  // Calculate similarity scores for each recipe
  const recipesWithScores = allRecipes.map(recipe => {
    let score = 0;
    
    // Ingredient match score
    score += countMatchingIngredients(recipe.ingredients, sourceIngredients);
    
    // Category match bonus
    if (recipe.category === sourceCategory) {
      score += 3;
    }
    
    // Tag match bonus
    const tagMatchCount = recipe.tags.filter(tag => sourceTags.includes(tag)).length;
    score += tagMatchCount;
    
    return { recipe, score };
  });
  
  // Sort by score and return top matches
  return recipesWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.recipe);
}
