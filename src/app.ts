import * as dotenv from 'dotenv'; 
dotenv.config();
import { getServerConfigs } from './configurations';

const serverConfigs = getServerConfigs();
import start from './server';

start(serverConfigs);
