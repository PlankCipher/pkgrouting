const validateCoords = (coords) => {
  const { lat, long } = coords;
  return lat >= -90 && lat <= 90 && long >= -180 && long <= 180;
};

module.exports = validateCoords;
