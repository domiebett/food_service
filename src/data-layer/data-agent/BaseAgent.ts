import { getConnection, Repository } from 'typeorm';
import { DatabaseConnectionService as DbConnectionService } from '../../business-layer/services/DatabaseConnectionService';
import { validate } from 'class-validator';
import {Catch} from "../../business-layer/decorators/CatchError";
import {Food, Meal} from "../entity";

export abstract class BaseAgent {
    protected validate: Function;
    protected repository: Repository<Food | Meal>;

    protected constructor(entity) {
        this.validate = validate;
        this.repository = this.getRepository(entity);
    }

    /**
     * Gets the repository for a particular entity.
     * @param entity - a typeorm entity
     * @return { Repository<any> }
     */
    protected getRepository(entity: any): Repository<any> {
        return getConnection(DbConnectionService.getDbEnv()).getRepository(entity);
    }

    /**
     * Get all items of a repository
     * @param userId
     * @param relations
     * @return {Promise }
     */
    @Catch()
    async getAll(userId, relations: string[] = null): Promise<any[]> {
        return this.repository.find({ where: { userId }, relations });
    }

    /**
     * Get single entity by id
     * @param id
     * @param userId
     * @param relations
     * @return { Promise }
     */
    @Catch()
    async getById(id, userId, relations: string[] = null): Promise<any> {
        return this.repository.findOneOrFail(id, {where: { userId }, relations });
    }

    /**
     * Destory a record of an entity
     * @param id
     * @param userId
     * @return { Promise }
     */
    @Catch()
    async destroy(id, userId): Promise<any> {
        const item = await this.getById(id, userId);
        return this.repository.remove(item);
    }

    /**
     * Get multiple entities by their ids
     * @param ids
     * @param userId
     * @param relations
     * @return { Promise }
     */
    @Catch()
    async getByIds(ids: number[], userId, relations: string[] = null) {
        return this.repository.findByIds(ids, { where: { userId }, relations });
    }
}
