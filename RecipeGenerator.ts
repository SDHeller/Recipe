import {
  GoogleGenAI,
  ThinkingLevel
} from '@google/genai';

import z from "zod";
import { RecipeSchema, type Recipe } from "./recipe";

export class RecipeGenerationError extends Error{}

export class RecipeGenerator{
    private ai: GoogleGenAI;
    private model: string;

    constructor(ai: GoogleGenAI, model = "gemini-3.5-flash-lite") {
        this.ai = ai;
        this.model = model;
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
                text: input,
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
}