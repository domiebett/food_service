import { MealType } from "../../../src/data-layer/entity";

export const mealObj = { type: MealType.Dinner};
export const mealObjWithFoods = { type: MealType.Lunch, foods: ["1"]};
export const invalidTypeMealObj = { type: 'Wrong' }
