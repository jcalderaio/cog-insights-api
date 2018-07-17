const types = require('./types');
const Streamlets = require('../../../domain/hie/streamlets');

module.exports = {
  types: types,
  resolvers: {
    HieRoot: {
      streamlets: () => true,
    },
    Streamlets: {
      list: (_, args, ctx) => Streamlets(ctx.hsMdxClient).list(args),
      history: (_, args, ctx) => Streamlets(ctx.hsMdxClient).history(args),
      gateways: (_, args, ctx) => Streamlets(ctx.hsMdxClient).gateways(),
      types: (_, args, ctx) => Streamlets(ctx.hsMdxClient).types()
    }
  }
};
