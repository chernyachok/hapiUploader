var dotenv = require('dotenv');
dotenv.config();
var getServerConfigs = require('./configurations').getServerConfigs;
var serverConfigs = getServerConfigs();
require('./server')(serverConfigs);
