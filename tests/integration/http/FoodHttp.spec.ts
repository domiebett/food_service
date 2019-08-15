import chai = require('chai');
import chaiHttp = require('chai-http');
import * as sinon from 'sinon';
import { ExpressConfig } from '../../../src/middleware/config/ExpressConfig';
import { FoodAgent } from '../../../src/data-layer/data-agent';
import { FoodType } from '../../../src/data-layer/entity';

const app = new ExpressConfig().app;
chai.use(chaiHttp);

describe('Http Food', () => {
    const foodResponse = { id: 1, name: 'Sample Food', type: 'Starch', price: 20};

    before(async () => {

    });

    describe('Get Food', async () => {
        it('should add food', async () => {

        });
    });

    after(async () => {

    });
});
