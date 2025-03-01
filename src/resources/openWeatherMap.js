const config = require('config');

const baseUrl = 'https://api.openweathermap.org/data/3.0/onecall';

module.exports.getWindSpeed = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `${baseUrl}?lat=${latitude}&lon=${longitude}&appid=${config.openWeatherMap.apiKey}`
    );
    const data = await response.json();

    return {
      windSpeed: data.current?.wind_speed,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
