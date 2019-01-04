import { Server as HapiServer } from 'hapi';
import { IBoomMethods } from './common';

export interface Server extends HapiServer {
    boom(): IBoomMethods;
}

