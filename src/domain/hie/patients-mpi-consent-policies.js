const _ = require("lodash");
const { startOfMonth, endOfMonth, isBefore, isAfter, format } = require("date-fns");

const dateUtils = require("../../utils/dateUtils");

var logger = require("tracer").console();

class PatientsMpiConsentPolicies {
  constructor(hsregistry) {
    this._db = hsregistry;
  }

  policies(startDate, endDate) {
    return this._db
      .execute(
        `
        SELECT ID, 
          MPI, 
          TO_CHAR(EffectiveDate, 'YYYY/MM/DD') AS EffectiveDate, 
          TO_CHAR(ExpirationDate, 'YYYY/MM/DD') AS ExpirationDate, 
          CASE WHEN LENGTH(InActive) > 0 THEN 1 ELSE 0 END AS InActive
        FROM HS_Consent_Policy.Patient
        WHERE EffectiveDate <= TO_DATE('${endDate}', 'YYYY/MM/DD')
      `
      )
      .then(result => {
        logger.log("PATIENTS MPI CONSENT POLICIES---->", JSON.stringify(result, null, 2));
        return result;
      })
      .catch(err => {
        logger.error(`Error: ${JSON.stringify(err)}`);
      });
  }

  isPolicyActive(startDate, endDate, effectiveDate, expirationDate, inactive) {
    return (
      inactive === 0 &&
      (effectiveDate === "" || !isBefore(endDate, effectiveDate)) &&
      (expirationDate === "" || !isAfter(startDate, expirationDate))
    );
  }

  isPolicyInactive(startDate, endDate, effectiveDate, expirationDate, inactive) {
    return (
      (effectiveDate === "" || !isAfter(effectiveDate, endDate)) &&
      (inactive !== 0 ||
        (effectiveDate !== "" && isAfter(effectiveDate, startDate)) ||
        (expirationDate !== "" && isBefore(expirationDate, endDate)))
    );
  }

  isPolicyAny(startDate, endDate, effectiveDate, expirationDate, inactive) {
    return effectiveDate === "" || !isAfter(effectiveDate, endDate);
  }

  // startDate = '2017/02/01'
  // endDate = '2017/02/28'
  // policyList = [
  //  { ID: '15', MPI: 100000003, EffectiveDate: '2017/02/15', ExpirationDate: '2017/03/01', Inactive: '' },
  //  { ID: '16', MPI: 100000003, EffectiveDate: '2017/03/15', ExpirationDate: '2017/06/01', Inactive: '' },
  //  ...
  // ]
  //
  // returns
  //   { hasActive: true, hasInactive: true }

  reducePolicyList(startDate, endDate, policyList) {
    const policyListStatuses = policyList.map(policy => {
      return {
        active: this.isPolicyActive(startDate, endDate, policy.EffectiveDate, policy.ExpirationDate, policy.InActive),
        inactive: this.isPolicyInactive(
          startDate,
          endDate,
          policy.EffectiveDate,
          policy.ExpirationDate,
          policy.InActive
        ),
        any: this.isPolicyAny(startDate, endDate, policy.EffectiveDate, policy.ExpirationDate, policy.InActive)
      };
    });

    return {
      hasActive: policyListStatuses.reduce((m, e) => {
        return m || e.active;
      }, false),
      hasInactive: policyListStatuses.reduce((m, e) => {
        return m || e.inactive;
      }, false),
      hasAny: policyListStatuses.reduce((m, e) => {
        return m || e.any;
      }, false)
    };
  }

  reducePatientPolicyLists(startDate, endDate, patientPolicyLists) {
    const patientPolicySummary = _.keys(patientPolicyLists).map(mpi => {
      return this.reducePolicyList(startDate, endDate, patientPolicyLists[mpi]);
    });

    const result = {
      startDate: startDate,
      endDate: endDate,
      active: patientPolicySummary.reduce((m, e) => {
        return m + (e.hasActive ? 1 : 0);
      }, 0),
      inactive: patientPolicySummary.reduce((m, e) => {
        return m + (e.hasInactive ? 1 : 0);
      }, 0),
      any: patientPolicySummary.reduce((m, e) => {
        return m + (e.hasAny ? 1 : 0);
      }, 0)
    };
    return result;
  }

  transform(startDate, endDate, policies) {
    // group policies by MPI
    const patientPolicyLists = _.groupBy(policies, "MPI");

    return dateUtils
      .monthsBetween(startDate, endDate)
      .map(e => {
        return this.reducePatientPolicyLists(startOfMonth(e), endOfMonth(e), patientPolicyLists);
      })
      .map(e => {
        return {
          month: format(e.startDate, "YYYY/MM/DD"),
          active: e.active,
          inactive: e.inactive,
          any: e.any
        };
      });
  }

  monthlyCount(startDate, endDate) {
    return this.policies(startDate, endDate).then(policies => {
      return this.transform(startDate, endDate, policies);
    });
  }
}

module.exports = hsregistry => new PatientsMpiConsentPolicies(hsregistry);
