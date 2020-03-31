import { createConnection } from 'typeorm';

export class Database {
    constructor() {
        Database.connect();
    }

    /**
     * Creates a connection to the database and closes connection
     * on app exit
     */
    public static async connect() {
        return await createConnection();
    }
}
