const { Router } = require('express');
const requireLoggedIn = require('../middlewares/requireLoggedIn.js');
const requireProperAuthorization = require('../middlewares/requireProperAuthorization.js');
const User = require('../db/User.js');

const router = new Router();

router.get(
  '/:userId',
  requireLoggedIn,
  requireProperAuthorization,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { err, user } = await User.findById(userId);

      if (err) {
        throw err;
      } else {
        const { id, name } = user;
        const finalUser = { id, name };

        res.json(finalUser);
      }
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
