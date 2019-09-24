import { getConnection, Repository } from 'typeorm';
import { DatabaseConnectionService as DbConnectionService } from '../../business-layer/services/DatabaseConnectionService';
import { validate } from 'class-validator';

export class BaseAgent {
    protected validate: Function;

    constructor() {
        this.validate = validate;
    }

    /**
     * Gets the repository for a particular entity.
     * @param entity - a typeorm entity
     * @return { Promise<Repository> }
     */
    protected getRepository(entity: any): Repository<any> {
        return getConnection(DbConnectionService.getDbEnv()).getRepository(entity);
    }
}
