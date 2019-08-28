import 'mocha';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as req from 'supertest';
import {Application } from 'express';
import { ExpressConfig } from '../../../src/middleware/config/ExpressConfig';
import { Database } from '../../bin/setup/Database';
import { Connection } from 'typeorm';
import { FoodAgent } from '../../../src/data-layer/data-agent';
import * as FoodData from '../../bin/data/FoodData';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Food Routes Integration Tests', () => {
    const app: Application = new ExpressConfig().app;
    const request = req(app);
    let connection: Connection;
    let agent: FoodAgent;

    before(async () => {
        connection = await Database.createTestConnection();
        await connection.synchronize();
        agent = new FoodAgent();
    });

    describe('#GET /foods', () => {
        beforeEach(async () => {
            await agent.addFood(FoodData.foodObj);
        });

        it('should get foods successfully', async () => {
            const response = await request.get('/foods');
            expect(response.status).to.equal(200);
            expect(response.body.foods[0].name).to.be.equal(FoodData.foodObj.name);
        });

        it('should get single food record', async () => {
            const response = await request.get('/foods/1');
            expect(response.status).to.equal(200);
            expect(response.body.food.name).to.be.equal(FoodData.foodObj.name);
        });

        it('should reject attempt to get non existent food item', async () => {
            const response = await request.get('/foods/2');
            expect(response.status).to.equal(404);
            expect(response.body.name).to.be.equal('EntityNotFound');
            expect(response.body.message).to.be.equal('Could not find any entity of type "Food" matching: 2')
        });
    });

    describe('#POST /foods', () => {
        it('should add food successfully', async () => {
            const response = await request.post('/foods').send(FoodData.foodObj2);
            expect(response.status).to.equal(201);
            expect(response.body.food.name).to.equal(FoodData.foodObj2.name);
        });

        it('should reject wrong food type', async () => {
            const response = await request.post('/foods').send(FoodData.wrongFoodTypeObj);
            expect(response.status).to.equal(422);
            expect(response.body.name).to.equal('Validation Error');
            expect(response.body.constraints.type).to.haveOwnProperty('isIn');
        });

        it('should reject empty food name', async () => {
            const response = await request.post('/foods').send(FoodData.emptyFoodNameObj);
            expect(response.status).to.equal(422);
            expect(response.body.constraints.name).to.haveOwnProperty('minLength');
        });
    });

    describe('#PUT /foods/:id', () => {
        beforeEach(async () => {
            await agent.addFood(FoodData.foodObj);
        });

        it('should edit successfully', async () => {
            const response = await request.put('/foods/1').send(FoodData.foodObj2);
            expect(response.status).to.equal(201);
            expect(response.body.food.name).to.equal(FoodData.foodObj2.name);
        });

        it('should reject empty food name', async () => {
            const response = await request.put('/foods/1').send(FoodData.emptyFoodNameObj);
            expect(response.status).to.equal(422);
            expect(response.body.constraints.name).to.haveOwnProperty('minLength');
        });

        it('should reject wrong food type', async () => {
            const response = await request.put('/foods/1').send(FoodData.wrongFoodTypeObj);
            expect(response.status).to.equal(422);
            expect(response.body.name).to.equal('Validation Error');
            expect(response.body.constraints.type).to.haveOwnProperty('isIn');
        });
    });

    describe('#DELETE /foods/:id', () => {
        beforeEach(async () => {
            await agent.addFood(FoodData.foodObj);
        });

        it('should delete successfully', async () => {
            const response = await request.delete('/foods/1');
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal(`${FoodData.foodObj.name} was successfully deleted`);
        });

        it('should reject wrong food id', async () => {
            const response = await request.delete('/foods/2');
            expect(response.status).to.equal(404);
            expect(response.body.name).to.equal('EntityNotFound');
        });
    });

    afterEach(async () => {
        await connection.synchronize(true);
    });

    after(async () => {
        await connection.close();
    });
});
