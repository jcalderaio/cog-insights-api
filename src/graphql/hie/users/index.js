const types = require("./types");
const Users = require("../../../domain/hie/users");

module.exports = {
  types: types,
  resolvers: {
    HieRoot: {
      users: () => true
    },
    Users: {
      count: (_, args, ctx) => Users(ctx.wso2db).count(args.startDate, args.endDate, args.organization),
      list: (_, args, ctx) => Users(ctx.wso2db).list(args.month, args.year, args.organization)
    }
  }
};
