import { createConnection } from 'typeorm';

export class Connector {
    constructor() {
        Connector.connect();
    }

    /**
     * Creates a connection to the database and closes connection
     * on app exit
     */
    public static async connect() {
        return await createConnection();
    }
}
