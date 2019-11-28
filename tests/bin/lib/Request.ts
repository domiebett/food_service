import * as supertest from 'supertest';
import { Application } from 'express';
import { bearerToken } from "../data/AuthData";
import { ExpressConfig} from "../../../src/middleware/config/ExpressConfig";

const authHeader = 'authorization';

export const request = (app: Application = null) => {
    app = app || new ExpressConfig().app;
    const req = supertest(app);

    return {
        get: async (path: string) => {
            return req
                .get(path)
                .set(authHeader, bearerToken);
        },
        post: async (path: string, requestObj) => {
            return req
                .post(path)
                .send(requestObj)
                .set(authHeader, bearerToken);
        },
        put: async (path: string, requestObj) => {
            return req
                .put(path)
                .send(requestObj)
                .set(authHeader, bearerToken);
        },
        delete: async (path: string) => {
            return req
                .delete(path)
                .set(authHeader, bearerToken);
        }
    }
};
