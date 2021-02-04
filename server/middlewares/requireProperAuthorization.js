module.exports = (req, res, next) => {
  let { userId } = req.params;
  userId = Number(userId);
  if (userId !== req.session.user.id) {
    const err = new Error('Unauthorized.');
    err.statusCode = 401;
    next(err);
  }
  next();
};
