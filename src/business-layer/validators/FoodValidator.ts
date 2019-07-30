import { IFood, FoodType } from "../../data-layer/entity";

export class FoodValidator {
    static errorResponse = {fields: {}, error: 'ValidationError'};

    /**
     * Base function for food validation
     * @param foodItem - request body for food
     */
    static async validate(foodItem: IFood) {
        FoodValidator.errorResponse.fields = {};
        await FoodValidator.validateFoodType(foodItem.type);

        if (Object.keys(FoodValidator.errorResponse.fields).length > 0) {
            throw FoodValidator.errorResponse;
        }
    }

    /**
     * Validates that the type of meal is accepted
     * @param foodType - String in the form of food type.
     */
    static async validateFoodType(foodType: string) {
        const foodTypes = Object.values(FoodType);
        if (! (await foodTypes.includes(foodType))) {
            const foodTypes = Object.values(FoodType);
            const stringifiedFoodTypes = foodTypes.join(', ');
            const message = `Invalid Food Types. Only ${stringifiedFoodTypes} allowed`;
            return FoodValidator.errorResponse.fields['type'] = {
                message: message
            }
        }
    }
}
