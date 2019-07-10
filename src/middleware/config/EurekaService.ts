import * as config from 'config';
import { Eureka } from 'eureka-js-client';
import { IpResolver } from '@bit/domiebett.budget_app.ip-resolver';

export class EurekaService {
    private static _client: Eureka;
    private static _port: number = config.get('express.port');
    private static _ipAddress: string = IpResolver.getIPv4Address();

    constructor() { }

    static getClient(): Eureka {
        if (!this._client) {
            this._client = new Eureka({
                instance: {
                    app: config.get('app.name'),
                    instanceId: config.get('app.name'),
                    hostName: this._ipAddress,
                    ipAddr: this._ipAddress,
                    statusPageUrl: `http://${this._ipAddress}:${this._port}`,
                    healthCheckUrl: `http://${this._ipAddress}:${this._port}/health`,
                    port: {
                        '$': this._port,
                        '@enabled': true
                    },
                    vipAddress: config.get('app.name'),
                    dataCenterInfo: {
                        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                        'name': 'MyOwn'
                    },
                },
                eureka: {
                    host: config.get('eureka.address') || 'eureka',
                    port: config.get('eureka.port') || 9091,
                    servicePath: '/eureka/apps/'
                }
            });
        }

        return this._client;
    }
}
