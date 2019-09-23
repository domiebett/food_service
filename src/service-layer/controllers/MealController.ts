import { JsonController, Get, Res, Post, Body, Put, Param, QueryParam, Delete, Authorized, CurrentUser } from 'routing-controllers';
import { Response } from 'express';
import { MealAgent, FoodAgent } from '../../data-layer/data-agent';
import { MealType } from '../../data-layer/entity';

@JsonController('/meals')
export class MealController {
    constructor(
        private mealAgent: MealAgent,
        private foodAgent: FoodAgent
    ) { }

    @Authorized()
    @Get()
    async getAllMeals(@QueryParam('mealIds') mealIds: string, @Res() res: Response) {
        let meals = [];
        if (mealIds) {
            let ids = mealIds.split(',').map((id) => parseInt(id));
            meals = await this.mealAgent.getMealsWithIds(ids);
        } else {
            meals = await this.mealAgent.getMeals();
        }
        return res.status(200).json({ meals });
    }

    @Authorized()
    @Post()
    async addMeal(@CurrentUser() currentUserId: number, @Body() requestBody, @Res() res: Response) {
        requestBody.type = MealType[requestBody.type];
        const foods = await this.foodAgent.getFoodByIds(requestBody.foods || [], currentUserId);
        const meal = await this.mealAgent.addMeal(requestBody, foods);

        return res.status(201).json({ meal });
    }

    @Authorized()
    @Get('/:mealId')
    async getSingleMeal(@Param('mealId') mealId: number, @Res() res: Response) {
        const meal = await this.mealAgent.getMeal(mealId);

        return res.status(200).json({ meal });
    }

    @Authorized()
    @Put('/:mealId')
    async updateMeal(@CurrentUser() currentUserId: number, @Param('mealId') mealId: number, @Body() requestBody, @Res() res: Response) {
        const foods = await this.foodAgent.getFoodByIds(requestBody.foods || [], currentUserId);
        const meal = await this.mealAgent.updateMeal(mealId, requestBody, foods);

        return res.status(201).json({ meal });
    }

    @Authorized()
    @Post('/:mealId/foods')
    async addFoodToMeal(@CurrentUser() currentUserId: number, @Param('mealId') mealId: number, @Body() requestBody, @Res() res: Response) {
        const foods = await this.foodAgent.getFoodByIds(requestBody.foods || [], currentUserId);
        const meal = await this.mealAgent.addFoodToMeal(mealId, foods);

        return res.status(201).json({ meal });
    }

    @Authorized()
    @Delete('/:mealId')
    async deleteMeal(@Param('mealId') mealId: number, @Res() res: Response) {
        const meal = await this.mealAgent.deleteMeal(mealId);
        const message = 'Meal has been deleted successfully';

        return res.status(200).json({ message });
    }

    @Authorized()
    @Delete('/:mealId/foods/:foodId')
    async removeFoodFromMeal(@CurrentUser() currentUserId: number, @Param('mealId') mealId: number, @Param('foodId') foodId: number, @Res() res: Response) {
        const food = await this.foodAgent.getFoodById(foodId, currentUserId);
        const meal = await this.mealAgent.removeFoodFromMeal(mealId, food);
        const message = `${food.name} has been removed successfully`;

        return res.status(200).json({ meal, message });
    }
}
