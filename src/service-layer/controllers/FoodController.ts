import { JsonController, Get, Req, Res, Post, Param, Body, Delete, Put } from 'routing-controllers';
import { FoodAgent } from '../../data-layer/data-agent/FoodAgent';
import { Request, Response } from 'express';
import { IFood, FoodType } from '../../data-layer/entity/Food';

@JsonController('/foods')
export class FoodController {
    private foodAgent: FoodAgent;

    constructor() {
        this.foodAgent = new FoodAgent();
    }

    @Get()
    async getAllFoods(@Req() req: Request, @Res() res: Response) {
        const allFoods: IFood[] = await this.foodAgent.getAllFood();

        return res.status(200).json({ foods: allFoods });
    }

    @Post()
    async addFood(@Body() requestBody: IFood, @Req() req: Request, @Res() res: Response) {
        const food = await this.foodAgent.addFood(requestBody);

        return res.status(201).json({ food: food });
    }

    @Get('/:foodId')
    async getFoodById(@Param('foodId') foodId: number, @Req() req: Request, @Res() res: Response) {
        const food = await this.foodAgent.getFoodById(foodId);

        return res.status(200).json({ food: food });
    }

    @Delete('/:foodId')
    async deleteFood(@Param('foodId') foodId: number, @Req() req: Request, @Res() res: Response) {
        const food = await this.foodAgent.deleteFood(foodId);

        return res.status(200).json({ message: `${food.name} was successfully deleted`});
    }

    @Put('/:foodId')
    async editFood(@Param('foodId') foodId: number, @Body() requestBody: any, @Res() res: Response) {
        const food = await this.foodAgent.editFood(foodId, requestBody);

        return res.status(201).json({ food: food });
    }
}
