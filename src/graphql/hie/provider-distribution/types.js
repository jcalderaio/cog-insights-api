module.exports = `
extend type HieRoot {
    providerDistribution: [HieProviderDistribution]
}

type HieProviderDistribution {
  ehrCount: Int
  ehrCity: String
  providerCount: String
  providerCity: String
}

`;
