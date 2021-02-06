const path = require('path');
const { PythonShell } = require('python-shell');
const validateCoords = require('./validateCoords.js');

const generateOrderedStops = (stops, callback) => {
  try {
    if (stops.length < 2) {
      const err = new Error('There should be at least 2 stops');
      err.statusCode = 422;
      throw err;
    }

    const allCoordsValid = stops.every((stop) => validateCoords(stop));

    if (!allCoordsValid) {
      const err = new Error('Invalid stops coordinates.');
      err.statusCode = 422;
      throw err;
    }

    const options = {
      scriptPath: path.resolve(__dirname, '../../algo'),
      pythonOptions: ['-u'],
      args: [JSON.stringify({ stops })],
    };

    PythonShell.run('generate_route_mock.py', options, callback);
  } catch (err) {
    callback(err, null);
  }
};

module.exports = generateOrderedStops;
