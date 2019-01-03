import { Server as HapiServer } from 'hapi';
import { IBoomMethods } from './response';

export interface Server extends HapiServer {
    boom(): IBoomMethods;
}

