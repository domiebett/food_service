import { JsonController, Get, Req, Res, Post, Param, Body, Delete, Put, Authorized, CurrentUser, HttpCode, OnUndefined } from 'routing-controllers';
import { FoodAgent } from '../../data-layer/data-agent';
import { Food, IUser, IFood } from '../../data-layer/entity';

@JsonController('/foods')
export class FoodController {
    constructor(private foodAgent: FoodAgent) { }

    @Authorized()
    @Get()
    async getAllFoods(@CurrentUser() currentUser: IUser) {
        return await this.foodAgent.getAll(currentUser.id);
    }

    @Authorized()
    @HttpCode(201)
    @Post()
    async addFood(@CurrentUser() currentUser: IUser, @Body() requestBody: IFood) {
        return await this.foodAgent.addFood(requestBody, currentUser.id);
    }

    @Authorized()
    @Get('/:foodId')
    async getFoodById(@CurrentUser() currentUser: IUser, @Param('foodId') foodId: number) {
        return await this.foodAgent.getById(foodId, currentUser.id);
    }

    @Authorized()
    @Delete('/:foodId')
    async deleteFood(@CurrentUser() currentUser: IUser, @Param('foodId') foodId: number) {
        const food = await this.foodAgent.destroy(foodId, currentUser.id);
        return { message: `${food.name} was deleted successfully` };
    }

    @Authorized()
    @HttpCode(201)
    @Put('/:foodId')
    async editFood(@CurrentUser() currentUser: IUser, @Param('foodId') foodId: number, @Body() requestBody: any) {
        return await this.foodAgent.editFood(foodId, requestBody, currentUser.id);
    }
}
