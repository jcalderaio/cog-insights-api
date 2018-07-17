module.exports = `
 extend type HieRoot {
    queryAndSubmissions(year: Int): [HieQueryAndSubmissions]
}

type HieQueryAndSubmissions {
  month: Int
  year: Int
  queries: Int
  queriesNoResult: Int
  submissions:Int
}

`;
