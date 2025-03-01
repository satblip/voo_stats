const sjcl = require('sjcl');
const config = require('config');

const baseUrl = `http://${config.voo.modemIp}/api/v1`;

// Module to hash the password
async function doPbkdf2NotCoded (passwd, saltLocal) {
  return new Promise((resolve, _reject) => {
    const key = sjcl.misc.pbkdf2(passwd, saltLocal, 1000, 128);
    resolve(sjcl.codec.hex.fromBits(key));
  });
};

// SingleTons for the session
let PHPSESSID = '';
let authToken = '';

const getCallHeaders = () => {
  return {
    Cookie: `PHPSESSID=${PHPSESSID}; lang=fr; auth=${authToken}`,
    'X-CSRF-TOKEN': authToken,
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': config.voo.modemUserAgent
  };
};

module.exports.login = async () => {
  try {
    // A first request is made to get the salt to encode the password
    const loginPrefetchBody = new FormData();
    loginPrefetchBody.set('username', 'voo');
    loginPrefetchBody.set('password', 'seeksalthash');

    const loginPrefetchRequest = await fetch(`${baseUrl}/session/login`, {
      headers: {
        'User-Agent': config.voo.modemUserAgent
      },
      method: 'POST',
      body: loginPrefetchBody
    });

    const loginPrefetch = await loginPrefetchRequest.json();

    // We store the PHPSESSID for further uses
    PHPSESSID = loginPrefetchRequest.headers.get('set-cookie').split(';')[0].split('=')[1];

    // We encode the password with the salt
    const distantsaltstored = loginPrefetch.salt;
    const distantsaltstoredWebui = loginPrefetch.saltwebui;
    const hashed1 = await doPbkdf2NotCoded(
      config.voo.modemPassword,
      distantsaltstored
    );
    const newPassword = await doPbkdf2NotCoded(hashed1, distantsaltstoredWebui);

    // We login with the new encoded password
    const body2 = new FormData();
    body2.set('username', 'voo');
    body2.set('password', newPassword);

    const loginRequest = await fetch(`${baseUrl}/session/login`, {
      headers: {
        Cookie: `PHPSESSID=${PHPSESSID}`,
        'User-Agent': config.voo.modemUserAgent
      },
      method: 'POST',
      body: body2
    });

    // We store the auth cookie for further uses
    authToken = loginRequest.headers.get('set-cookie').split(';')[0].split('=')[1];

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports.resetLogin = () => {
  PHPSESSID = '';
  authToken = '';
};

module.exports.perfomMenuPreRequest = async () => {
  // We do a menu request to be able to enable the user to access features
  return fetch(`${baseUrl}/session/menu`, {
    headers: getCallHeaders(),
    method: 'GET',
    Accept: '*/*'
  });
};

module.exports.getDocsysLevels = async () => {
  // We get docsys signal levels
  const docsysRequest = await fetch(`${baseUrl}/modem/exUSTbl,exDSTbl,USTbl,DSTbl,ErrTbl`, {
    headers: getCallHeaders(),
    method: 'GET',
    Accept: '*/*'
  });

  const docsysLevels = (await docsysRequest.json()).data;

  const newSignalLevelsRow = {};

  // We fill info for OFDMA channel
  if (docsysLevels.exUSTbl[0].PowerLevel.replace(' dBmV', '') !== '') {
    newSignalLevelsRow.UP_5 = {
      channel: docsysLevels.exUSTbl[0].ChannelID,
      frequency: docsysLevels.exUSTbl[0].CentralFrequency.replace(' MHz', ''),
      power: docsysLevels.exUSTbl[0].PowerLevel.replace(' dBmV', ''),
      lockStatus: docsysLevels.exUSTbl[0].LockStatus
    };
  }

  // We fill other upstream channels
  docsysLevels.USTbl.forEach((channel, index) => {
    if (channel.PowerLevel.replace(' dBmV', '') === '') {
      return;
    }

    newSignalLevelsRow[`UP_${index + 1}`] = {
      channel: channel.ChannelID,
      frequency: channel.Frequency.replace(' MHz', ''),
      power: channel.PowerLevel.replace(' dBmV', ''),
      lockStatus: channel.LockStatus
    };
  });

  // We fill info for OFDM channel
  if (docsysLevels.exDSTbl[0].PowerLevel.replace(' dBmV', '') !== '') {
    newSignalLevelsRow.DOWN_162 = {
      channel: docsysLevels.exDSTbl[0].ChannelID,
      frequency: docsysLevels.exDSTbl[0].CentralFrequency.replace(' MHz', ''),
      power: docsysLevels.exDSTbl[0].PowerLevel.replace(' dBmV', ''),
      lockStatus: docsysLevels.exDSTbl[0].LockStatus,
      SNRLevel: docsysLevels.exDSTbl[0].SNRLevel.replace(' dB', '')
    };
  }


  // We fill other downstream channels
  docsysLevels.DSTbl.forEach((channel, index) => {
    if (channel.PowerLevel.replace(' dBmV', '') === '') {
      return;
    }

    newSignalLevelsRow[`DOWN_${index + 1}`] = {
      channel: channel.ChannelID,
      frequency: channel.Frequency.replace(' MHz', ''),
      power: channel.PowerLevel.replace(' dBmV', ''),
      lockStatus: channel.LockStatus,
      correcteds: channel.Correcteds,
      uncorrectables: channel.Uncorrectables,
      SNRLevel: channel.SNRLevel.replace(' dB', '')
    };
  });

  newSignalLevelsRow.rawData = docsysLevels;
  newSignalLevelsRow.timestamp = new Date().toISOString();

  return newSignalLevelsRow;
};

module.exports.getDocsysLogs = async () => {
  // We get docsys logs
  const docsysLogsRequest = await fetch(`${baseUrl}/modem/LogTbl`, {
    headers: getCallHeaders(),
    method: 'GET',
    Accept: '*/*'
  });

  const docsysLogs = (await docsysLogsRequest.json()).data;

  const logs = [];

  // We parse the logs
  docsysLogs.LogTbl.forEach((log) => {
    logs.push({
      timestamp: new Date(log.time).toISOString(),
      level: log.level,
      message: log.text
    });
  });

  return logs;
};

module.exports.clearDocysLogs = async () => {
  // We clear the logs to be sure the journal is not full
  const clearLogsBody = new FormData();
  clearLogsBody.set('CleanDocsisLog', 'True');

  return fetch(`${baseUrl}/modem`, {
    headers: getCallHeaders(),
    method: 'POST',
    body: clearLogsBody
  });
};
