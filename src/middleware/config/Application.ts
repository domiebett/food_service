import { ExpressConfig } from './ExpressConfig';
import * as config from 'config';
import { createConnection, Connection } from 'typeorm';
import { Connector } from '../../data-layer/adapters/Connector';

export class Application {
    private express: ExpressConfig;
    private connection: Connection;

    constructor() {
        this.express = new ExpressConfig();

        this.setUpApplication();
    }

    async setUpApplication() {
        await this.createDatabaseConnection();
        
        await this.serveExpressApp();
    }

    private async createDatabaseConnection() {
        this.connection = await Connector.connect();
    }

    private async serveExpressApp() {
        const port = await config.get('express.port');

        await this.express.app.listen(port, () => {
            console.log(`App started on port ${port}`);
        });
    }
}
