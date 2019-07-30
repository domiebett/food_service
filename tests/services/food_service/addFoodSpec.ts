import { FoodController } from '../../../src/service-layer/controllers/FoodController';
import { FoodAgent } from '../../../src/data-layer/data-agent';
import { FoodType } from '../../../src/data-layer/entity/Food';
import { Request, Response } from 'express-serve-static-core';
import { expect } from 'chai';

describe('Food Controller Tests', () => {
    it('should add a food item', () => {
        const foodController = new FoodController();
        let response = foodController.addFood({name: 'Test Name', price: 100, type: FoodType.Starch}, new Request(), new Response());
    });
});
