const { Router } = require('express');
const bcrypt = require('bcrypt');
const requireLoggedIn = require('../middlewares/requireLoggedIn.js');
const requireNotLoggedIn = require('../middlewares/requireNotLoggedIn.js');
const User = require('../db/User.js');

const router = new Router();

router.get('/current', requireLoggedIn, (req, res) => {
  res.json(req.session.user);
});

router.post('/login', requireNotLoggedIn, async (req, res, next) => {
  try {
    const { name: nameFromReqBody, password } = req.body;

    const { err, user } = await User.findByName(nameFromReqBody);

    if (err && err.statusCode === 404) {
      const newErr = new Error('Incorrect credentials.');
      newErr.statusCode = 401;
      throw newErr;
    } else if (err) {
      throw err;
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const { id, name } = user;
        const finalUser = { id, name };

        req.session.user = finalUser;

        res.status(204).end();
      } else {
        const newErr = new Error('Incorrect credentials.');
        newErr.statusCode = 401;
        throw newErr;
      }
    }
  } catch (err) {
    next(err);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const { name: nameFromReqBody, password } = req.body;

    const { err, user } = await User.findOrCreate(nameFromReqBody, password);

    if (err) {
      throw err;
    } else {
      const { id, name } = user;
      const finalUser = { id, name };

      res.status(201).json(finalUser);
    }
  } catch (err) {
    next(err);
  }
});

router.post('/logout', requireLoggedIn, (req, res) => {
  req.session.destroy(() => {
    res.status(200).end();
  });
});

module.exports = router;
