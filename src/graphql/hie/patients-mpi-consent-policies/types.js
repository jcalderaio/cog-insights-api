module.exports = `
extend type HieRoot {
  patientsMpiConsentPolicies: PatientsMpiConsentPolicies
}

type PatientsMpiConsentPolicies {
  countMonthly(startDate: String!, endDate: String!): [PatientsMpiConsentPolicyCount]
}

type PatientsMpiConsentPolicyCount {
  month: String
  active: Int
  inactive: Int
  any: Int
}
`;
