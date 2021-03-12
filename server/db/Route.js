const execQuery = require('./execQuery.js');

// TODO: When refactoring, change every [result]
// TODO: to <thing>Result. e.x. findRouteResult
class Route {
  static async save(userId, stops, generatedRoute, time, distance) {
    try {
      // eslint-disable-next-line
      const insertRouteSQL =
        'INSERT INTO routes (user_id, stops, generated_route, time, distance) VALUES(?, ?, ?, ?, ?)';

      await execQuery(insertRouteSQL, [
        userId,
        stops,
        generatedRoute,
        time,
        distance,
      ]);

      return { err: null };
    } catch (err) {
      return { err };
    }
  }

  static async delete(routeId, userId) {
    try {
      const { err, route } = await this.findById(routeId);

      if (err) {
        throw err;
      }

      if (route.user_id !== userId) {
        const newErr = new Error(
          `User with id ${userId} is not authorized to delete route with id ${routeId}`,
        );
        newErr.statusCode = 401;
        throw newErr;
      }

      const deleteRouteSQL = 'DELETE FROM routes WHERE id = ?';
      await execQuery(deleteRouteSQL, [routeId]);

      return { err: null };
    } catch (err) {
      return { err };
    }
  }

  static async findByUserId(id) {
    try {
      const findRouteSQL = 'SELECT * FROM routes WHERE user_id = ?';
      const [result] = await execQuery(findRouteSQL, [id]);

      if (result.length < 1) {
        const err = new Error(`No routes found for the user with the id ${id}`);
        err.statusCode = 404;
        throw err;
      }

      return { err: null, routes: result };
    } catch (err) {
      return { err, routes: null };
    }
  }

  static async findById(id) {
    try {
      const findRouteSQL = 'SELECT * FROM routes WHERE id = ?';
      const [result] = await execQuery(findRouteSQL, [id]);

      if (result.length < 1) {
        const err = new Error(`Route width id ${id} not found`);
        err.statusCode = 404;
        throw err;
      }

      return { err: null, route: result[0] };
    } catch (err) {
      return { err, route: null };
    }
  }
}

module.exports = Route;
