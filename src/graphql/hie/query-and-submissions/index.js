const types = require("./types");
const QueriesAndSubmissions = require("../../../domain/hie/queries-submissions");

module.exports = {
  types: types,
  resolvers: {
    HieRoot: {
      queryAndSubmissions: (_, args, ctx) => QueriesAndSubmissions(ctx.db).getStats(args.year)
    }
  }
};
