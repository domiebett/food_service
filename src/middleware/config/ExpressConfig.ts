import * as express from 'express';
import * as bodyParser from 'body-parser'
import * as cors from 'cors';
import * as path from 'path';
import { useExpressServer } from 'routing-controllers';

export class ExpressConfig {
    app: express.Application;

    constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.setUpControllers();
    }

    /**
     * Sets up routing-controllers
     */
    setUpControllers() {
        const controllersPath = path.resolve('build', 'service-layer/controllers')
        useExpressServer(this.app, {
            controllers: [controllersPath + '/*.js'],
            cors: true
        });
    }
}
