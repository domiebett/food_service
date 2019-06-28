import * as http from 'http2';
import * as config from 'config';
import * as spdy from 'spdy';
import * as path from 'path';
import * as fs from 'fs';
import { ExpressConfig } from './ExpressConfig';
import { Eureka } from 'eureka-js-client';
import { Connection } from 'typeorm';
import { Connector } from '../../data-layer/adapters/Connector';
import { logger } from '../common/Logging';
import { fstat } from 'fs';

export class Application {
    private express: ExpressConfig;
    private connection: Connection;
    private server: http.Http2Server;
    private client: Eureka;
    private port: number;

    constructor() {
        this.port = config.get('express.port') || 0;
        this.express = new ExpressConfig();

        this.setUpApplication();
    }

    /**
     * Sets up application
     */
    async setUpApplication() {
        this.connection = await this.createDatabaseConnection();
        this.server = await this.serveExpressApp();
        this.client = await this.setUpEureka();

        process.on('SIGINT', await this.closeConnections);
    }

    /**
     * Create a connection to the database
     */
    private async createDatabaseConnection() {
        logger.info('Creating database connection...');
        return await Connector.connect();
    }

    /**
     * Start up express server
     */
    private async serveExpressApp() {
        const options = await this.fetchSslConfigFiles();

        return await spdy.createServer(options, this.express.app).listen(this.port, (error: any) => {
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
        const client: Eureka = new Eureka({
            instance: {
                app: config.get('app.name'),
                hostName: this.server.address().address,
                ipAddr: this.server.address().address,
                statusPageUrl: `http://${this.server.address().address}:${this.port}`,
                healthCheckUrl: `http://${this.server.address().address}:${this.port}/health`,
                port: {
                    '$': this.port,
                    '@enabled': true
                },
                vipAddress: 'myvip',
                dataCenterInfo: {
                    '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                    'name': 'MyOwn'
                },
            },
            eureka: {
                host: config.get('eureka.address') || 'eureka_server',
                port: config.get('eureka.port') || 9091,
                servicePath: '/eureka/apps/'
            }
        });
        await logger.info('Connecting to eureka...');

        await client.start((error: Error) => {
            if (error && !error.message) {
                if (!error.message) error.message = 'Error connecting to eureka server!!';
                logger.info(error.message);
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
