module.exports = `
extend type HieRoot {
  searches: Searches
}

type Searches {
  byMonth(startDate: String!, endDate: String!): [SearchesByMonth!]
  history(filter: PatientSearchFilter): [SearchesByMonth]!
  list(filter: PatientSearchFilter): [ItemizedSearches]!
}

type SearchesByMonth {
  year: Int
  month: Int
  count: Int
}

type ItemizedSearches {
  orgId: String
  username: String
  count: Int
}

input PatientSearchFilter {
  startDate: String!
  endDate: String!
  orgId: String
  username: String
}

`;
