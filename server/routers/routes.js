const { Router } = require('express');
const generateOrderedStops = require('../utils/generateOrderedStops.js');
const requireLoggedIn = require('../middlewares/requireLoggedIn.js');
const Route = require('../db/Route.js');

const router = new Router();

router.post('/generate', requireLoggedIn, (req, res, next) => {
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

router.post('/save', requireLoggedIn, async (req, res, next) => {
  try {
    const { id: userId } = req.session.user;

    // eslint-disable-next-line
    const { stops, generatedRoute, time, distance } = req.body;

    const { err } = await Route.save(
      userId,
      stops,
      generatedRoute,
      time,
      distance,
    );

    if (err) {
      throw err;
    } else {
      res.status(201).end();
    }
  } catch (err) {
    next(err);
  }
});

router.delete('/delete', requireLoggedIn, async (req, res, next) => {
  try {
    const { id: userId } = req.session.user;
    const { routeId } = req.body;

    const { err } = await Route.delete(routeId, userId);

    if (err) {
      throw err;
    } else {
      res.status(204).end();
    }
  } catch (err) {
    next(err);
  }
});

router.get('/all', requireLoggedIn, async (req, res, next) => {
  try {
    const { id: userId } = req.session.user;

    const { err, routes } = await Route.findByUserId(userId);

    if (err) {
      throw err;
    } else {
      res.json(routes);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/:routeId', async (req, res, next) => {
  try {
    const { routeId } = req.params;

    const { err, route } = await Route.findById(routeId);

    if (err) {
      next(err);
    } else {
      res.json(route);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
