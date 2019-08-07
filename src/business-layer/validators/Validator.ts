import { ValidationException } from '../exceptions';
import { validate } from 'class-validator';

export class Validator {

    /**
     * Base function to handle all validation
     * @param entity - instance of an entity with properties set
     */
    static async validate(entity) {
        const errors = await validate(entity);
        let fields = {};

        for (let error of errors) {
            fields[error.property] = error.constraints;
        }

        if (Object.keys(fields).length > 0) {
            throw new ValidationException(fields);
        }
    }
}
