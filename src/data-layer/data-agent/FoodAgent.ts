import { getConnection, Repository } from 'typeorm';
import { Food, IFood } from '../entity/Food';
import { Validator } from '../../business-layer/validators';
import { DatabaseConnectionService as DbConnectionService } from '../../business-layer/services';
import { Service } from 'typedi';
@Service()
export class FoodAgent {
    private foodRepository: Repository<Food>;
    private validate: Function;

    constructor() {
        this.foodRepository = getConnection(DbConnectionService.getDbEnv()).getRepository(Food);
        this.validate = Validator.validate;
    }
    
    /**
     * Add food to database
     * @param {IFood} requestBody - body provided in the request
     * @return {Promise<Food>}
     */
    async addFood(requestBody: IFood): Promise<Food> {
        let food = new Food();
        food.name = requestBody.name;
        food.price = requestBody.price;
        food.type = requestBody.type;

        await this.validate(food);

        return await this.foodRepository.save(food);
    }

    /**
     * Get all foods in database
     * @return { Promise<Food> }
     */
    async getAllFood(): Promise<Food[]> {
        return await this.foodRepository.find();
    }

    /**
     * Get single food by Id
     * @param {number} foodId - id of the food
     * @return { Promise<Food> }
     */
    async getFoodById(foodId: number): Promise<Food> {
        return await this.foodRepository.findOneOrFail(foodId);
    }

    /**
     * Delete food
     * @param {number} foodId - id of the food
     * @return { Promise<Food> }
     */
    async deleteFood(foodId: number): Promise<Food> {
        const food = await this.foodRepository.findOneOrFail(foodId);
        return await this.foodRepository.remove(food);
    }

    /**
     * Update food
     * @param {number} foodId - id of food to edit
     * @param requestBody - body of a request
     * @return { Promise<Food> }
     */
    async editFood(foodId: number, requestBody: any): Promise<Food> {
        const food = await this.foodRepository.findOneOrFail(foodId);

        for(let key in requestBody) {
            food[key] = requestBody[key];
        }

        await this.validate(food);

        return await this.foodRepository.save(food);
    }

    /**
     * Get multiple foods by their ids
     * @param { number[] } foodIds - id of food
     * @return { Promise<Food> }
     */
    async getFoodByIds(foodIds: number[]): Promise<Food[]> {
        return await this.foodRepository.findByIds(foodIds);
    }
}
