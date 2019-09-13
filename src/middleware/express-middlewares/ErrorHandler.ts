import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { Response } from 'express';
import { ValidationException } from '../../business-layer/exceptions';

@Middleware({type: 'after'})
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: Response, next: (err: any) => any) {
        let responseObject = {} as any;
        const developmentMode: boolean = process.env.NODE_ENV === 'development';

        if (error instanceof HttpError && error.httpCode) {
            responseObject.status = error.httpCode;
            responseObject.message = this.httpErrorMessage(error.httpCode).message;
            responseObject.name = this.httpErrorMessage(error.httpCode).name;
        } else {
            responseObject.name = error.name || 'Internal Server Error',
            responseObject.message = error.message || 'An error occured on our systems. We are working to fix this.';
            responseObject.status = this.errorStatus(error);

            if (error instanceof ValidationException) {
                responseObject.constraints = error.constraints;
            }
        }
        responseObject.error = true;

        if (developmentMode && error.stack) {
            responseObject.stack = error.stack;
        }

        response.status(responseObject.status).json(responseObject);
        next(error);
    }

    /**
     * Generates a custom message for http errors
     * @param httpErrorCode - http error status code
     */
    private httpErrorMessage(httpErrorCode) {
        switch (httpErrorCode) {
            case 404 || '404':
                return {
                    name: 'NotFoundError',
                    message: 'The resource you are looking for was not found.'
                }
                break;
            case 500 || '500':
                return {
                    name: 'InternalServerError',
                    message: 'An error occured while processing your request. We apologise for any inconveniences.'
                }
                break;
            case 401 || '401':
                return {
                    name: 'AuthorizationError',
                    message: 'You are not authorized to perform this operation'
                }
            default:
                return {
                    name: 'InternalServerError',
                    message: 'An error occured while processing your request. We are working to fix this.'
                };
                break;
        }
    }

    /**
     * Generates a status for certain error types
     * @param error - error object
     */
    private errorStatus(error) {
        switch (error.name) {
            case "EntityNotFound":
                return 404;
                break;
            case "QueryFailedError":
                return 401;
                break;
            default:
                return error.status || 500;
                break;
        }
    }
}
