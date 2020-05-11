import 'mocha';
import chai = require('chai');
import * as chaiAsPromised from 'chai-as-promised';
import { FoodAgent } from '../../../../src/data-layer/data-agent';
import { Database } from '../../../bin/setup/Database';
import { Connection } from 'typeorm';
import * as FoodData from '../../../bin/data/FoodData';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Food Agent', () => {
    let connection: Connection;
    let agent: FoodAgent;
    let result;

    before(async () => {
        connection = await Database.createTestConnection();
        await connection.synchronize();
        agent = new FoodAgent();
    });

    beforeEach(async () => {
        result = await agent.addFood(FoodData.foodObj, 1);
    });

    describe('Add Food', async () => {
        it('should successfully add food to database', async () => {
            expect(result.id).to.be.equal(1);
            expect(result.name).to.be.equal(FoodData.foodObj.name);
        });

        it('should not insert duplicate records', async () => {
            expect(agent.addFood(FoodData.foodObj, 1)).to.be.rejected;
        });

        it('should reject invalid request obj name', async () => {
            expect(agent.addFood(FoodData.emptyFoodNameObj, 1)).to.be.rejected;
        });
    });

    describe('Get Food', async () => {
        it('should get all foods successfully', async () => {
            const result = await agent.getAll(1);
            expect(result.length).to.be.equal(1);
            expect(result[0].id).to.be.equal(1);
            expect(result[0].name).to.be.equal(FoodData.foodObj.name);
        });

        it('should get food by id', async () => {
            const result = await agent.getById(1, 1);
            expect(result).to.haveOwnProperty('id');
            expect(result.name).to.be.equal(FoodData.foodObj.name);
        });

        it('shouldn\'t get food by non existent id', async () => {
            expect(agent.getById(1000, 1)).to.be.rejected;
        });
    });

    describe('Delete Food', async () => {
        it('should delete food successfully', async () => {
            const result = await agent.destroy(1, 1);
            expect(result.name).to.be.equal(FoodData.foodObj.name);
        });

        it('should reject deletion by wrong id', () => {
            expect(agent.destroy(1000, 1)).to.be.rejected;
        });
    });

    describe('Update Food', async() => {
        it('should update food successfully', async () => {
            let result = await agent.editFood(1, {name: 'Second Sample'}, 1);
            expect(result.id).to.be.equal(1);
            expect(result.name).to.be.equal('Second Sample');
        });

        it('should reject update with invalid request body', async () => {
            expect(agent.editFood(1, {name: ''}, 1)).to.be.rejected;
        });
    });

    afterEach(async () => {
        // drop and recreate tables
        await connection.synchronize(true);
    });

    after(async () => {
        await connection.close();
    });
});
