import 'mocha';
import { expect } from 'chai';
import { request as req } from '../../bin/lib/Request';
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
        await foodAgent.addFood(FoodData.foodObj, 1);
    });

    describe('#GET /meals', () => {
        beforeEach(async () => {
            foods = <Food[]>await foodAgent.getByIds([1], 1);
            await mealAgent.addMeal(MealData.mealObj, 1, foods);
        });

        it('should get meals successfully', async () => {
            let response = await request.get('/meals');
            expect(response.status).to.equal(200);
            expect(response.body.data).to.have.lengthOf(1);
            expect(response.body.data[0].type).to.equal(MealData.mealObj.type);
            expect(response.body.data[0].foods).to.have.lengthOf(1);
            expect(response.body.data[0].foods[0].name).to.equal(foods[0].name);
        });

        it('should get single meal successfully', async () => {
            let response = await request.get('/meals/1');
            expect(response.status).to.equal(200);
            expect(response.body.data.type).to.equal(MealData.mealObj.type);
            expect(response.body.data.foods).to.have.lengthOf(1);
            expect(response.body.data.foods[0].name).to.equal(foods[0].name);
        });

        it('should reject attempt to get nonexistent meal', async () => {
            let response = await request.get('/meals/2');
            expect(response.status).to.equal(404);
            expect(response.body.name).to.equal('NotFoundError');
        });
    });

    describe('#POST /meals', () => {
        it('should add a meal without foods', async () => {
            let response = await request.post('/meals', MealData.mealObj);
            expect(response.status).to.equal(201);
            expect(response.body.data.type).to.equal(MealData.mealObj.type);
            expect(response.body.data.foods).to.have.lengthOf(0);
        });

        it('should reject meal with invalid type', async () => {
            let response = await request.post('/meals', MealData.invalidTypeMealObj);
            expect(response.status).to.equal(400);
            expect(response.body.name).to.equal('BadRequestError');
            expect(response.body.errors[0].field).to.equal('type');
        });
    });

    describe('#PUT /meals', () => {
        beforeEach(async () => {
            await mealAgent.addMeal(MealData.mealObj, 1);
        });

        it('should edit a meal successfully', async () => {
            let response = await request.put('/meals/1', {type: 'breakfast'});
            expect(response.status).to.equal(201);
            expect(response.body.data.type).to.equal('breakfast');
        });

        it('should reject wrong meal type on edit', async () => {
            let response = await request.put('/meals/1', {type: 'Wrong'});
            expect(response.status).to.equal(400);
            expect(response.body.name).to.equal('BadRequestError');
            expect(response.body.errors[0].field).to.equal('type');
        });

        it('should reject editing nonexistent meal', async () => {
            let response = await request.put('/meals/2', {});
            expect(response.status).to.equal(404);
            expect(response.body.name).to.equal('NotFoundError');
        });
    });

    describe('#DELETE /meals', () => {
        beforeEach(async () => {
            await mealAgent.addMeal(MealData.mealObj, 1);
        });

        it('should delete meal successfully', async () => {
            let response = await request.delete('/meals/1');
            expect(response.status).to.equal(200);
            expect(response.body.data.message).to.equal('Meal has been deleted successfully');
        });

        it('should reject deletion of wrong meal id', async () => {
            let response = await request.delete('/meals/2');
            expect(response.status).to.equal(404);
            expect(response.body.name).to.equal('NotFoundError');
        });
    });

    afterEach(async () => {
        await connection.synchronize(true);
    });

    after(async () => {
        await connection.close();
    });
});