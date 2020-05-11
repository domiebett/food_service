import 'mocha';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as FoodData from '../../bin/data/FoodData';
import { request as req } from '../../bin/lib/Request';
import {Application } from 'express';
import { Connection } from 'typeorm';
import { ExpressConfig } from '../../../src/middleware/config/ExpressConfig';
import { Database } from '../../bin/setup/Database';
import { FoodAgent } from '../../../src/data-layer/data-agent';

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
            await agent.addFood(FoodData.foodObj, 1);
        });

        it('should get foods successfully', async () => {
            const response = await request.get('/foods');
            expect(response.status).to.equal(200);
            expect(response.body.data[0].name).to.be.equal(FoodData.foodObj.name);
        });

        it('should get single food record', async () => {
            const response = await request.get('/foods/1');
            expect(response.status).to.equal(200);
            expect(response.body.data.name).to.be.equal(FoodData.foodObj.name);
        });

        it('should reject attempt to get non existent food item', async () => {
            const response = await request.get('/foods/2');
            expect(response.status).to.equal(404);
            expect(response.body.name).to.be.equal('NotFoundError');
            expect(response.body.message).to.be.equal('Could not find any entity of type "Food" matching: 2')
        });
    });

    describe('#POST /foods', () => {
        it('should add food successfully', async () => {
            const response = await request.post('/foods', FoodData.foodObj2);
            expect(response.status).to.equal(201);
            expect(response.body.data.name).to.equal(FoodData.foodObj2.name);
        });

        it('should reject empty food name', async () => {
            const response = await request.post('/foods', FoodData.emptyFoodNameObj);
            expect(response.status).to.equal(400);
            expect(response.body.errors[0].constraints).to.haveOwnProperty('minLength');
        });
    });

    describe('#PUT /foods/:id', () => {
        beforeEach(async () => {
            await agent.addFood(FoodData.foodObj, 1);
        });

        it('should edit successfully', async () => {
            const response = await request.put('/foods/1', FoodData.foodObj2);
            expect(response.status).to.equal(201);
            expect(response.body.data.name).to.equal(FoodData.foodObj2.name);
        });

        it('should reject empty food name', async () => {
            const response = await request.put('/foods/1', FoodData.emptyFoodNameObj);
            expect(response.status).to.equal(400);
            expect(response.body.errors[0].constraints).to.haveOwnProperty('minLength');
        });
    });

    describe('#DELETE /foods/:id', () => {
        beforeEach(async () => {
            await agent.addFood(FoodData.foodObj, 1);
        });

        it('should delete successfully', async () => {
            const response = await request.delete('/foods/1');
            expect(response.status).to.equal(200);
            expect(response.body.data.message).to.equal(`${FoodData.foodObj.name} was deleted successfully`);
        });

        it('should reject wrong food id', async () => {
            const response = await request.delete('/foods/2');
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
