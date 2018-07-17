const merge = require('deepmerge');
const mods = [
  require('./direct-messages'),
  require('./query-and-submissions'),
  require('./provider-distribution'),
  require('./users'),
  require('./organizations'),
  require('./documents'),
  require('./patients-mpi-consent-policies'),
  require('./mrns'),
  require('./cities'),
  require('./mpiids'),
  require('./streamlets'),
  require('./searches'),
  require('./census')
];

const rootSchema = `
  type HieRoot { description: String! }
`;

const rootResolver = {
  HieRoot: { description: () => 'HIE Performance Module' }
};

module.exports = {
  types: [rootSchema].concat(mods.map(x => x.types)).join(' '),
  resolvers: merge.all(mods.map(x => x.resolvers).concat([rootResolver]))
};
