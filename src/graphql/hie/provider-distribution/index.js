const types = require('./types');
const mockData = require('./mock-data');

module.exports = {
  types: types,
  resolvers: {
    HieRoot: {
      providerDistribution: () => mockData
    }
  }
};
