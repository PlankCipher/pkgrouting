const { Router } = require('express');
const generateOrderedStops = require('../utils/generateOrderedStops.js');

const router = new Router();

router.post('/generate', (req, res, next) => {
  try {
    const { stops } = req.body;

    generateOrderedStops(stops, (err, orderedStopsJSON) => {
      if (err) {
        next(err);
      } else {
        const { stops: orderedStops } = JSON.parse(orderedStopsJSON);
        res.json({ orderedStops });
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
