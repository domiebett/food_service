import { JsonController, Get, Req, Res, Post, Param, Body, Delete, Put, Authorized, CurrentUser } from 'routing-controllers';
import { FoodAgent } from '../../data-layer/data-agent/FoodAgent';
import { Request, Response } from 'express';
import { IFood, FoodType } from '../../data-layer/entity/Food';

@JsonController('/foods')
export class FoodController {
    constructor(private foodAgent: FoodAgent) { }

    @Authorized()
    @Get()
    async getAllFoods(@CurrentUser() currentUserId: number, @Req() req: Request, @Res() res: Response) {
        const allFoods: IFood[] = await this.foodAgent.getAllFood(currentUserId);

        return res.status(200).json({ foods: allFoods });
    }

    @Authorized()
    @Post()
    async addFood(@CurrentUser() currentUserId: number, @Body() requestBody: IFood, @Req() req: Request, @Res() res: Response) {
        const food = await this.foodAgent.addFood(requestBody, currentUserId);

        return res.status(201).json({ food: food });
    }

    @Authorized()
    @Get('/:foodId')
    async getFoodById(@CurrentUser() currentUserId: number, @Param('foodId') foodId: number, @Req() req: Request, @Res() res: Response) {
        const food = await this.foodAgent.getFoodById(foodId, currentUserId);

        return res.status(200).json({ food: food });
    }

    @Authorized()
    @Delete('/:foodId')
    async deleteFood(@CurrentUser() currentUserId: number, @Param('foodId') foodId: number, @Req() req: Request, @Res() res: Response) {
        const food = await this.foodAgent.deleteFood(foodId, currentUserId);

        return res.status(200).json({ message: `${food.name} was successfully deleted`});
    }

    @Authorized()
    @Put('/:foodId')
    async editFood(@CurrentUser() currentUserId: number, @Param('foodId') foodId: number, @Body() requestBody: any, @Res() res: Response) {
        const food = await this.foodAgent.editFood(foodId, requestBody, currentUserId);

        return res.status(201).json({ food: food });
    }
}
