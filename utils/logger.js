const pino = require('pino');
const levels = {
    emerg: 80,
    alert: 70,
    crit: 60,
    error: 50,
    warn: 40,
    notice: 30,
    info: 20,
    debug: 10,
  };
module.exports = pino({level: 'info',
customLevels: levels,
useOnlyCustomLevels: true,});

