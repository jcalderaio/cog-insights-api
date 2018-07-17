module.exports = `
extend type HieRoot {
  streamlets: Streamlets
}

type Streamlets {  
  history(startDate: String!, endDate: String!, type: String, facility: String, gateway: String): [StreamletCount]
  list(startDate: String!, endDate: String!, type: String, facility: String, gateway: String): [StreamletList]
  gateways: [StreamletGateways]
  types: [StreamletTypes]
}

type StreamletCount {
  month: Int
  year: Int
  date: String
  count: Int
  cumulative: Int
}

type StreamletList {
  month: Int
  year: Int
  date: String
  facility: String
  gateway: String
  type: String
  count: Int
}

type StreamletGateways {
  gateway: String
}

type StreamletTypes {
  type: String
}
`;
