import { JsonController, Get, Req, Res, Post, Param, Body, Delete, Put, Authorized, CurrentUser, HttpCode, OnUndefined } from 'routing-controllers';
import { FoodAgent } from '../../data-layer/data-agent/FoodAgent';
import { Request, Response } from 'express';
import { Food, IUser } from '../../data-layer/entity';

@JsonController('/foods')
export class FoodController {
    constructor(private foodAgent: FoodAgent) { }

    @Authorized()
    @Get()
    async getAllFoods(@CurrentUser() currentUser: IUser, @Req() req: Request, @Res() res: Response) {
        return await this.foodAgent.getAllFood(currentUser.id);
    }

    @Authorized()
    @HttpCode(201)
    @Post()
    async addFood(@CurrentUser() currentUser: IUser, @Body({ validate: true }) requestBody: Food, @Req() req: Request, @Res() res: Response) {
        return await this.foodAgent.addFood(requestBody, currentUser.id);
    }

    @Authorized()
    @Get('/:foodId')
    async getFoodById(@CurrentUser() currentUser: IUser, @Param('foodId') foodId: number, @Req() req: Request, @Res() res: Response) {
        return await this.foodAgent.getFoodById(foodId, currentUser.id);
    }

    @Authorized()
    @Delete('/:foodId')
    async deleteFood(@CurrentUser() currentUser: IUser, @Param('foodId') foodId: number, @Req() req: Request, @Res() res: Response) {
        const food = await this.foodAgent.deleteFood(foodId, currentUser.id);
        return { message: `${food.name} was deleted successfully` };
    }

    @Authorized()
    @HttpCode(201)
    @Put('/:foodId')
    async editFood(@CurrentUser() currentUser: IUser, @Param('foodId') foodId: number, @Body() requestBody: any, @Res() res: Response) {
        return await this.foodAgent.editFood(foodId, requestBody, currentUser.id);
    }
}
