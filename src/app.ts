import * as  dotenv from 'dotenv'; 
dotenv.config();
import { getServerConfigs } from './configurations';

const serverConfigs = getServerConfigs();
import initServer from './server';

initServer(serverConfigs);
