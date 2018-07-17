const types = require('./types');
const DirectMessages = require('../../../domain/hie/direct-messages');

module.exports = {
  types: types,
  resolvers: {
    HieRoot: {
      directMessages: (_, args, ctx) => {
        return DirectMessages(ctx.db).getStats(args.startDate, args.endDate);
      },
      directMessagesByOrganization: (_, args, ctx) => {
        return DirectMessages(ctx.db).getByOrganization(args.startDate, args.endDate, args.organization);
      },
      directMessagesAggregate: (_, args, ctx) => {
        return DirectMessages(ctx.db).getStats(args.startDate, args.endDate, args.organization);
      },
      directMessagesByUser: (_, args, ctx) => {
        return DirectMessages(ctx.db).getByUser(args.startDate, args.endDate, args.organization);
      }
    }
  }
};
