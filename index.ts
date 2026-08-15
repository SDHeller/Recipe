// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';
import z from "zod";
import { RecipeGenerator } from './RecipeGenerator';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { formatRecipe, validateRecipe } from './recipe';
import { Context } from './Context';
import { Allergen } from './allergen';

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env['GEMINI_API_KEY'],
  });
  const context = buildTestContext();
  const generator = new RecipeGenerator(ai, undefined, context);
  const prompt = await getInput();
  const recipe  = await generator.generate(prompt);
  
  console.log(formatRecipe(recipe));

  const violations = validateRecipe(recipe, context);    // deterministic allergen check
  if (violations.length > 0) {
        console.warn("\n[!] ALLERGEN VIOLATIONS DETECTED:");
        for (const v of violations) {
            console.warn(`    "${v.ingredient}" -> ${v.allergen}`);
        }
  } else {
    console.log("\n[ok] No allergen violations detected.");
  }

}

async function getInput(): Promise<string>{
    const read = readline.createInterface({input, output});
    const answer = await read.question("What are you looking to eat?");
    return answer;
}

function buildTestContext(): Context{
    const allergies = [Allergen.Shellfish,Allergen.TreeNuts];
    const pantry = ["Basil","Pine Nuts","Parmesan Cheese","Olive Oil","Salt","Chicken breasts","Shrimp","Rice","Linguini"];

    return new Context(allergies, pantry);
}

main();


