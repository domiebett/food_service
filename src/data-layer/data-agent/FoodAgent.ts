import { getConnection, Repository } from 'typeorm';
import { Food, IFood } from '../entity/Food';

export class FoodAgent {
    private foodRepository: Repository<Food>;

    constructor() {
        this.foodRepository = getConnection().getRepository(Food);
    }

    async addFood(requestBody: IFood): Promise<Food> {
        let food = new Food();
        food.name = requestBody.name;
        food.price = requestBody.price;
        food.type = requestBody.type;

        return await this.foodRepository.save(food);
    }

    async getAllFood(): Promise<Food[]> {
        return await this.foodRepository.find();
    }

    async getFoodById(foodId: number): Promise<Food> {
        return await this.foodRepository.findOneOrFail(foodId);
    }

    async deleteFood(foodId: number): Promise<Food> {
        const food = await this.foodRepository.findOneOrFail(foodId);
        return await this.foodRepository.remove(food);
    }

    async editFood(foodId: number, requestBody: any): Promise<Food> {
        const food = await this.foodRepository.findOneOrFail(foodId);

        for(let key in requestBody) {
            food[key] = requestBody[key];
        }

        return await this.foodRepository.save(food);
    }
}
