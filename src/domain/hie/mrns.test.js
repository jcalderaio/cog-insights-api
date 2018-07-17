const Mrns = require('./mrns');
const mock = require('./mrns.mock');

const organizations = mock.organizations.map(e =>
  Object.assign(e, { organization_uc: e.id.toUpperCase(), city_uc: e.address && e.address.city.toUpperCase() })
);

describe('Mrns', () => {
  test('buildFilter() w/o filters', () => {
    const organization = null;
    const city = null;

    const expected = '1=1';

    const result = Mrns(null, null).buildFilter(organizations, organization, city);
    expect(result).toEqual(expected);
  });

  test('buildFilter() w/ organization', () => {
    const organization = 'Cypress';
    const city = null;

    const expected = "1=1 AND UPPER(Facility) = 'CYPRESS'";

    const result = Mrns(null, null).buildFilter(organizations, organization, city);
    expect(result).toEqual(expected);
  });

  test('buildFilter() w/ city', () => {
    const organization = null;
    const city = 'Huntsville';

    const expected = "1=1 AND UPPER(Facility) IN ('BOSTON MEMORIAL')";

    const result = Mrns(null, null).buildFilter(organizations, organization, city);
    expect(result).toEqual(expected);
  });
});
