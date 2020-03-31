import { Eureka } from 'eureka-js-client';
import { IpResolver } from '@bit/domiebett.budget_app.ip-resolver';
import { logger } from '@bit/domiebett.budget_app.logging';

export class EurekaService {
    private static _client: Eureka;
    private static _port: number;
    private static _ipAddress: string = IpResolver.getIPv4Address();

    constructor() { }

    static getClient(): Eureka {
        this._port = parseInt(process.env.APP_PORT);
        
        if (!this._client) {
            this._client = new Eureka({
                instance: {
                    app: process.env.APP_NAME,
                    instanceId: process.env.APP_NAME,
                    hostName: this._ipAddress,
                    ipAddr: this._ipAddress,
                    statusPageUrl: `http://${this._ipAddress}:${this._port}`,
                    healthCheckUrl: `http://${this._ipAddress}:${this._port}/health`,
                    port: {
                        '$': this._port,
                        '@enabled': true
                    },
                    vipAddress: process.env.APP_NAME,
                    dataCenterInfo: {
                        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                        'name': 'MyOwn'
                    },
                },
                eureka: {
                    host: process.env.EUREKA_ADDRESS,
                    port: parseInt(process.env.EUREKA_PORT),
                    servicePath: '/eureka/apps/',
                    maxRetries: parseInt(process.env.EUREKA_MAX_RETRIES)
                }
            });
        }

        return this._client;
    }

    static async start() {
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
}
