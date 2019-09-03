import * as fs from 'fs';
import * as path from 'path';
import * as http2 from 'http2';
import * as config from 'config';
import { Connection } from 'typeorm';
import { Eureka } from 'eureka-js-client';
import { EurekaService } from './EurekaService';
import { ExpressConfig } from './ExpressConfig';
import { Connector } from '../../data-layer/adapters/Connector';
import { logger } from '@bit/domiebett.budget_app.logging';

export class Application {
    private express: ExpressConfig;
    private connection: Connection;
    private server: http2.Http2Server;
    private client: Eureka;
    private port: number;

    constructor() {
        this.port = parseInt(process.env.APP_PORT);
        this.express = new ExpressConfig();

        this.setUpApplication();
    }

    /**
     * Sets up application
     */
    async setUpApplication() {
        this.connection = await this.createDatabaseConnection();
        // this.server = await this.serveExpressApp();
        this.server = await this.serveHttpExpressApp();
        this.client = await this.setUpEureka();

        await process.on('SIGINT', await this.closeConnections);
    }

    /**
     * Create a connection to the database
     */
    private async createDatabaseConnection() {
        await logger.info('Creating database connection...');
        return await Connector.connect();
    }

    /**
     * Serve express app
     */
    private async serveHttpExpressApp() {
        return await this.express.app.listen(this.port, (error: any) => {
            if (error) {
                logger.error('Failed to start server with ssl', error);
                return process.exit(1);
            } else {
                logger.info(`Server started on port ${this.port}`);
            }
        });
    }

    /**
     * Registers to Eureka
     */
    private async setUpEureka() {
        const client: Eureka = EurekaService.getClient();
        await logger.info('Connecting to eureka...');

        await client.start((error: Error) => {
            if (error && !error.message) {
                if (!error.message) error.message = 'Error connecting to eureka server!!';
                logger.error('Eureka Connection Error: ', error.message);
                throw error;
            }
        });

        return await client;
    }

    /**
     * Get the ssl key and certificate
     */
    private async fetchSslConfigFiles() {
        const certsPath = path.resolve('certs');
        return await {
            key: fs.readFileSync(certsPath + '/server.key'),
            cert: fs.readFileSync(certsPath + '/server.crt')
        };
    }

    /**
     * Closes all opened connections
     */
    private async closeConnections() {
        await this.server.close();
        await this.connection.close();
        return await this.client.stop();
    }
}
