import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table from the original schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Recipes table
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  cookingTime: integer("cooking_time").notNull(),
  difficulty: text("difficulty").notNull(),
  servings: integer("servings").notNull().default(4),
  calories: integer("calories"),
  rating: integer("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  category: text("category").notNull(),
  ingredients: text("ingredients").array().notNull(),
  instructions: text("instructions").array().notNull(),
  tags: text("tags").array().notNull(),
  averagePrice: integer("average_price"), // Average price in INR (Indian Rupees)
  icon: text("icon"), // Icon to represent the recipe
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
});

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect & { isFavorite?: boolean };

// Ingredients table
export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  icon: text("icon"),  // Icon name for displaying with ingredient
});

export const insertIngredientSchema = createInsertSchema(ingredients).omit({
  id: true,
});

export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type Ingredient = typeof ingredients.$inferSelect;

// Favorites table (to track user favorite recipes)
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  recipeId: integer("recipe_id").notNull(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// User ratings table
export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  recipeId: integer("recipe_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Website ratings table
export const websiteRatings = pgTable("website_ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  createdAt: true,
});

export const insertWebsiteRatingSchema = createInsertSchema(websiteRatings).omit({
  id: true,
  createdAt: true,
});

export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = typeof ratings.$inferSelect;
export type WebsiteRating = typeof websiteRatings.$inferSelect;
