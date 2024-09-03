const fs = require('fs');
const logStream = fs.createWriteStream('cron.log', { flags: 'a' });

module.exports = { logStream };
