import { Recipe, Ingredient, IngredientCategory } from './types';

export const carbLabels: Record<string, string> = {
  pasta: 'Pasta',
  rijst: 'Rijst',
  aardappel: 'Aardappel',
  brood: 'Brood',
  noedels: 'Noedels',
  quinoa: 'Quinoa',
  geen: 'Zonder koolhydraten',
};

export const proteinLabels: Record<string, string> = {
  kip: 'Kip',
  rund: 'Rundvlees',
  gehakt: 'Gehakt',
  varken: 'Varken',
  vis: 'Vis',
  zeevruchten: 'Zeevruchten',
  vegetarisch: 'Vegetarisch',
  tofu: 'Tofu',
  ei: 'Ei',
};

export const methodLabels: Record<string, string> = {
  oven: 'Oven',
  pan: 'Pan',
  airfryer: 'Airfryer',
  wok: 'Wok',
  bbq: 'BBQ',
  slowcooker: 'Slow cooker',
  koud: 'Koud',
};

export const categoryLabels: Record<IngredientCategory, string> = {
  vlees: 'Vlees & vis',
  koolhydraten: 'Koolhydraten',
  groenten: 'Groenten',
  kruiden: 'Kruiden',
  zuivel: 'Zuivel',
  overig: 'Overig',
};

export const categoryOrder: IngredientCategory[] = [
  'vlees',
  'koolhydraten',
  'groenten',
  'zuivel',
  'kruiden',
  'overig',
];

export function scaleIngredient(ingredient: Ingredient, fromServings: number, toServings: number): Ingredient {
  const factor = toServings / fromServings;
  return {
    ...ingredient,
    amount: Math.round(ingredient.amount * factor * 100) / 100,
  };
}

export function aggregateIngredients(
  items: { recipe: Recipe; servings: number }[]
): Record<IngredientCategory, Array<{ name: string; amount: number; unit: string; fromRecipes: string[] }>> {
  const result: Record<IngredientCategory, Map<string, { amount: number; unit: string; fromRecipes: Set<string> }>> = {
    vlees: new Map(),
    koolhydraten: new Map(),
    groenten: new Map(),
    kruiden: new Map(),
    zuivel: new Map(),
    overig: new Map(),
  };

  items.forEach(({ recipe, servings }) => {
    const factor = servings / recipe.servings;
    recipe.ingredients.forEach((ing) => {
      const key = `${ing.name.toLowerCase()}|${ing.unit}`;
      const category = ing.category;
      const existing = result[category].get(key);
      const scaledAmount = ing.amount * factor;
      if (existing) {
        existing.amount += scaledAmount;
        existing.fromRecipes.add(recipe.title);
      } else {
        result[category].set(key, {
          amount: scaledAmount,
          unit: ing.unit,
          fromRecipes: new Set([recipe.title]),
        });
      }
    });
  });

  const output: Record<string, Array<{ name: string; amount: number; unit: string; fromRecipes: string[] }>> = {
    vlees: [],
    koolhydraten: [],
    groenten: [],
    kruiden: [],
    zuivel: [],
    overig: [],
  };

  Object.entries(result).forEach(([cat, items]) => {
    items.forEach((value, key) => {
      const [name] = key.split('|');
      output[cat].push({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        amount: Math.round(value.amount * 100) / 100,
        unit: value.unit,
        fromRecipes: Array.from(value.fromRecipes),
      });
    });
  });

  return output as any;
}

export function formatAmount(amount: number, unit: string): string {
  if (amount < 1 && amount > 0) {
    const rounded = Math.round(amount * 4) / 4;
    return `${rounded} ${unit}`;
  }
  if (amount % 1 === 0) return `${amount} ${unit}`;
  return `${amount.toFixed(1)} ${unit}`;
}
