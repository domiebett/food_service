import { createConnection, getConnection } from "typeorm";
import { Food, Meal } from "../../src/data-layer/entity";

export class Database {
    constructor() {

    }

    static async createTestConnection() {
        return await createConnection({
            name: 'test',
            type: 'mysql',
            host: 'food_service_db',
            port: 3306,
            username: 'test',
            password: 'test',
            database: 'test',
            entities: [Food, Meal],
            synchronize: true
        });
    }
}
