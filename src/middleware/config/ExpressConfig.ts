import * as express from 'express';
import * as bodyParser from 'body-parser'
import * as cors from 'cors';
import * as path from 'path';
import * as YAML from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';
import { useExpressServer, useContainer as routeUseContainer, Action } from 'routing-controllers';
import { useContainer as ormUseContainer } from 'typeorm';
import { Container } from 'typedi';

const swaggerDocument = YAML.load(path.resolve('swagger.yaml'));

export class ExpressConfig {
    app: express.Application;

    constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        this.setUpExpressServer();
        this.errorHandler();
    }

    /**
     * Sets up routing-controllers
     */
    setUpExpressServer() {
        routeUseContainer(Container);
        ormUseContainer(Container);

        const controllersPath = path.resolve('build', 'service-layer/controllers');
        const middlewaresPath = path.resolve('build', 'middleware/express-middlewares');
        return useExpressServer(this.app, {
            controllers: [controllersPath + '/*.js'],
            middlewares: [middlewaresPath + '/*.js'],
            cors: true,
            defaultErrorHandler: false,
            authorizationChecker: async (action: Action) => {
                return action.request.headers['user-id'];
            },
            currentUserChecker: async (action: Action) => {
                return action.request.headers['user-id'];   
            }
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
