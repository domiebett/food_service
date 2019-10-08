import { logger } from "@bit/domiebett.budget_app.logging/dist/Logging";

export class BaseError extends Error {
    protected status: number;
    protected success: boolean;
    protected error: boolean;
    protected code: string;
    message: string;

    constructor(message, errorObj: Error = null) {
        super();
        this.name = 'SystemError';
        this.status = 500;
        this.success = false;
        this.error = true;
        this.code = 'SYSTEM_ERROR';
        this.message = message;

        if (errorObj) {
            BaseError.logError(errorObj);
        }
    }

    private static logError(errorObj: Error) {
        logger.error(errorObj.stack);
    }
}
