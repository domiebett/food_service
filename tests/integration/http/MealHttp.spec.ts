import 'mocha';
import { expect } from 'chai';
import * as req from 'supertest';
import * as FoodData from '../../bin/data/FoodData';
import * as MealData from '../../bin/data/MealData';
import { Application } from 'express';
import { Connection } from 'typeorm';
import { ExpressConfig } from '../../../src/middleware/config/ExpressConfig';
import { Database } from '../../bin/setup/Database';
import { MealAgent, FoodAgent } from '../../../src/data-layer/data-agent';
import { IFood, Food } from '../../../src/data-layer/entity';

describe('Meal Routes Integration Tests', () => {
    const app: Application = new ExpressConfig().app;
    const request = req(app);
    let connection: Connection;
    let mealAgent: MealAgent;
    let foodAgent: FoodAgent;
    let foods: Food[];

    before(async () => {
        connection = await Database.createTestConnection();
        await connection.synchronize();
        mealAgent = new MealAgent();
        foodAgent = new FoodAgent();
    });

    beforeEach(async () => {
        await foodAgent.addFood(FoodData.foodObj);
    });

    describe('#GET /meals', () => {
        beforeEach(async () => {
            foods = await foodAgent.getFoodByIds([1])
            await mealAgent.addMeal(MealData.mealObj, foods);
        });

        it('should get meals successfully', async () => {
            let response = await request.get('/meals');
            expect(response.status).to.equal(200);
            expect(response.body.meals).to.have.lengthOf(1);
            expect(response.body.meals[0].type).to.equal(MealData.mealObj.type);
            expect(response.body.meals[0].foods).to.have.lengthOf(1);
            expect(response.body.meals[0].foods[0].name).to.equal(foods[0].name);
        });

        it('should get single meal successfully', async () => {
            let response = await request.get('/meals/1');
            expect(response.status).to.equal(200);
            expect(response.body.meal.type).to.equal(MealData.mealObj.type);
            expect(response.body.meal.foods).to.have.lengthOf(1);
            expect(response.body.meal.foods[0].name).to.equal(foods[0].name);
        });

        it('should reject attempt to get nonexistent meal', async () => {
            let response = await request.get('/meals/2');
            expect(response.status).to.equal(404);
            expect(response.body.name).to.equal('EntityNotFound');
        });
    });

    describe('#POST /meals', () => {
        it('should add a meal without foods', async () => {
            let response = await request.post('/meals').send(MealData.mealObj);
            expect(response.status).to.equal(201);
            expect(response.body.meal.type).to.equal(MealData.mealObj.type);

            let meal = await mealAgent.getMeal(1);
            expect(meal.foods).to.have.lengthOf(0);
        });
    });

    afterEach(async () => {
        await connection.synchronize(true);
    });

    after(async () => {
        await connection.close();
    });
});