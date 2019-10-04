import 'mocha';
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import { MealAgent, FoodAgent } from '../../../../../src/data-layer/data-agent';
import { MealType, FoodType } from '../../../../../src/data-layer/entity';
import { Database } from '../../../../bin/setup/Database';
import { Connection } from 'typeorm';

const expect = chai.expect;
chai.use(chaiAsPromised);
const correctRequestObj = {
    type: MealType.Dinner,
}
const foodRequestObj = {
    name: 'Sample Food',
    type: FoodType.Starch,
    price: 50
};

describe('Meal Agent', () => {
    let connection: Connection;
    let agent: MealAgent;
    let foodAgent: FoodAgent;

    before(async() => {
        connection = await Database.createTestConnection();
        await connection.synchronize();
        agent = new MealAgent();
        foodAgent = new FoodAgent();
    });

    describe('Add Meal', () => {
        it('should add meal without food successfully', async () => {
            let result = await agent.addMeal(correctRequestObj, 1);
            expect(result.id).to.be.equal(1);
            expect(result.type).to.be.equal(correctRequestObj.type);
            expect(result.foods).to.be.undefined;
        });

        it('should add meal with food successfully', async () => {
            let food = await foodAgent.addFood(foodRequestObj, 1);
            let result = await agent.addMeal(correctRequestObj, 1, [food]);
            expect(result.id).to.be.equal(1);
            expect(result.foods.length).to.be.equal(1);
            expect(result.foods[0].name).to.be.equal(foodRequestObj.name);
        });

        it('should reject meal with wrong type', async() => {
            let requestObj = Object.apply({}, correctRequestObj);
            requestObj.type = 'WrongType';
            expect(agent.addMeal(requestObj, 1)).to.be.rejected;
        });
    });

    describe('Get Meal', async () => {
        it('should get all meals', async () => {
            let food = await foodAgent.addFood(foodRequestObj, 1);
            await agent.addMeal(correctRequestObj, 1, [food]);
            let result = await agent.getMeals(1);
            expect(result.length).to.be.equal(1);
            expect(result[0].type).to.be.equal(correctRequestObj.type);
            expect(result[0].id).to.be.equal(1);
            expect(result[0].foods[0].name).to.be.equal(foodRequestObj.name);
        });

        it('should get single meal with id', async () => {
            let food = await foodAgent.addFood(foodRequestObj, 1);
            await agent.addMeal(correctRequestObj, 1, [food]);
            let result = await agent.getMeal(1, 1);
            expect(result.type).to.be.equal(correctRequestObj.type);
            expect(result.foods[0].name).to.be.equal(foodRequestObj.name);
        });

        it('should reject wrong id', async () => {
            expect(agent.getMeal(1000, 1)).to.be.rejected;
        });

        it('should get meals with ids', async () => {
            await agent.addMeal(correctRequestObj, 1);
            await agent.addMeal(correctRequestObj, 1);
            await agent.addMeal(correctRequestObj, 1);
            let result = await agent.getMealsWithIds([1, 3], 1);
            expect(result.length).to.be.equal(2);
            expect(result[1].id).to.be.equal(3);
        });
    });

    describe('Update Meal', async () => {
        it('should update meal successfully', async () => {
            await agent.addMeal(correctRequestObj, 1);
            let food = await foodAgent.addFood(foodRequestObj, 1);
            let result = await agent.updateMeal(1, {type: MealType.Breakfast}, 1, [food]);
            expect(result.id).to.be.equal(1);
            expect(result.type).to.be.equal(MealType.Breakfast);
            expect(result.foods.length).to.be.equal(1);
            expect(result.foods[0].name).to.be.equal(foodRequestObj.name);
        });

        it('should reject wrong id', async() => {
            expect(agent.updateMeal(1000, {}, 1)).to.be.rejected;
        });
    });

    describe('Delete Meal', async () => {
        it('should delete a meal', async () => {
            await agent.addMeal(correctRequestObj, 1);
            let result = await agent.deleteMeal(1, 1);
            expect(result.type).to.be.equal(correctRequestObj.type);
            expect(agent.getMeal(1, 1)).to.be.rejected;
        });

        it('should reject deletion for wrong id', async () => {
            expect(agent.deleteMeal(1000, 1)).to.be.rejected;
        });
    });

    describe('Food in Meal', () => {
        let result;
        let food;
        beforeEach(async () => {
            await agent.addMeal(correctRequestObj, 1);
            food = await foodAgent.addFood(foodRequestObj, 1);
            result = await agent.addFoodToMeal(1, 1, [food]);
        });

        describe('Add Food to Meal', async() => {
            it('should add food to meal', () => {
                expect(result.id).to.be.equal(1);
                expect(result.foods.length).to.be.equal(1);
                expect(result.foods[0].name).to.be.equal(foodRequestObj.name);
            });

            it('no duplicate food should exist on meal', async () => {
                await agent.addFoodToMeal(1, 1, [food]);
                let result = await agent.getMeal(1, 1);
                expect(result.foods.length).to.be.equal(1);
            });
        });

        describe('Remove Food from Meal', async() => {
            it('should remove food from meal', async () => {
                let result = await agent.removeFoodFromMeal(1, 1, food);
                expect(result.foods.length).to.be.equal(0);
            });

            it('should reject removing food that isn\'t in meal', async () => {
                let otherFood = await foodAgent.addFood({type: FoodType.Protein, name: 'Sample', price: 20}, 1);
                expect(agent.removeFoodFromMeal(1, 1, otherFood)).to.be.rejected;
            });
        });
    });

    afterEach(async () => {
        await connection.synchronize(true);
    });

    after(async() => {
        await connection.close();
    });
});
