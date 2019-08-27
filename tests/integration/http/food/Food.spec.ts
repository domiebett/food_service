import 'mocha';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as request from 'supertest';
import {Application } from 'express';
import { ExpressConfig } from '../../../../src/middleware/config/ExpressConfig';
import { Database } from '../../../bin/setup/Database';
import { Connection } from 'typeorm';
import { Container } from 'typedi';
import { FoodAgent } from '../../../../src/data-layer/data-agent';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Food Routes Integration Tests', () => {
    let connection: Connection;
    let app: Application;
    app = new ExpressConfig().app;
    const req = request(app);

    before(async () => {
        connection = await Database.createTestConnection();
        await connection.synchronize();
    });

    describe('#GET /foods', () => {
        it('should get foods successfully', async () => {
            const response = await req.get('/foods');
            await console.log('body', response.body);
            expect(response.status).to.equal(200);
            expect(response.body).to.haveOwnProperty('foods');
            expect(response.body.foods).to.be.an('array');
            expect(response.body.foods).to.be.empty;
        });
    });

    afterEach(async () => {
        await connection.synchronize(true);
    });

    after(async () => {
        await connection.close();
    });
});
