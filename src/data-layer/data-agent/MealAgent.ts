import { Meal, Food } from './../entity';
import { Repository } from 'typeorm';
import { BaseAgent } from './BaseAgent';
import { Catch } from '../../business-layer/decorators/CatchError';

export class MealAgent extends BaseAgent {
    private mealRepository: Repository<Meal>;

    constructor() {
        super();
        this.mealRepository = this.getRepository(Meal);
    }

    /**
     * Get all meals
     * @return { Promise<Meal[]>}
     */
    @Catch()
    async getMeals(userId: number): Promise<Meal[]> {
        return await this.mealRepository.find({ relations: ['foods'], where: { userId: userId }});
    }

    /**
     * Get multiple meals using their ids
     * @param mealIds - the ids of the meals to retrieve
     * @return { Promise<Meal[]>}
     */
    @Catch()
    async getMealsWithIds(mealIds: number[], userId: number): Promise<Meal[]> {
        return await this.mealRepository.findByIds(mealIds, { relations: ['foods'], where: { userId: userId} });
    }

    /**
     * Add meals. Can also add foods on creation of meals
     * @param requestBody - body of a request
     * @param { Food[] } foods - array of food objects
     * @return { Promise<Meal> }
     */
    @Catch()
    async addMeal(requestBody, userId: number, foods: Food[] = []): Promise<Meal> {
        const meal = new Meal();
        meal.type = requestBody.type;
        await this.validate(meal);
        
        if (foods && foods.length > 0) {
            meal.foods = foods;
            meal.userId = userId;
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
    @Catch()
    async updateMeal(mealId: number, requestBody: any, userId: number, foods: Food[] = []): Promise<Meal> {
        delete requestBody.foods;

        const meal = await this.mealRepository.findOneOrFail(mealId, { where: { userId: userId}});
        
        for (let key in requestBody) {
            meal[key] = requestBody[key];
        }
        await this.validate(meal);

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
    @Catch()
    async addFoodToMeal(mealId: number, userId: number, foods: Food[] = []): Promise<Meal> {
        const meal = await this.mealRepository.findOneOrFail(mealId, { relations: ['foods'], where: { userId: userId }});

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
    @Catch()
    async getMeal(mealId: number, userId: number): Promise<Meal> {
        return await this.mealRepository.findOneOrFail(mealId, {relations: ['foods'], where: { userId: userId}});
    }

    /**
     * Delete a meal
     * @param mealId - id of a meal
     * @return {Promise<Meal>}
     */
    @Catch()
    async deleteMeal(mealId: number, userId: number): Promise<Meal> {
        const meal = await this.mealRepository.findOneOrFail(mealId, { where: { userId: userId }});
        return await this.mealRepository.remove(meal);
    }

    /**
     * Remove single food from a meal
     * @param mealId - id of a meal
     * @param food - a food to remove from a meal
     * @return { Promise<Meal> }
     */
    @Catch()
    async removeFoodFromMeal(mealId: number, userId: number, food: Food): Promise<Meal> {
        const meal = await this.mealRepository.findOneOrFail(mealId, {relations: ['foods'], where: { userId: userId}});

        const foodIndex = await this.indexOfFood(meal, food);
        if (foodIndex < 0) {
            throw Error(`Food with id: ${food.id}, doesnt't exist on meal id: ${mealId}`)
        }
        
        await meal.foods.splice(foodIndex, 1);
        return await this.mealRepository.save(meal);
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
