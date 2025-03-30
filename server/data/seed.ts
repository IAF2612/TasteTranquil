
import { db } from '../db';
import { recipes } from '@shared/schema';

const recipeData = [
  // Add 75+ recipes here with varied categories
  {
    name: "Classic Margherita Pizza",
    description: "Traditional Italian pizza with fresh basil",
    imageUrl: "https://example.com/margherita.jpg",
    cookingTime: 30,
    difficulty: "Medium",
    category: "Italian",
    ingredients: ["flour", "tomatoes", "mozzarella", "basil"],
    instructions: ["Make dough", "Add toppings", "Bake"],
    tags: ["pizza", "vegetarian", "italian"],
  },
  // ... Add more recipes
];

export async function seedRecipes() {
  for (const recipe of recipeData) {
    await db.insert(recipes).values(recipe);
  }
}
