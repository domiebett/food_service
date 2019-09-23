import { JsonController, Get, Res, Post, Body, Put, Param, QueryParam, Delete, Authorized, CurrentUser, HttpCode } from 'routing-controllers';
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
    async getAllMeals(@CurrentUser() userId: number, @QueryParam('mealIds') mealIds: string, @Res() res: Response) {
        if (mealIds) {
            let ids = mealIds.split(',').map((id) => parseInt(id));
            return await this.mealAgent.getMealsWithIds(ids, userId);
        }
        return await this.mealAgent.getMeals(userId);
    }

    @Authorized()
    @HttpCode(201)
    @Post()
    async addMeal(@CurrentUser() userId: number, @Body() requestBody, @Res() res: Response) {
        requestBody.type = MealType[requestBody.type];
        const foods = await this.foodAgent.getFoodByIds(requestBody.foods || [], userId);
        return await this.mealAgent.addMeal(requestBody, userId, foods);
    }

    @Authorized()
    @Get('/:mealId')
    async getSingleMeal(@CurrentUser() userId: number, @Param('mealId') mealId: number, @Res() res: Response) {
        return await this.mealAgent.getMeal(mealId, userId);
    }

    @Authorized()
    @HttpCode(201)
    @Put('/:mealId')
    async updateMeal(@CurrentUser() userId: number, @Param('mealId') mealId: number, @Body() requestBody, @Res() res: Response) {
        const foods = await this.foodAgent.getFoodByIds(requestBody.foods || [], userId);
        return await this.mealAgent.updateMeal(mealId, requestBody, userId, foods);
    }

    @Authorized()
    @HttpCode(201)
    @Post('/:mealId/foods')
    async addFoodToMeal(@CurrentUser() userId: number, @Param('mealId') mealId: number, @Body() requestBody, @Res() res: Response) {
        const foods = await this.foodAgent.getFoodByIds(requestBody.foods || [], userId);
        return await this.mealAgent.addFoodToMeal(mealId, userId, foods);
    }

    @Authorized()
    @Delete('/:mealId')
    async deleteMeal(@CurrentUser() userId: number, @Param('mealId') mealId: number, @Res() res: Response) {
        const meal = await this.mealAgent.deleteMeal(mealId, userId);
        return { message: 'Meal has been deleted successfully' };
    }

    @Authorized()
    @Delete('/:mealId/foods/:foodId')
    async removeFoodFromMeal(@CurrentUser() userId: number, @Param('mealId') mealId: number, @Param('foodId') foodId: number, @Res() res: Response) {
        const food = await this.foodAgent.getFoodById(foodId, userId);
        return await this.mealAgent.removeFoodFromMeal(mealId, userId, food);
    }
}
