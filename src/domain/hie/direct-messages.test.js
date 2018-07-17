// jest --watch -t DirectMessages --collectCoverageFrom=src/domain/hie/direct-messages.js
const Knex = require('knex');
const mockDb = require('mock-knex');
const factory = require('./direct-messages');

describe('DirectMessages', () => {
  describe('getStats()', () => {
    const knex = Knex({ client: 'pg', debug: false });
    const mockknex = mockDb.mock(knex);

    const startDate = '01/01/2016 00:00:00';
    const endDate = '01/01/2017 00:00:00';
    const organization = 'Cognosante';

    test('should be able to query from a start date', () => {
      const query = factory(mockknex).getStats(startDate);
      const queryString = query.toString();
      expect(queryString).toMatch(`CAST(o.date_month AS DATE) >= '${startDate}'`);
    });

    test('should be able to query from an end date', () => {
      const query = factory(mockknex).getStats(null, endDate);
      const queryString = query.toString();
      expect(queryString).toMatch(`CAST(o.date_month AS DATE) <= '${endDate}'`);
    });

    test('should be able to query by specific organization', () => {
      const query = factory(mockknex).getStats(null, null, organization);
      const queryString = query.toString();
      expect(queryString).toMatch(organization);
    });

    test('should not query by organization if `all` is passed', () => {
      const query = factory(mockknex).getStats(null, null, 'all');
      const queryString = query.toString();
      expect(queryString).not.toMatch('o.entity =');
    });
  });

  describe('getByOrganization()', () => {
    const knex = Knex({ client: 'pg', debug: false });
    const mockknex = mockDb.mock(knex);

    const startDate = '01/01/2016 00:00:00';
    const endDate = '01/01/2017 00:00:00';
    const organization = 'Cognosante';

    test('should be able to query from a start date', () => {
      const query = factory(mockknex).getByOrganization(startDate);
      const queryString = query.toString();
      expect(queryString).toMatch(`CAST(o.date_month AS DATE) >= '${startDate}'`);
    });

    test('should be able to query from an end date', () => {
      const query = factory(mockknex).getByOrganization(null, endDate);
      const queryString = query.toString();
      expect(queryString).toMatch(`CAST(o.date_month AS DATE) <= '${endDate}'`);
    });

    test('should be able to query by specific organization', () => {
      const query = factory(mockknex).getByOrganization(null, null, organization);
      const queryString = query.toString();
      expect(queryString).toMatch(organization);
    });

    test('should not query by organization if `all` is passed', () => {
      const query = factory(mockknex).getByOrganization(null, null, 'all');
      const queryString = query.toString();
      expect(queryString).not.toMatch('o.entity =');
    });
  });

  describe('getByUser()', () => {
    const knex = Knex({ client: 'pg', debug: false });
    const mockknex = mockDb.mock(knex);

    const startDate = '01/01/2016 00:00:00';
    const endDate = '01/01/2017 00:00:00';
    const organization = 'Cognosante';

    test('should be able to query from a start date', () => {
      const query = factory(mockknex).getByUser(startDate);
      const queryString = query.toString();
      expect(queryString).toMatch(`CAST(m.date AS DATE) >= '${startDate}'`);
    });

    test('should be able to query from an end date', () => {
      const query = factory(mockknex).getByUser(null, endDate);
      const queryString = query.toString();
      expect(queryString).toMatch(`CAST(m.date AS DATE) <= '${endDate}'`);
    });

    test('should be able to query by specific organization', () => {
      const organization = 'Cognosante';
      const query = factory(mockknex).getByUser(null, null, organization);
      const queryString = query.toString();
      expect(queryString).toMatch(organization);
    });
  });
});
