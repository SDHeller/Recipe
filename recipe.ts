

import z from "zod";

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