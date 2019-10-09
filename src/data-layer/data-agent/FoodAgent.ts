import { Food, IFood } from '../entity';
import { BaseAgent } from './BaseAgent';
import { Catch } from '../../business-layer/decorators/CatchError';

export class FoodAgent extends BaseAgent {
    constructor() {
        super(Food);
    }
    
    /**
     * Add food to database
     * @param {IFood} requestBody - body provided in the request
     * @param userId
     * @return {Promise<Food>}
     */
    @Catch()
    async addFood(requestBody: IFood, userId: number): Promise<Food> {
        let food = new Food();
        food.name = requestBody.name;
        food.price = requestBody.price;
        food.type = requestBody.type;
        food.userId = userId;

        return await this.repository.save(food);
    }

    /**
     * Update food
     * @param {number} foodId - id of food to edit
     * @param requestBody - body of a request
     * @param userId
     * @return { Promise<Food> }
     */
    @Catch()
    async editFood(foodId: number, requestBody: any, userId: number): Promise<Food> {
        const food = <Food> await this.getById(foodId, userId);

        for(let key in requestBody) {
            food[key] = requestBody[key];
        }
        const errors = await this.validate(food);
        if (errors.length > 0)
            throw errors;

        return await this.repository.save(food);
    }
}
