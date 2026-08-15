import { Allergen } from "./allergen";

export class Context{
    public allergies: Allergen[];
    public pantry: string[];

    constructor(allergies: Allergen[] = [], pantry: string[] = []){
        this.allergies = allergies;
        this.pantry = pantry;
    }

}