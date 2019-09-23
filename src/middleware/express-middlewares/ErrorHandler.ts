import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { Response } from 'express';
import { ValidationException } from '../../business-layer/exceptions';

@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, req: any, res: Response, next: (err: any) => any) {
        let responseObject = {} as any;
        const developmentMode: boolean = process.env.NODE_ENV === 'development';

        if (!developmentMode) {
            delete error.stack;
        }

        const status = error.status || error.httpCode;
        res.status(status).json(error);

        next(error);
    }
}
