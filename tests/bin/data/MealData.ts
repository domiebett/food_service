import { MealType } from "../../../src/data-layer/entity";

export const mealObj = { type: MealType.DINNER};
export const mealObjWithFoods = { type: MealType.LUNCH, foods: ["1"]};
export const invalidTypeMealObj = { type: 'Wrong' }
