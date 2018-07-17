const types = require("./types");
const Documents = require("../../../domain/hie/documents"); // implement

module.exports = {
  types: types,
  resolvers: {
    HieRoot: {
      documents: () => true
    },
    Documents: {
      count: (_, args, ctx) =>
        Documents(ctx.hsregistrydb).count(args.startDate, args.endDate, args.organization, args.city),
      list: (_, args, ctx) =>
        Documents(ctx.hsregistrydb).list(args.startDate, args.endDate, args.organization, args.city)
    }
  }
};
