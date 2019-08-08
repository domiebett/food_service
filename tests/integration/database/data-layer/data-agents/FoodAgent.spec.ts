import 'mocha';
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import { FoodAgent } from '../../../../../src/data-layer/data-agent';
import { IFood, FoodType, Food } from '../../../../../src/data-layer/entity';
import { Database } from '../../../../setup/Database';
import { getConnection, Connection, QueryFailedError } from 'typeorm';

const expect = chai.expect
chai.use(chaiAsPromised);
const correctRequestObj: IFood = {
    name: 'Sample Food',
    type: FoodType.Starch,
    price: 50
};

describe('Food', () => {
    let connection: Connection;
    let repository;
    let agent: FoodAgent;
    let result;

    before(async () => {
        connection = await Database.createTestConnection();
        await connection.synchronize();
        repository = await getConnection('test').getRepository(Food);
        agent = new FoodAgent(repository);
    });

    beforeEach(async () => {
        result = await agent.addFood(correctRequestObj);
    });

    describe('add food', async () => {
        it('should successfully add food to database', async () => {
            expect(result.id).to.be.equal(1);
            expect(result.name).to.be.equal(correctRequestObj.name);
            expect(result.type).to.be.equal(correctRequestObj.type);
            expect(result.price).to.be.equal(correctRequestObj.price);
        });

        it('should not insert duplicate records', async () => {
            expect(agent.addFood(correctRequestObj)).to.be.rejected;
        });

        it('should reject invalid request obj name', async () => {
            let wrongRequestObj = Object.assign({}, correctRequestObj);
            wrongRequestObj.name = '';
            expect(agent.addFood(wrongRequestObj)).to.be.rejected;
        });
    });

    describe('get food', async () => {
        it('should get all foods successfully', async () => {
            const result = await agent.getAllFood();
            expect(result.length).to.be.equal(1);
            expect(result[0].id).to.be.equal(1);
            expect(result[0].name).to.be.equal(correctRequestObj.name);
            expect(result[0].type).to.be.equal(correctRequestObj.type);
            expect(result[0].price).to.be.equal(correctRequestObj.price);
        });

        it('should get food by id', async () => {
            const result = await agent.getFoodById(1);
            expect(result).to.haveOwnProperty('id');
            expect(result.name).to.be.equal(correctRequestObj.name);
            expect(result.type).to.be.equal(correctRequestObj.type);
            expect(result.price).to.be.equal(correctRequestObj.price);
        });

        it('shouldn\'t get food by non existent id', async () => {
            expect(agent.getFoodById(1000)).to.be.rejected;
        });
    });

    describe('delete food', async () => {
        it('should delete food successfully', async () => {
            const result = await agent.deleteFood(1);
            expect(result.name).to.be.equal(correctRequestObj.name);
            expect(result.type).to.be.equal(correctRequestObj.type);
            expect(result.price).to.be.equal(correctRequestObj.price);
        });

        it('should reject deletion by wrong id', () => {
            expect(agent.deleteFood(1000)).to.be.rejected;
        });
    });

    describe('update food', async() => {
        it('should update food successfully', async () => {
            let result = await agent.editFood(1, {name: 'Second Sample'});
            expect(result.id).to.be.equal(1);
            expect(result.name).to.be.equal('Second Sample');
            expect(result.type).to.be.equal(correctRequestObj.type);

            result = await agent.editFood(1, {type: FoodType.Drink});
            expect(result.type).to.be.equal(FoodType.Drink);

            result = await agent.editFood(1, { price: 500});
            expect(result.price).to.be.equal(500);
        });

        it('should reject update with invalid request body', async () => {
            expect(agent.editFood(1, {name: ''})).to.be.rejected;
        });
    });

    afterEach(async () => {
        await connection.synchronize(true);
    });

    after(async () => {
        await connection.close();
    });
});
