import { createConnection } from 'typeorm';

export class Connector {
    constructor() {
        Connector.connect();
    }

    public static async connect() {
        const connection = await createConnection();

        process.on('SIGINT', async () => {
            await connection.close();
            await process.exit(0);
        });

        return connection;
    }
}
