export class DatabaseConnectionService {
    static getDbEnv() {
        const env = process.env.NODE_ENV;
        return env === 'test' ? env : 'default';
    }
}
