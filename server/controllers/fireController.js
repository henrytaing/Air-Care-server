const fetch = require('node-fetch');
const { Fires } = require('../models/fireModel');

const { BREEZOMETER_API } = process.env;

async function getFires({ latitude, longitude }) {
  try {
    let fires;
    const [result] = await Fires.find({ latitude, longitude });

    if (result !== undefined) {
      fires = result.fires;
    } else {
      const response = await fetch(
        `https://api.breezometer.com/fires/v1/current-conditions?lat=${latitude}&lon=${longitude}&key=${BREEZOMETER_API}&radius=30mi`
      );
      const data = await response.json();
      fires = data.data.fires
        .filter(({ confidence }) => confidence === 'High')
        .map(({ lat, lon }) => ({ latitude: lat, longitude: lon }));
      Fires.create({ latitude, longitude, fires }).catch((err) =>
        console.error(`ERROR writing Fires to DB: ${err}`)
      );
    }

    return fires;
  } catch (err) {
    console.error(`ERROR getting fire data: ${err}`);
    return [];
  }
}

module.exports = {
  getFires,
};