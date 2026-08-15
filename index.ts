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
import { formatRecipe } from './recipe';

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env['GEMINI_API_KEY'],
  });

  const generator = new RecipeGenerator(ai);
  const prompt = await getInput();
  const recipe  = await generator.generate(prompt);
  
  console.log(formatRecipe(recipe));

}

async function getInput(): Promise<string>{
    const read = readline.createInterface({input, output});
    const answer = await read.question("What are you looking to eat?");
    return answer;
}

main();


