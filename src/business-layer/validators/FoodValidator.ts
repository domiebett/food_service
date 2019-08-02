import { IFood, FoodType } from "../../data-layer/entity";
import { ValidationException } from '../exceptions';
import { validate } from 'class-validator';

export class FoodValidator {

    /**
     * Base function for food validation
     * @param foodItem - request body for food
     */
    static async validate(food: IFood) {
        const errors = await validate(food);
        let fields = {};

        for (let error of errors) {
            fields[error.property] = error.constraints;
        }

        if (Object.keys(fields).length > 0) {
            throw new ValidationException(fields);
        }
    }
}
