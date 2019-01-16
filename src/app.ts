import * as path from 'path';
import * as dotenv from 'dotenv'; 
import * as fs from 'fs';

if (fs.existsSync(path.join(process.cwd(), '.env'))) {
    const result = dotenv.config();
  
    if (result.error) {
      console.log("Env error: ", result.error);
      process.exit(1);
    }
} else {
    console.log('.env not found');
    process.exit(1);
}

import { getServerConfigs } from './configurations';

const serverConfigs = getServerConfigs();
import start from './server/startServer';

start(serverConfigs);
