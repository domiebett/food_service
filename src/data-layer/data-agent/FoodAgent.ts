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
}
