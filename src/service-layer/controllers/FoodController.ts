import { JsonController, Get, Req, Res, Post, Param, Body } from 'routing-controllers';
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
    async addFood(@Body() requestBody: any, @Req() req: Request, @Res() res: Response) {
        console.log('first', requestBody.type);

        requestBody.type = FoodType[requestBody.type];

        console.log('last', requestBody.type);

        const food = await this.foodAgent.addFood(requestBody);

        return res.status(201).json({ food: food });
    }
}
