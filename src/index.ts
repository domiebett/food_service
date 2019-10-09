import "reflect-metadata";
import * as dotenv from 'dotenv';
import { Application } from './middleware/config/Application';

dotenv.config();
export const application = new Application();
