const config = require('config');
const log = require('@webinmove/gazeti').create({ module: module.id });

const vooWorker = require('./workers/voo');
const weatherWorker = require('./workers/weather');

const sequelize = require('./resources/postgresql');

// Catch all uncaught exception, log it and then die properly
process.on('uncaughtException', (err) => {
  log.fatal('UNCAUGHT_EXCEPTION', err);
  process.exit(1);
});

const start = async () => {
  await sequelize.sync();

  if (config.worker.on) {
    vooWorker.run();
    weatherWorker.run();
  }

  log.info('WORKERS_STARTED_SUCCESS');
};

start();
