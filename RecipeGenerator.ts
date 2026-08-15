import {
  GoogleGenAI,
  ThinkingLevel
} from '@google/genai';

import z from "zod";
import { RecipeSchema, type Recipe } from "./recipe";
import { Context } from './Context';

export class RecipeGenerationError extends Error{}

export class RecipeGenerator{
    private ai: GoogleGenAI;
    private model: string;
    private context: Context;


    constructor(ai: GoogleGenAI, model = "gemini-3.5-flash-lite", context: Context = new Context()) {
        this.ai = ai;
        this.model = model;
        this.context = context;
    }

    async generate(input: string): Promise<Recipe>{
        const config = {
            thinkingConfig: {
            thinkingLevel: ThinkingLevel.MINIMAL,
            },
            responseMimeType: 'application/json',
            responseJsonSchema: z.toJSONSchema(RecipeSchema),
        };

        const model = this.model;
        const contents = [
            {
            role: 'user',
            parts: [
                {
                text: this.buildPrompt(input),
                },
            ],
            },
        ];

        const response = await this.ai.models.generateContent({
            model,
            config,
            contents,
        });

        const responseText = response.text;
        if(!responseText){
            throw new RecipeGenerationError("Model returned no text");
        }
        try {
            return RecipeSchema.parse(JSON.parse(response.text));
        } catch(err){
            throw new RecipeGenerationError("Model failed schema validation");
        }

    }

    private buildPrompt(query: string): string {
        const { allergies, pantry } = this.context;
        const sections = [`The user wants a recipe. Their request: "${query}"`];

        if (allergies.length > 0) {
            sections.push(
                `HARD CONSTRAINT. The user is allergic to the following. Never include ` +
                `any of these, or any ingredient derived from them, even in small amounts: ` +
                `${allergies.join(", ")}.`
            );
        }
        if (pantry.length > 0) {
            sections.push(
                `The user has these ingredients on hand. Prefer recipes built mostly from ` +
                `them; a few common additions are fine: ${pantry.join(", ")}.`
            );
        }
        return sections.join("\n\n");
    }
}