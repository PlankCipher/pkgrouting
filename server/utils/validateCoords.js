const validateCoords = (coords) => {
  const { lat, lng } = coords;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

module.exports = validateCoords;
