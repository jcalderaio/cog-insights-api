const PatientsMpiConsentPolicies = require("./patients-mpi-consent-policies.js");
const mock = require("./patients-mpi-consent-policies.mock");

describe("PatientsMpiConsentPolicies", () => {
  beforeEach(() => {});
  afterEach(() => {});

  test("active/inactive rules", () => {
    const o = PatientsMpiConsentPolicies(null);

    expect(o.isPolicyActive("2017/02/01", "2017/02/28", "2017/02/15", "2017/03/01", "")).toEqual(false);
    expect(o.isPolicyInactive("2017/02/01", "2017/02/28", "2017/02/15", "2017/03/01", "")).toEqual(true);
  });

  test("active/inactive by month", () => {
    const expected = [
      { active: 0, any: 0, inactive: 0, month: "2017/01/01" },
      { active: 0, any: 2, inactive: 2, month: "2017/02/01" },
      { active: 0, any: 2, inactive: 2, month: "2017/03/01" },
      { active: 0, any: 2, inactive: 2, month: "2017/04/01" },
      { active: 0, any: 2, inactive: 2, month: "2017/05/01" },
      { active: 0, any: 2, inactive: 2, month: "2017/06/01" }
    ];

    const startDate = "2017/01/01";
    const endDate = "2017/06/01";
    const o = PatientsMpiConsentPolicies(null);
    const result = o.transform(startDate, endDate, mock.policies);

    expect(result).toEqual(expected);
  });
});
