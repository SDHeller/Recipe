

import z from "zod";
import { Allergen, findAllergens } from "./allergen";
import { Context } from "./Context";

export interface Violation {
  ingredient: string;   // the recipe's ingredient text that tripped it
  allergen: Allergen;   // which of the user's allergens it maps to
}

//canonical response schema
export const RecipeSchema = z.object({
    Title: z.string(),
    Ingredients: z.array(z.object({
        Ingredient: z.string(),
        Amount: z.string()
    })),
    DishType: z.enum(["Entree","Side","Dessert"]),
    DishDescription: z.string().optional(),
    OrderedInstructions: z.array(z.string()).optional()
});

//response schema as a type
export type Recipe = z.infer<typeof RecipeSchema>;

export function formatRecipe(r: Recipe): string {
  const lines = [
    r.Title,
    "",
    "Ingredients:",
    ...r.Ingredients.map(i => `  - ${i.Amount ?? ""} ${i.Ingredient}`.trim()),
    "",
    "Instructions:",
    ...(r.OrderedInstructions ?? []).map((step, n) => `  ${n + 1}. ${step}`),
  ];
  return lines.join("\n");
}

export function validateRecipe(recipe: Recipe, context: Context): Violation[] {
  const violations: Violation[] = [];
  for (const item of recipe.Ingredients) {
    for (const allergen of findAllergens(item.Ingredient)) {
      if (context.allergies.includes(allergen)) {
        violations.push({ ingredient: item.Ingredient, allergen });
      }
    }
  }
  return violations;
}