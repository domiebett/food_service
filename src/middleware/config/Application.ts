import * as http2 from 'http2';
import { Connection } from 'typeorm';
import { Eureka } from 'eureka-js-client';
import { EurekaService } from './EurekaService';
import { ExpressConfig } from './ExpressConfig';
import { Database } from '../../data-layer/adapters/Database';
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
        return await Database.connect();
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
        return EurekaService.start();
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
