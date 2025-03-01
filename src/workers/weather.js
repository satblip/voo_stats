const config = require('config');
const log = require('@webinmove/gazeti').create({ module: module.id });

const openWeatherMap = require('../resources/openWeatherMap');

const models = require('../models');

const run = async () => {
  try {
    const wind = await openWeatherMap.getWindSpeed(
      config.openWeatherMap.locationLat,
      config.openWeatherMap.locationLon
    );

    await models.wind.create(wind);

    log.info('LOGGED_NEW_WIND', wind);

    setTimeout(run, config.openWeatherMap.fetchInterval);
  } catch (error) {
    log.error('WIND_WORKER_ERROR', error);
    setTimeout(run, config.app.errorThrottling);
  };
};

module.exports.run = run;
