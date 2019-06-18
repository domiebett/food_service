import { JsonController, Get, Res, Post, Body, Put, Param, Delete } from 'routing-controllers';
import { Response } from 'express';
import { MealAgent, FoodAgent } from '../../data-layer/data-agent';
import { MealType } from '../../data-layer/entity';
import { resolve } from 'dns';

@JsonController('/meals')
export class MealController {
    private mealAgent: MealAgent;
    private foodAgent: FoodAgent;

    constructor() {
        this.mealAgent = new MealAgent();
        this.foodAgent = new FoodAgent();
    }

    @Get()
    async getAllMeals(@Res() res: Response) {
        const meals = await this.mealAgent.getMeals();
        return res.status(200).json({ meals });
    }

    @Post()
    async addMeal(@Body() requestBody, @Res() res: Response) {
        requestBody.type = MealType[requestBody.type];
        const foods = await this.foodAgent.getFoodByIds(requestBody.foods || []);
        const meal = await this.mealAgent.addMeal(requestBody, foods);

        return res.status(201).json({ meal });
    }

    @Get('/:mealId')
    async getSingleMeal(@Param('mealId') mealId: number, @Res() res: Response) {
        const meal = await this.mealAgent.getMeal(mealId);

        return res.status(200).json({ meal });
    }

    @Put('/:mealId')
    async updateMeal(@Param('mealId') mealId: number, @Body() requestBody, @Res() res: Response) {
        const foods = await this.foodAgent.getFoodByIds(requestBody.foods || []);
        const meal = await this.mealAgent.updateMeal(mealId, requestBody, foods);

        return res.status(201).json({ meal });
    }

    @Post('/:mealId/foods')
    async addFoodToMeal(@Param('mealId') mealId: number, @Body() requestBody, @Res() res: Response) {
        const foods = await this.foodAgent.getFoodByIds(requestBody.foods || []);
        const meal = await this.mealAgent.addFoodToMeal(mealId, foods);

        return res.status(201).json({ meal });
    }

    @Delete('/:mealId')
    async deleteMeal(@Param('mealId') mealId: number, @Res() res: Response) {
        const meal = await this.mealAgent.deleteMeal(mealId);
        const message = 'Meal has been deleted successfully';

        return res.status(200).json({ message });
    }

    @Delete('/:mealId/foods/:foodId')
    async removeFoodFromMeal(@Param('mealId') mealId: number, @Param('foodId') foodId: number, @Res() res: Response) {
        const food = await this.foodAgent.getFoodById(foodId);
        const meal = await this.mealAgent.removeFoodFromMeal(mealId, food);
        const message = `${food.name} has been removed successfully`;

        return res.status(200).json({ meal, message });
    }
}
