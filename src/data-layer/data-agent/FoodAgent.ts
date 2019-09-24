import { Repository } from 'typeorm';
import { Food, IFood } from '../entity/Food';
import { BaseAgent } from './BaseAgent';
import { Catch } from '../../business-layer/decorators/CatchError';

export class FoodAgent extends BaseAgent {
    private foodRepository: Repository<Food>;

    constructor() {
        super();
        this.foodRepository = this.getRepository(Food);
    }
    
    /**
     * Add food to database
     * @param {IFood} requestBody - body provided in the request
     * @return {Promise<Food>}
     */
    @Catch()
    async addFood(requestBody: IFood, userId: number): Promise<Food> {
        let food = new Food();
        food.name = requestBody.name;
        food.price = requestBody.price;
        food.type = requestBody.type;
        food.userId = userId;

        return await this.foodRepository.save(food);
    }

    /**
     * Get all foods in database
     * @return { Promise<Food> }
     */
    @Catch()
    async getAllFood(userId: number): Promise<Food[]> {
        return await this.foodRepository.find({ where: { userId: userId }});
    }

    /**
     * Get single food by Id
     * @param {number} foodId - id of the food
     * @return { Promise<Food> }
     */
    @Catch()
    async getFoodById(foodId: number, userId: number): Promise<Food> {
        return await this.foodRepository.findOneOrFail(foodId, {where: { userId: userId }});
    }

    /**
     * Delete food
     * @param {number} foodId - id of the food
     * @return { Promise<Food> }
     */
    @Catch()
    async deleteFood(foodId: number, userId: number): Promise<Food> {
        const food = await this.foodRepository.findOneOrFail(foodId, { where: { userId: userId }});
        return await this.foodRepository.remove(food);
    }

    /**
     * Update food
     * @param {number} foodId - id of food to edit
     * @param requestBody - body of a request
     * @return { Promise<Food> }
     */
    @Catch()
    async editFood(foodId: number, requestBody: any, userId: number): Promise<Food> {
        const food = await this.foodRepository.findOneOrFail(foodId, { where: { userId: userId }});

        for(let key in requestBody) {
            food[key] = requestBody[key];
        }
        const errors = await this.validate(food);
        if (errors.length > 0)
            throw errors;

        return await this.foodRepository.save(food);
    }

    /**
     * Get multiple foods by their ids
     * @param { number[] } foodIds - id of food
     * @return { Promise<Food> }
     */
    @Catch()
    async getFoodByIds(foodIds: number[], userId: number): Promise<Food[]> {
        return await this.foodRepository.findByIds(foodIds, { where: { userId: userId }});
    }
}
