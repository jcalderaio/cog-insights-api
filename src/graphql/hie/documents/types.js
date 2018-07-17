module.exports = `
extend type HieRoot {
  documents: Documents
}

type Documents {  
  count(startDate: String, endDate: String, organization: String, city: String): [DocumentsCount]
  list(startDate: String, endDate: String, organization: String, city: String): [DocumentsList]
}

type DocumentsCount {
  month: String  
  count: Int
}

type DocumentsList {
  organization: String
  address: String
  city: String
  count: Int
}
`;
