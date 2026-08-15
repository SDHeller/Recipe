export enum Allergen {
  Milk = "Milk",
  Eggs = "Eggs",
  Fish = "Fish",
  Shellfish = "Shellfish",
  TreeNuts = "Tree Nuts",
  Peanuts = "Peanuts",   // medically distinct from tree nuts — separate entry on purpose
  Wheat = "Wheat",
  Soy = "Soy",
  Sesame = "Sesame",
}

// Keys are lowercase ingredient terms. Kept private to this module.
const INGREDIENT_ALLERGENS = new Map<string, Allergen>([
  // Shellfish
  ["shrimp", Allergen.Shellfish], ["prawn", Allergen.Shellfish],
  ["crab", Allergen.Shellfish], ["lobster", Allergen.Shellfish],
  ["crawfish", Allergen.Shellfish], ["clam", Allergen.Shellfish],
  ["mussel", Allergen.Shellfish], ["oyster", Allergen.Shellfish],
  ["scallop", Allergen.Shellfish],
  // Tree nuts
  ["pine nut", Allergen.TreeNuts], ["almond", Allergen.TreeNuts],
  ["walnut", Allergen.TreeNuts], ["cashew", Allergen.TreeNuts],
  ["pecan", Allergen.TreeNuts], ["pistachio", Allergen.TreeNuts],
  ["hazelnut", Allergen.TreeNuts], ["macadamia", Allergen.TreeNuts],
  // Peanuts
  ["peanut", Allergen.Peanuts],
  // Milk
  ["milk", Allergen.Milk], ["butter", Allergen.Milk], ["cream", Allergen.Milk],
  ["cheese", Allergen.Milk], ["parmesan", Allergen.Milk], ["yogurt", Allergen.Milk],
  // Eggs
  ["egg", Allergen.Eggs], ["mayonnaise", Allergen.Eggs],
  // Wheat
  ["wheat", Allergen.Wheat], ["flour", Allergen.Wheat], ["pasta", Allergen.Wheat],
  ["linguini", Allergen.Wheat], ["breadcrumb", Allergen.Wheat],
  // Soy
  ["soy", Allergen.Soy], ["tofu", Allergen.Soy], ["edamame", Allergen.Soy],
  // Sesame
  ["sesame", Allergen.Sesame], ["tahini", Allergen.Sesame],
  // Fish
  ["salmon", Allergen.Fish], ["tuna", Allergen.Fish], ["cod", Allergen.Fish],
  ["anchovy", Allergen.Fish], ["tilapia", Allergen.Fish],
]);

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Returns every allergen an ingredient string maps to (usually 0 or 1).
export function findAllergens(ingredientText: string): Allergen[] {
  const text = ingredientText.toLowerCase();
  const found = new Set<Allergen>();
  for (const [term, allergen] of INGREDIENT_ALLERGENS) {
    // \b...s?\b : word-boundary match with optional plural.
    // Word boundaries stop "egg" matching "eggplant" and "butter" matching "butternut".
    const pattern = new RegExp(`\\b${escapeRegex(term)}s?\\b`);
    if (pattern.test(text)) found.add(allergen);
  }
  return [...found];
}