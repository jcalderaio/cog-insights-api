module.exports = `
extend type HieRoot {
  organizations: [Organization]!
}

type Organization {
  id: ID!
  name: String
}

`;
