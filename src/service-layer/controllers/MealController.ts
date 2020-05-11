import { JsonController, Get, Res, Post, Body, Put, Param, QueryParam, Delete, Authorized, CurrentUser, HttpCode } from 'routing-controllers';
import { MealAgent, FoodAgent } from '../../data-layer/data-agent';
import {MealType, IUser, Food, IMeal} from '../../data-layer/entity';

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
            return await this.mealAgent.getByIds(ids, currentUser.id, ['foods']);
        }
        return await this.mealAgent.getAll(currentUser.id, ['foods']);
    }

    @Authorized()
    @HttpCode(201)
    @Post()
    async addMeal(@CurrentUser() currentUser: IUser, @Body() requestBody: IMeal) {
        // default to dinner.
        requestBody.type = requestBody.type || MealType.DINNER;
        // make sure meal is in MealType enum
        requestBody.type = MealType[requestBody.type.toUpperCase()];

        const foods = <Food[]> await this.foodAgent.getByIds(requestBody.foodIds || [], currentUser.id);
        return await this.mealAgent.addMeal(requestBody, currentUser.id, foods);
    }

    @Authorized()
    @Get('/:mealId')
    async getSingleMeal(@CurrentUser() currentUser: IUser, @Param('mealId') mealId: number) {
        return await this.mealAgent.getById(mealId, currentUser.id, ['foods']);
    }

    @Authorized()
    @Get('/:mealId/foods')
    async getFoodsInMeal(@CurrentUser() currentUser: IUser, @Param('mealId') mealId: number, @Body() requestBody) {
        const meal = await this.mealAgent.getById(mealId, currentUser.id, ['foods']);
        return meal.foods;
    }

    @Authorized()
    @HttpCode(201)
    @Put('/:mealId')
    async updateMeal(@CurrentUser() currentUser: IUser, @Param('mealId') mealId: number, @Body() requestBody) {
        requestBody.type = MealType[requestBody.type.toUpperCase()];
        const foods = <Food[]> await this.foodAgent.getByIds(requestBody.foodIds || [], currentUser.id);
        return await this.mealAgent.updateMeal(mealId, requestBody, currentUser.id, foods);
    }

    @Authorized()
    @HttpCode(201)
    @Post('/:mealId/foods')
    async addFoodToMeal(@CurrentUser() currentUser: IUser, @Param('mealId') mealId: number, @Body() requestBody) {
        const foods = <Food[]> await this.foodAgent.getByIds(requestBody.foodIds || [], currentUser.id);
        return await this.mealAgent.addFoodToMeal(mealId, currentUser.id, foods);
    }

    @Authorized()
    @Delete('/:mealId')
    async deleteMeal(@CurrentUser() currentUser: IUser, @Param('mealId') mealId: number) {
        const meal = await this.mealAgent.destroy(mealId, currentUser.id);
        return { message: 'Meal has been deleted successfully' };
    }

    @Authorized()
    @Delete('/:mealId/foods/:foodId')
    async removeFoodFromMeal(@CurrentUser() currentUser: IUser, @Param('mealId') mealId: number, @Param('foodId') foodId: number) {
        const food = await this.foodAgent.getById(foodId, currentUser.id);
        return await this.mealAgent.removeFoodFromMeal(mealId, currentUser.id, food);
    }
}
