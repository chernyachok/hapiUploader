const dotenv = require('dotenv');
dotenv.config();
const { getServerConfigs } = require('./configurations');

const serverConfigs = getServerConfigs();

require('./server')(serverConfigs);

