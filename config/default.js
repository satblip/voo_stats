module.exports = {
  voo: {
    modemIp: process.env.VOO_MODEM_IP || '192.168.0.1',
    modemPassword: process.env.VOO_MODEM_PASSWORD,
    modemUserAgent: process.env.VOO_MODEM_USER_AGENT || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:136.0) Gecko/20100101 Firefox/136.0',
    modemFetchInterval: process.env.VOO_MODEM_FECTH_INTERVAL || 60 * 1000
  },
  app: {
    errorThrottling: 60 * 1000
  },
  openWeatherMap: {
    apiKey: process.env.OPEN_WEATHER_MAP_API_KEY,
    fetchInterval: process.env.OPEN_WEATHER_MAP_FETCH_INTERVAL || 120 * 1000,
    locationLat: parseFloat(process.env.OPEN_WEATHER_MAP_LOCATION_LAT),
    locationLon: parseFloat(process.env.OPEN_WEATHER_MAP_LOCATION_LON)
  },
  pg: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    db: process.env.POSTGRES_DB
  },
  worker: {
    on: parseInt(process.env.WORKER_ON) || 1
  }
};
