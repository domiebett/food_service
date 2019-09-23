import { JsonController, Get, Req, Res, Post, Param, Body, Delete, Put, Authorized, CurrentUser, HttpCode } from 'routing-controllers';
import { FoodAgent } from '../../data-layer/data-agent/FoodAgent';
import { Request, Response } from 'express';
import { IFood, FoodType } from '../../data-layer/entity/Food';

@JsonController('/foods')
export class FoodController {
    constructor(private foodAgent: FoodAgent) { }

    @Authorized()
    @Get()
    async getAllFoods(@CurrentUser() currentUserId: number, @Req() req: Request, @Res() res: Response) {
        return await this.foodAgent.getAllFood(currentUserId);
    }

    @Authorized()
    @HttpCode(201)
    @Post()
    async addFood(@CurrentUser() currentUserId: number, @Body() requestBody: IFood, @Req() req: Request, @Res() res: Response) {
        return await this.foodAgent.addFood(requestBody, currentUserId);
    }

    @Authorized()
    @Get('/:foodId')
    async getFoodById(@CurrentUser() currentUserId: number, @Param('foodId') foodId: number, @Req() req: Request, @Res() res: Response) {
        return await this.foodAgent.getFoodById(foodId, currentUserId);
    }

    @Authorized()
    @Delete('/:foodId')
    async deleteFood(@CurrentUser() currentUserId: number, @Param('foodId') foodId: number, @Req() req: Request, @Res() res: Response) {
        const food = await this.foodAgent.deleteFood(foodId, currentUserId);
        return { message: `${food.name} was deleted successfully` };
    }

    @Authorized()
    @HttpCode(201)
    @Put('/:foodId')
    async editFood(@CurrentUser() currentUserId: number, @Param('foodId') foodId: number, @Body() requestBody: any, @Res() res: Response) {
        return await this.foodAgent.editFood(foodId, requestBody, currentUserId);
    }
}
