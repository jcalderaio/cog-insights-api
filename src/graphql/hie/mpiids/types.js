module.exports = `
extend type HieRoot {
  mpiids: Mpiids
}

type Mpiids {
  byMonth(startDate: String!, endDate: String!):[MpiidsByMonth]
}

type MpiidsByMonth {
  month: String
  count: Int
}
`;
