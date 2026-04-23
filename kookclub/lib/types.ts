export type CarbType = 'pasta' | 'rijst' | 'aardappel' | 'brood' | 'noedels' | 'quinoa' | 'geen';
export type ProteinType = 'kip' | 'rund' | 'gehakt' | 'varken' | 'vis' | 'zeevruchten' | 'vegetarisch' | 'tofu' | 'ei';
export type CookingMethod = 'oven' | 'pan' | 'airfryer' | 'wok' | 'bbq' | 'slowcooker' | 'koud';

export type IngredientCategory = 'vlees' | 'koolhydraten' | 'groenten' | 'kruiden' | 'zuivel' | 'overig';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  category: IngredientCategory;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  carbs: CarbType;
  protein: ProteinType;
  method: CookingMethod;
  kcal: number;
  prepTime: number;
  cookTime: number;
  difficulty: 'makkelijk' | 'gemiddeld' | 'uitdagend';
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
}
