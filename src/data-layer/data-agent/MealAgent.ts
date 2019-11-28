import { Meal, Food } from '../entity';
import { BaseAgent } from './BaseAgent';
import { Catch } from '../../business-layer/decorators/CatchError';

export class MealAgent extends BaseAgent {
    constructor() {
        super(Meal);
    }

    /**
     * Add meals. Can also add foods on creation of meals
     * @param requestBody - body of a request
     * @param userId - id for the current user
     * @param { Food[] } foods - array of food objects
     * @return { Promise<Meal> }
     */
    @Catch()
    async addMeal(requestBody, userId: number, foods: Food[] = []): Promise<Meal> {
        const meal = new Meal();
        meal.type = requestBody.type;
        meal.userId = userId;
        meal.foods = [];

        if (foods && foods.length > 0) {
            meal.foods = foods;
        }

        return await this.repository.save(meal);
    }

    /**
     * Updates attributes. If new foods are provided, it over writes the original.
     * @param {number}mealId - id of a meal
     * @param requestBody - body of a request
     * @param userId
     * @param {Food[]} foods - food objects to replace
     * @return { Promise<Meal> }
     */
    @Catch()
    async updateMeal(mealId: number, requestBody: any, userId: number, foods: Food[] = []): Promise<Meal> {
        delete requestBody.foods;

        let meal = <Meal> await this.fetchOne(mealId, userId);
        meal = await this.assignPropertiesToObject(meal, requestBody);

        const errors = await this.validate(meal);
        if (errors.length > 0)
            throw errors;

        if (foods && foods.length > 0) {
            meal.foods = foods;
        }

        return await this.repository.save(meal);
    }

    /**
     * Add foods to a meal
     * @param mealId - id of a meal
     * @param userId
     * @param foods - array of food objects
     * @return {Promise<Meal>}
     */
    @Catch()
    async addFoodToMeal(mealId: number, userId: number, foods: Food[] = []): Promise<Meal> {
        const meal = <Meal> await this.getById(mealId, userId, ['foods']);

        if (meal.foods && meal.foods.length > 0) {
            meal.foods.push(...foods);
        } else {
            meal.foods = foods;
        }

        return await this.repository.save(meal);
    }

    /**
     * Remove single food from a meal
     * @param mealId - id of a meal
     * @param userId
     * @param food - a food to remove from a meal
     * @return { Promise<Meal> }
     */
    @Catch()
    async removeFoodFromMeal(mealId: number, userId: number, food: Food): Promise<Meal> {
        const meal = <Meal> await this.getById(mealId, userId, ['foods']);

        const foodIndex = await this.indexOfFood(meal, food);
        if (foodIndex < 0) {
            throw Error(`Food with id: ${food.id}, doesnt't exist on meal id: ${mealId}`)
        }
        
        await meal.foods.splice(foodIndex, 1);
        return await this.repository.save(meal);
    }

    /**
     * Find the index of a food object in a meal
     * @param meal - meal to check
     * @param food - food to look for
     * @return {Promise<number>} - index of food
     */
    @Catch()
    private async indexOfFood(meal: Meal, food: Food): Promise<number> {
        for(let i = 0; i < meal.foods.length; i++) {
            if (meal.foods[i].id === food.id) {
                return i;
            }
        }

        return -1;
    }
}
