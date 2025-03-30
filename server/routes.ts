import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication with Passport
  setupAuth(app);
  
  // === Recipe endpoints ===
  
  // Get all recipes with optional filters
  app.get("/api/recipes", async (req, res) => {
    try {
      const query = req.query.q as string | undefined;
      const category = req.query.category as string | undefined;
      const sortBy = req.query.sortBy as string | undefined;
      const page = parseInt(req.query.page as string || "1");
      const limit = parseInt(req.query.limit as string || "9");
      
      const result = await storage.getRecipes({ query, category, sortBy, page, limit });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  // Get featured recipes
  app.get("/api/recipes/featured", async (req, res) => {
    try {
      const featuredRecipes = await storage.getFeaturedRecipes();
      res.json(featuredRecipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured recipes" });
    }
  });

  // Get popular recipes
  app.get("/api/recipes/popular", async (req, res) => {
    try {
      const popularRecipes = await storage.getPopularRecipes();
      res.json(popularRecipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular recipes" });
    }
  });

  // Get favorite recipes
  app.get("/api/recipes/favorites", async (req, res) => {
    try {
      const query = req.query.q as string | undefined;
      const favorites = await storage.getFavoriteRecipes(query);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorite recipes" });
    }
  });

  // Get recommended recipes
  app.get("/api/recipes/recommended", async (req, res) => {
    try {
      const recommendedRecipes = await storage.getRecommendedRecipes();
      res.json(recommendedRecipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommended recipes" });
    }
  });

  // Suggest recipes based on ingredients
  app.post("/api/recipes/suggest", async (req, res) => {
    try {
      const schema = z.object({
        ingredients: z.array(z.string()),
      });
      
      const data = schema.parse(req.body);
      const suggestedRecipes = await storage.suggestRecipesByIngredients(data.ingredients);
      
      res.json(suggestedRecipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to suggest recipes" });
    }
  });

  // Get suggested recipes after submission
  app.get("/api/recipes/suggested", async (req, res) => {
    try {
      const query = req.query.q as string | undefined;
      const category = req.query.category as string | undefined;
      const suggestedRecipes = await storage.getSuggestedRecipes(query, category);
      
      res.json(suggestedRecipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suggested recipes" });
    }
  });

  // Get a specific recipe by ID
  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const recipe = await storage.getRecipeById(id);
      
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });

  // Toggle favorite status for a recipe
  app.post("/api/recipes/:id/favorite", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const schema = z.object({
        isFavorite: z.boolean(),
      });
      
      const data = schema.parse(req.body);
      const recipe = await storage.toggleFavorite(id, data.isFavorite);
      
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: "Failed to update favorite status" });
    }
  });

  // Get similar recipes to a specific recipe
  app.get("/api/recipes/:id/similar", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const similarRecipes = await storage.getSimilarRecipes(id);
      res.json(similarRecipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch similar recipes" });
    }
  });

  // === Ingredient endpoints ===
  
  // Get all ingredients
  app.get("/api/ingredients", async (req, res) => {
    try {
      const ingredients = await storage.getAllIngredients();
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ingredients" });
    }
  });

  const httpServer = createServer(app);

  // Rate a recipe
  app.post("/api/recipes/:id/rate", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const schema = z.object({
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      });
      
      const data = schema.parse(req.body);
      await storage.rateRecipe(id, data.rating, data.comment);
      
      res.json({ message: "Rating submitted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit rating" });
    }
  });

  // Rate the website
  app.post("/api/website/rate", async (req, res) => {
    try {
      const schema = z.object({
        rating: z.number().min(1).max(5),
        feedback: z.string().optional(),
      });
      
      const data = schema.parse(req.body);
      await storage.rateWebsite(data.rating, data.feedback);
      
      res.json({ message: "Website rating submitted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit website rating" });
    }
  });

  return httpServer;
}
