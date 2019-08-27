import { FoodType } from "../../../src/data-layer/entity";

export const foodObj = {name: 'Sample Food', type: FoodType.Starch, price: 50};
export const foodObj2 = {name: 'Sample Food 2', type: 'Protein', price: 50};
export const emptyFoodNameObj = { name: '', type: FoodType.Drink, price: 50 };
export const wrongFoodTypeObj = { name: 'Sample Food 2', type: 'Wrong', price: 50};
export const wrongFoodPriceObj = { name: 'Sample Food 2', type: FoodType.Vitamin, price: 'string'};
