import * as express from 'express';
import * as bodyParser from 'body-parser'
import * as cors from 'cors';
import * as path from 'path';
import { useExpressServer, useContainer as routeUseContainer } from 'routing-controllers';
import { useContainer as ormUseContainer } from 'typeorm';
import { Container } from 'typedi';

export class ExpressConfig {
    app: express.Application;

    constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.setUpExpressServer();
        this.errorHandler();
    }

    /**
     * Sets up routing-controllers
     */
    setUpExpressServer() {
        routeUseContainer(Container);
        ormUseContainer(Container);

        const controllersPath = path.resolve('build', 'src/service-layer/controllers');
        const middlewaresPath = path.resolve('build', 'src/middleware/express-middlewares');
        return useExpressServer(this.app, {
            controllers: [controllersPath + '/*.js'],
            middlewares: [middlewaresPath + '/*.js'],
            cors: true,
            defaultErrorHandler: false,
        });
    }

    /**
     * Handles generic express http errors e.g 404
     * Check src/middleware/express-middlewares/ErrorHandler.ts for
     * for more robust error handling.
     */
    errorHandler() {
        return this.app.use((req, res, next) => {
            if (!res.headersSent) {
                return res.status(404).send({
                    message: `${req.method} for route: "${req.url}" not found.`,
                    status: 404,
                    name: 'URLNotFound',
                    error: true
                });
            }

            next();
        });
    }
}
