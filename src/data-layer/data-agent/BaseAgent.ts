import { getConnection, Repository } from 'typeorm';
import { DatabaseConnectionService as DbConnectionService } from '../../business-layer/services/DatabaseConnectionService';
import { Validator } from '../../business-layer/validators';
import { Food, Meal } from '../entity';

export class BaseAgent {
    protected validate: Function;

    constructor() {
        this.validate = Validator.validate;
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
