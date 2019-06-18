import { Meal, Food } from './../entity';
import { getConnection, Repository } from 'typeorm';

export class MealAgent {
    private mealRepository: Repository<Meal>;

    constructor() {
        this.mealRepository = getConnection().getRepository(Meal);
    }

    /**
     * Get all meals
     * @return { Promise<Meal[]>}
     */
    async getMeals(): Promise<Meal[]> {
        return await this.mealRepository.find({ relations: ['foods']});
    }

    /**
     * Add meals. Can also add foods on creation of meals
     * @param requestBody - body of a request
     * @param { Food[] } foods - array of food objects
     * @return { Promise<Meal> }
     */
    async addMeal(requestBody, foods: Food[] = []): Promise<Meal> {
        const meal = new Meal();
        meal.type = requestBody.type;
        
        if (foods && foods.length > 0) {
            meal.foods = foods;
        }
        
        return await this.mealRepository.save(meal);
    }

    /**
     * Updates attributes. If new foods are provided, it over writes the original.
     * @param {number}mealId - id of a meal
     * @param requestBody - body of a request
     * @param {Food[]} foods - food objects to replace
     * @return { Promise<Meal> }
     */
    async updateMeal(mealId: number, requestBody: any, foods: Food[] = []): Promise<Meal> {
        delete requestBody.foods;

        const meal = await this.mealRepository.findOneOrFail(mealId);
        
        for (let key in requestBody) {
            meal[key] = requestBody[key];
        }

        if (foods && foods.length > 0) {
            meal.foods = foods;
        }

        return await this.mealRepository.save(meal);
    }

    /**
     * Add foods to a meal
     * @param mealId - id of a meal
     * @param foods - array of food objects
     * @return {Promise<Meal>}
     */
    async addFoodToMeal(mealId: number, foods: Food[] = []): Promise<Meal> {
        const meal = await this.mealRepository.findOneOrFail(mealId, { relations: ['foods']});

        if (meal.foods && meal.foods.length > 0) {
            meal.foods.push(...foods);
        } else {
            meal.foods = foods;
        }

        return await this.mealRepository.save(meal);
    }

    /**
     * Get a meal
     * @param mealId - id of a meal
     * @return { Promise<Meal> }
     */
    async getMeal(mealId: number): Promise<Meal> {
        return await this.mealRepository.findOneOrFail(mealId, {relations: ['foods']});
    }

    /**
     * Delete a meal
     * @param mealId - id of a meal
     * @return {Promise<Meal>}
     */
    async deleteMeal(mealId: number): Promise<Meal> {
        const meal = await this.mealRepository.findOneOrFail(mealId);
        return await this.mealRepository.remove(meal);
    }

    /**
     * Remove single food from a meal
     * @param mealId - id of a meal
     * @param food - a food to remove from a meal
     * @return { Promise<Meal> }
     */
    async removeFoodFromMeal(mealId: number, food: Food): Promise<Meal> {
        const meal = await this.mealRepository.findOneOrFail(mealId, {relations: ['foods']});

        const foodIndex = meal.foods.indexOf(food);
        meal.foods.splice(foodIndex, 1);

        return await this.mealRepository.save(meal);
    }
}