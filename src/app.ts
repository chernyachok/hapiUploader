import * as path from 'path';
import * as dotenv from 'dotenv'; 
import * as fs from 'fs';
import { container } from './diContainer';

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

container.cradle.startServer;