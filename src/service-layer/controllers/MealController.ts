import { JsonController, Get, Res, Post, Body, Put, Param, QueryParam, Delete, Authorized, CurrentUser, HttpCode } from 'routing-controllers';
import { Response } from 'express';
import { MealAgent, FoodAgent } from '../../data-layer/data-agent';
import { MealType, IUser } from '../../data-layer/entity';

@JsonController('/meals')
export class MealController {
    constructor(
        private mealAgent: MealAgent,
        private foodAgent: FoodAgent
    ) { }

    @Authorized()
    @Get()
    async getAllMeals(@CurrentUser() currentUser: IUser, @QueryParam('mealIds') mealIds: string) {
        if (mealIds) {
            let ids = mealIds.split(',').map((id) => parseInt(id));
            return await this.mealAgent.getMealsWithIds(ids, currentUser.id);
        }
        return await this.mealAgent.getMeals(currentUser.id);
    }

    @Authorized()
    @HttpCode(201)
    @Post()
    async addMeal(@CurrentUser() currentUser: IUser, @Body() requestBody) {
        requestBody.type = MealType[requestBody.type];
        const foods = await this.foodAgent.getFoodByIds(requestBody.foods || [], currentUser.id);
        return await this.mealAgent.addMeal(requestBody, currentUser.id, foods);
    }

    @Authorized()
    @Get('/:mealId')
    async getSingleMeal(@CurrentUser() currentUser: IUser, @Param('mealId') mealId: number) {
        return await this.mealAgent.getMeal(mealId, currentUser.id);
    }

    @Authorized()
    @HttpCode(201)
    @Put('/:mealId')
    async updateMeal(@CurrentUser() currentUser: IUser, @Param('mealId') mealId: number, @Body() requestBody) {
        const foods = await this.foodAgent.getFoodByIds(requestBody.foods || [], currentUser.id);
        return await this.mealAgent.updateMeal(mealId, requestBody, currentUser.id, foods);
    }

    @Authorized()
    @HttpCode(201)
    @Post('/:mealId/foods')
    async addFoodToMeal(@CurrentUser() currentUser: IUser, @Param('mealId') mealId: number, @Body() requestBody) {
        const foods = await this.foodAgent.getFoodByIds(requestBody.foods || [], currentUser.id);
        return await this.mealAgent.addFoodToMeal(mealId, currentUser.id, foods);
    }

    @Authorized()
    @Delete('/:mealId')
    async deleteMeal(@CurrentUser() currentUser: IUser, @Param('mealId') mealId: number) {
        const meal = await this.mealAgent.deleteMeal(mealId, currentUser.id);
        return { message: 'Meal has been deleted successfully' };
    }

    @Authorized()
    @Delete('/:mealId/foods/:foodId')
    async removeFoodFromMeal(@CurrentUser() currentUser: IUser, @Param('mealId') mealId: number, @Param('foodId') foodId: number) {
        const food = await this.foodAgent.getFoodById(foodId, currentUser.id);
        return await this.mealAgent.removeFoodFromMeal(mealId, currentUser.id, food);
    }
}
