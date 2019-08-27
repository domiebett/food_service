import { Service } from "typedi";

@Service()
export class DatabaseConnectionService {
    /**
     * Get the connection name for typeorm to use depending
     * on the environment. If env is tests, then use the test
     * connection
     * @return {string}
     */
    static getDbEnv() {
        const env = process.env.NODE_ENV;
        return env === 'test' ? env : 'default';
    }
}
