module.exports = `
extend type HieRoot {
  census: Census
}

type Census {  
  state(state: String!): CensusPopulation!
}

type CensusPopulation {
  population: String
}
`;
