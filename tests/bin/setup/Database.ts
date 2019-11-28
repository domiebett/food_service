import { createConnection, Connection } from "typeorm";
import { Food, Meal } from "../../../src/data-layer/entity";
import * as path from 'path';

export class Database {
    constructor() {

    }

    /**
     * Create a database connection to the test
     * db for the purpose of testing.
     * @return { Promise<Connection> }
     */
    static async createTestConnection(): Promise<Connection> {
        return await createConnection({
            name: 'test',
            type: 'mysql',
            host: 'food_service_db',
            port: 3306,
            username: 'test',
            password: 'test',
            database: 'test',
            entities: [
                Food, Meal,
                path.resolve('src', 'data-layer/entity/**/*.ts'),
                path.resolve('build', 'data-layer/entity/**/*.js')
            ],
            synchronize: true
        });
    }
}
