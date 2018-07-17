// const { makeExecutableSchema } = require("graphql-tools");
const hie = require("./hie");

const insightsAPITypeDefs = `
  type Query { hie: HieRoot }
  ${hie.types}
`;

const insightsAPIResolvers = hie.resolvers;
insightsAPIResolvers.Query = { hie: () => true };

module.exports = {
  typeDefs: insightsAPITypeDefs,
  resolvers: insightsAPIResolvers
}

// Something may be wrong with the schema and resolvers.
// There are `resolverValidationOptions` that can be added, though no combination seemed to help.
// Flagging some on will show some errors though.
// TODO: Figure out what's wrong.
//
// However, cgs-graphql-server will run `makeExecutableSchema()` for us already if
// an object with typeDefs and resolvers is passed (and no `_directives` key which would exist if
// it was made executable).
// Since it does that, just pass the object above. That does work while using npm link or not.
// 
// https://github.com/apollographql/graphql-tools/issues/131 <-- some more info
// module.exports = makeExecutableSchema({
//   typeDefs: insightsAPITypeDefs,
//   resolvers: insightsAPIResolvers
// });