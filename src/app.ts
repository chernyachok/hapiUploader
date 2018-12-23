import * as dotenv from 'dotenv'; 
dotenv.config();
import { getServerConfigs } from './configurations';

const serverConfigs = getServerConfigs();
import startServer from './server';

startServer(serverConfigs);
