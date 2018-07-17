module.exports = `
extend type HieRoot {
  mrns: Mrns
}

type Mrns {
  byMonth(startDate: String!, endDate: String!, organization: String, city: String):[MrnsByMonth]!
  byOrganization(startDate: String!, endDate: String!, organization: String, city: String):[MrnsByOrganization]!
}

type MrnsByMonth {
  month: String
  count: Int
}

type MrnsByOrganization {
  organization: String
  address: String
  city: String
  gisLng: String
  gisLat: String
  count: Int
}
`;
