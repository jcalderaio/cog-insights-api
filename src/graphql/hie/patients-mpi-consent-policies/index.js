const types = require("./types");
const PatientsMpiConsentPolicies = require("../../../domain/hie/patients-mpi-consent-policies");

module.exports = {
  types: types,
  resolvers: {
    HieRoot: {
      patientsMpiConsentPolicies: () => true
    },
    PatientsMpiConsentPolicies: {
      countMonthly: (_, args, ctx) =>
        PatientsMpiConsentPolicies(ctx.hsregistrydb).monthlyCount(
          args.startDate,
          args.endDate
        )
    }
  }
};
