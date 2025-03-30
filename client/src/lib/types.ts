export interface Recipe {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  cookingTime: number;
  difficulty: string;
  servings: number;
  calories: number;
  rating: number;
  reviewCount: number;
  category: string;
  ingredients: string[];
  instructions: string[];
  isFavorite?: boolean;
  tags: string[];
  averagePrice?: number; // Average price in INR (Indian Rupees)
  icon?: string; // Icon to represent the recipe
}

export interface Ingredient {
  id: number;
  name: string;
  category: string;
  icon?: string; // Icon for the ingredient
}
