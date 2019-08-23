import 'mocha';
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import { Food, FoodType } from '../../../../src/data-layer/entity';
import { Validator } from '../../../../src/business-layer/validators';

const expect = chai.expect;
chai.use(chaiAsPromised);

const validationMessage = 'Validation failed. Please check your inputs and try again';

describe('Validator', async () => {
    describe('validate', async () => {
        it('should throw "ValidationError" on invalid entity', async () => {
            let food = new Food();
            food.name = '';
            expect(Validator.validate(food)).to.be.rejectedWith(validationMessage);
        });

        it('should return true if validation passes', async () => {
            let food = new Food();
            food.name = 'Sample Food',
            food.type = FoodType.Starch,
            food.price = 50
            expect(await Validator.validate(food)).to.be.true;
        });
    });
});
