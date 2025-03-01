const config = require('config');
const log = require('@webinmove/gazeti').create({ module: module.id });

const vooModem = require('../resources/voo');

const models = require('../models');

const run = async () => {
  try {
    await vooModem.login();

    await vooModem.perfomMenuPreRequest();

    const newSignalRow = await vooModem.getDocsysLevels();

    log.info('LOGGED_NEW_SIGNAL_LEVELS', newSignalRow);

    await models.levels.create(newSignalRow);

    const logs = await vooModem.getDocsysLogs();

    try {
      await models.logs.bulkCreate(logs);

      await vooModem.clearDocysLogs();

      log.info('LOGGED_NEW_LOGS', logs);
    } catch (error) {
      log.error('VOO_WORKER_LOGS_ERROR', error);
    }


    await vooModem.resetLogin();

    setTimeout(run, config.voo.modemFetchInterval);
  } catch (error) {
    log.error('VOO_WORKER_ERROR', error);
    setTimeout(run, config.app.errorThrottling);
  };
};

module.exports.run = run;
