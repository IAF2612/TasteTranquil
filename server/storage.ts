import { 
  Recipe, InsertRecipe, 
  Ingredient, InsertIngredient,
  Favorite, InsertFavorite,
  User, InsertUser,
  users, favorites
} from "@shared/schema";
import { recipes as initialRecipes } from "./data/recipes";
import { ingredients as initialIngredients } from "./data/ingredients";
import { getSimilarRecipesByIngredients, filterRecipesByIngredients } from "./utils/recipeUtils";
import session from "express-session";
import createMemoryStore from "memorystore";
import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { Pool } from '@neondatabase/serverless';
import connectPgSimple from "connect-pg-simple";

export interface GetRecipesOptions {
  query?: string;
  category?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;

  // User methods from original storage
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Recipe methods
  getRecipeById(id: number): Promise<Recipe | undefined>;
  getRecipes(options?: GetRecipesOptions): Promise<{ recipes: Recipe[], totalPages: number }>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, recipe: Partial<Recipe>): Promise<Recipe | undefined>;
  deleteRecipe(id: number): Promise<boolean>;
  getFeaturedRecipes(): Promise<Recipe[]>;
  getPopularRecipes(): Promise<Recipe[]>;
  getSimilarRecipes(recipeId: number): Promise<Recipe[]>;
  getRecommendedRecipes(): Promise<Recipe[]>;
  toggleFavorite(recipeId: number, isFavorite: boolean): Promise<Recipe | undefined>;
  getFavoriteRecipes(query?: string): Promise<Recipe[]>;
  suggestRecipesByIngredients(ingredients: string[]): Promise<Recipe[]>;
  getSuggestedRecipes(query?: string, category?: string): Promise<Recipe[]>;
  
  // Ingredient methods
  getAllIngredients(): Promise<Ingredient[]>;
  getIngredientById(id: number): Promise<Ingredient | undefined>;
  createIngredient(ingredient: InsertIngredient): Promise<Ingredient>;
}

// Memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private recipes: Map<number, Recipe>;
  private ingredients: Map<number, Ingredient>;
  private favorites: Map<number, Favorite>;
  private suggestedRecipeIds: number[];
  private userIdCounter: number;
  private recipeIdCounter: number;
  private ingredientIdCounter: number;
  private favoriteIdCounter: number;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.recipes = new Map();
    this.ingredients = new Map();
    this.favorites = new Map();
    this.suggestedRecipeIds = [];
    this.userIdCounter = 1;
    this.recipeIdCounter = 1;
    this.ingredientIdCounter = 1;
    this.favoriteIdCounter = 1;

    // Initialize session store
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with recipes and ingredients data
    this.initializeData();
  }

  private initializeData() {
    // Insert initial ingredients
    initialIngredients.forEach(ingredient => {
      this.createIngredient(ingredient);
    });

    // Insert initial recipes
    initialRecipes.forEach(recipe => {
      this.createRecipe(recipe);
    });
  }

  // User methods from original storage
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Recipe methods
  async getRecipeById(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async getRecipes(options: GetRecipesOptions = {}): Promise<{ recipes: Recipe[], totalPages: number }> {
    const { query, category, sortBy, page = 1, limit = 9 } = options;
    
    let filteredRecipes = Array.from(this.recipes.values());
    
    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(lowerQuery) ||
        recipe.description.toLowerCase().includes(lowerQuery) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(lowerQuery)) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }
    
    // Filter by category
    if (category && category !== "All Recipes") {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.category === category || 
        recipe.tags.includes(category)
      );
    }
    
    // Sort recipes
    if (sortBy) {
      switch (sortBy) {
        case 'newest':
          filteredRecipes.sort((a, b) => b.id - a.id);
          break;
        case 'oldest':
          filteredRecipes.sort((a, b) => a.id - b.id);
          break;
        case 'rating':
          filteredRecipes.sort((a, b) => b.rating - a.rating);
          break;
        case 'time':
          filteredRecipes.sort((a, b) => a.cookingTime - b.cookingTime);
          break;
        case 'alphabetical':
          filteredRecipes.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    } else {
      // Default sort by newest
      filteredRecipes.sort((a, b) => b.id - a.id);
    }
    
    // Calculate pagination
    const totalRecipes = filteredRecipes.length;
    const totalPages = Math.ceil(totalRecipes / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);
    
    return {
      recipes: paginatedRecipes,
      totalPages
    };
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const id = this.recipeIdCounter++;
    // Ensure all required fields are present
    const recipe: Recipe = { 
      ...insertRecipe, 
      id,
      servings: insertRecipe.servings || 4,
      calories: insertRecipe.calories || null,
      rating: insertRecipe.rating || 4.0,
      reviewCount: insertRecipe.reviewCount || 0,
      averagePrice: insertRecipe.averagePrice || null,
      icon: insertRecipe.icon || null
    };
    this.recipes.set(id, recipe);
    return recipe;
  }

  async updateRecipe(id: number, recipeUpdate: Partial<Recipe>): Promise<Recipe | undefined> {
    const existingRecipe = this.recipes.get(id);
    
    if (!existingRecipe) {
      return undefined;
    }
    
    const updatedRecipe = { ...existingRecipe, ...recipeUpdate };
    this.recipes.set(id, updatedRecipe);
    
    return updatedRecipe;
  }

  async deleteRecipe(id: number): Promise<boolean> {
    return this.recipes.delete(id);
  }

  async getFeaturedRecipes(): Promise<Recipe[]> {
    // In a real application, you might have a featured flag or some other way to determine featured recipes
    // Here we'll just return 3 random recipes 
    const allRecipes = Array.from(this.recipes.values());
    const shuffled = [...allRecipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  async getPopularRecipes(): Promise<Recipe[]> {
    // Return recipes with the highest ratings
    const allRecipes = Array.from(this.recipes.values());
    return [...allRecipes]
      .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
      .slice(0, 4);
  }

  async getSimilarRecipes(recipeId: number): Promise<Recipe[]> {
    const recipe = this.recipes.get(recipeId);
    
    if (!recipe) {
      return [];
    }
    
    // Find recipes with similar ingredients or in the same category
    const allRecipes = Array.from(this.recipes.values())
      .filter(r => r.id !== recipeId); // Exclude the current recipe
    
    return getSimilarRecipesByIngredients(recipe, allRecipes, 3);
  }

  async getRecommendedRecipes(): Promise<Recipe[]> {
    // In a real app, this might be based on user preferences, history, etc.
    // Here we'll just return some random recipes
    const allRecipes = Array.from(this.recipes.values());
    const shuffled = [...allRecipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  async toggleFavorite(recipeId: number, isFavorite: boolean): Promise<Recipe | undefined> {
    const recipe = this.recipes.get(recipeId);
    
    if (!recipe) {
      return undefined;
    }
    
    // Update the recipe with the favorite status
    const updatedRecipe = { ...recipe, isFavorite };
    this.recipes.set(recipeId, updatedRecipe);
    
    // In a real app with authentication, you would also update a user_favorites table
    if (isFavorite) {
      const favorite: Favorite = {
        id: this.favoriteIdCounter++,
        userId: 1, // Hardcoded for now
        recipeId
      };
      this.favorites.set(favorite.id, favorite);
    } else {
      // Remove the favorite
      const favoriteToRemove = Array.from(this.favorites.values())
        .find(f => f.recipeId === recipeId && f.userId === 1);
      
      if (favoriteToRemove) {
        this.favorites.delete(favoriteToRemove.id);
      }
    }
    
    return updatedRecipe;
  }

  async getFavoriteRecipes(query?: string): Promise<Recipe[]> {
    // Get all favorites for the current user (hardcoded to 1 for now)
    const userFavorites = Array.from(this.favorites.values())
      .filter(f => f.userId === 1);
    
    // Get the corresponding recipes
    let favoriteRecipes = userFavorites
      .map(f => this.recipes.get(f.recipeId))
      .filter((r): r is Recipe => r !== undefined)
      .map(r => ({ ...r, isFavorite: true }));
    
    // Filter by search query if provided
    if (query) {
      const lowerQuery = query.toLowerCase();
      favoriteRecipes = favoriteRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(lowerQuery) ||
        recipe.description.toLowerCase().includes(lowerQuery) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(lowerQuery))
      );
    }
    
    return favoriteRecipes;
  }

  async suggestRecipesByIngredients(ingredients: string[]): Promise<Recipe[]> {
    const allRecipes = Array.from(this.recipes.values());
    
    if (ingredients.length === 0) {
      return [];
    }
    
    // Find recipes that can be made with the provided ingredients
    const suggestedRecipes = filterRecipesByIngredients(allRecipes, ingredients);
    
    // Save the suggested recipe IDs to be retrieved later
    this.suggestedRecipeIds = suggestedRecipes.map(r => r.id);
    
    return suggestedRecipes;
  }

  async getSuggestedRecipes(query?: string, category?: string): Promise<Recipe[]> {
    if (this.suggestedRecipeIds.length === 0) {
      return [];
    }
    
    let suggestedRecipes = this.suggestedRecipeIds
      .map(id => this.recipes.get(id))
      .filter((r): r is Recipe => r !== undefined);
    
    // Apply additional filters if needed
    if (query) {
      const lowerQuery = query.toLowerCase();
      suggestedRecipes = suggestedRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(lowerQuery) ||
        recipe.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    if (category && category !== "All Recipes") {
      suggestedRecipes = suggestedRecipes.filter(recipe => 
        recipe.category === category || 
        recipe.tags.includes(category)
      );
    }
    
    return suggestedRecipes;
  }

  // Ingredient methods
  async getAllIngredients(): Promise<Ingredient[]> {
    return Array.from(this.ingredients.values());
  }

  async getIngredientById(id: number): Promise<Ingredient | undefined> {
    return this.ingredients.get(id);
  }

  async createIngredient(insertIngredient: InsertIngredient): Promise<Ingredient> {
    const id = this.ingredientIdCounter++;
    const ingredient: Ingredient = { 
      ...insertIngredient, 
      id,
      icon: insertIngredient.icon || null
    };
    this.ingredients.set(id, ingredient);
    return ingredient;
  }
}

// Database implementation using PostgreSQL
export class DatabaseStorage implements IStorage {
  private memStorage: MemStorage;
  public sessionStore: session.Store;

  constructor() {
    this.memStorage = new MemStorage();
    
    // Connect to the database
    const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
    const PgStore = connectPgSimple(session);
    this.sessionStore = new PgStore({ 
      pool: pgPool,
      createTableIfMissing: true 
    });
    
    console.log("Database connected and initialized");
  }

  // User methods implementation
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || undefined;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  // Recipe methods - delegate to memory storage for now
  async getRecipeById(id: number): Promise<Recipe | undefined> {
    return this.memStorage.getRecipeById(id);
  }

  async getRecipes(options: GetRecipesOptions = {}): Promise<{ recipes: Recipe[], totalPages: number }> {
    return this.memStorage.getRecipes(options);
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    return this.memStorage.createRecipe(insertRecipe);
  }

  async updateRecipe(id: number, recipeUpdate: Partial<Recipe>): Promise<Recipe | undefined> {
    return this.memStorage.updateRecipe(id, recipeUpdate);
  }

  async deleteRecipe(id: number): Promise<boolean> {
    return this.memStorage.deleteRecipe(id);
  }

  async getFeaturedRecipes(): Promise<Recipe[]> {
    return this.memStorage.getFeaturedRecipes();
  }

  async getPopularRecipes(): Promise<Recipe[]> {
    return this.memStorage.getPopularRecipes();
  }

  async getSimilarRecipes(recipeId: number): Promise<Recipe[]> {
    return this.memStorage.getSimilarRecipes(recipeId);
  }

  async getRecommendedRecipes(): Promise<Recipe[]> {
    return this.memStorage.getRecommendedRecipes();
  }

  // Implement toggleFavorite with database support
  async toggleFavorite(recipeId: number, isFavorite: boolean): Promise<Recipe | undefined> {
    try {
      const userId = 1; // Default user ID for now
      
      // Check if favorite exists
      const [existingFavorite] = await db
        .select()
        .from(favorites)
        .where(and(
          eq(favorites.recipeId, recipeId),
          eq(favorites.userId, userId)
        ));
      
      if (existingFavorite && !isFavorite) {
        // Remove favorite
        await db
          .delete(favorites)
          .where(and(
            eq(favorites.recipeId, recipeId),
            eq(favorites.userId, userId)
          ));
      } else if (!existingFavorite && isFavorite) {
        // Add favorite
        await db
          .insert(favorites)
          .values({ recipeId, userId });
      }
      
      // Return recipe with updated favorite status
      const recipe = await this.memStorage.getRecipeById(recipeId);
      if (recipe) {
        // @ts-ignore - isFavorite is in the Recipe type but not in the DB schema
        return { ...recipe, isFavorite };
      }
      return undefined;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return undefined;
    }
  }

  // Implement getFavoriteRecipes with database support
  async getFavoriteRecipes(query?: string): Promise<Recipe[]> {
    try {
      const userId = 1; // Default user ID for now
      
      // Get user favorites from database
      const userFavorites = await db
        .select()
        .from(favorites)
        .where(eq(favorites.userId, userId));
      
      if (userFavorites.length === 0) {
        return [];
      }
      
      // Get recipes from memory storage and mark as favorites
      const favoriteRecipeIds = userFavorites.map(fav => fav.recipeId);
      const allRecipes = await this.memStorage.getRecipes({ limit: 1000 });
      
      let favoriteRecipes = allRecipes.recipes
        .filter(recipe => favoriteRecipeIds.includes(recipe.id))
        .map(recipe => ({ ...recipe, isFavorite: true }));
      
      // Filter by search query if provided
      if (query) {
        const lowerQuery = query.toLowerCase();
        favoriteRecipes = favoriteRecipes.filter(recipe => 
          recipe.name.toLowerCase().includes(lowerQuery) ||
          recipe.description.toLowerCase().includes(lowerQuery) ||
          recipe.ingredients.some(ing => ing.toLowerCase().includes(lowerQuery))
        );
      }
      
      return favoriteRecipes;
    } catch (error) {
      console.error("Error getting favorite recipes:", error);
      return [];
    }
  }

  async suggestRecipesByIngredients(ingredients: string[]): Promise<Recipe[]> {
    return this.memStorage.suggestRecipesByIngredients(ingredients);
  }

  async getSuggestedRecipes(query?: string, category?: string): Promise<Recipe[]> {
    return this.memStorage.getSuggestedRecipes(query, category);
  }
  
  // Ingredient methods
  async getAllIngredients(): Promise<Ingredient[]> {
    return this.memStorage.getAllIngredients();
  }

  async getIngredientById(id: number): Promise<Ingredient | undefined> {
    return this.memStorage.getIngredientById(id);
  }

  async createIngredient(insertIngredient: InsertIngredient): Promise<Ingredient> {
    return this.memStorage.createIngredient(insertIngredient);
  }
}

// Export an instance of the database storage
export const storage = new DatabaseStorage();