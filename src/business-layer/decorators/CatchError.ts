import { DuplicateEntryError, ResourceNotFoundError, BaseError } from "../exceptions";
import { ValidationError } from '../exceptions';

const ERROR_CODES = {
    DUPLICATE: 'ER_DUP_ENTRY'
};

const isDuplicateError = (error) => (error.code && error.code === ERROR_CODES.DUPLICATE) || (error.message && error.message.indexOf('Duplicate entry') >= 0);
const isEntityNotFound = (error) => (error.name && error.name === 'EntityNotFound');
const isValidationError = (error) => (error instanceof Array && error.length > 0 && error[0].hasOwnProperty('constraints'));

/**
 * Decorator function to catch errors in functions. Helps prevent repetition of try catch.
 * @return {Function}
 */
export const Catch = () => {
    return (target, key, descriptor) => {
        const origMethod: Function = descriptor.value;

        descriptor.value = async function (...args) {
            try {
                return await origMethod.apply(this, args);
            } catch (error) {
                handleError(error);
            }
        };

        return descriptor;
    }
};

/**
 * Handles errors caught and throws custom errors that can be rendered appropriately.
 * @param error - error thrown
 * @throws { DuplicateEntryError | ResourceNotFoundError | ValidationError | BaseError }
 */
function handleError(error) {
    if (isDuplicateError(error)) throw new DuplicateEntryError(error.message);
    else if (isEntityNotFound(error)) throw new ResourceNotFoundError(error.message);
    else if (isValidationError(error)) throw new ValidationError(error);
    else throw new BaseError('It seems something is not quite right with our systems. We apologise for any inconvenience.', error);
}
