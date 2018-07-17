const Knex = require('knex');
const mockDb = require('mock-knex');
const Documents = require('./documents');
//const cache = require("@cognosante/healthshare-cache");

describe('Registered Documents', () => {
  const knex = Knex({ client: 'mysql', debug: false });
  //const mockknex = mockDb.mock(knex);

  console.log(knex, mockDb);

  describe('count()', () => {
    it('should be a function', () => {
      expect(typeof Documents().count).toBe('function');
    });
  });

  // describe('getDateArgs', () => {
  //   it('should be a function', () => {
  //     expect(typeof RegisteredDocuments().getDateArgs).toBe('function');
  //   });

  //   it('should return an object with proper `startDate`, and `endDate`', () => {
  //     const dateArgs = RegisteredDocuments().getDateArgs(1, 2014, 3, 2018);

  //     expect(dateArgs.startDate).toBe('2014-01-31 23:59:59');
  //     expect(dateArgs.endDate).toBe('2018-03-31 23:59:59');
  //   });

  //   it('should set default values', () => {
  //     const dateArgs = RegisteredDocuments().getDateArgs();
  //     const startYear = new Date().getFullYear() - 5;
  //     const endYear = new Date().getFullYear();

  //     expect(dateArgs.startDate).toBe(`${startYear}-12-31 23:59:59`);
  //     expect(dateArgs.endDate).toBe(`${endYear}-12-31 23:59:59`);
  //   });
  // });

  // describe('getDocumentCount', () => {
  //   it('should be a function', () => {
  //     expect(typeof RegisteredDocuments().getDocumentCount).toBe('function');
  //   });

  //   const knexQuery = RegisteredDocuments(mockknex).getDocumentCount(
  //     1,
  //     2014,
  //     3,
  //     2018
  //   );

  //   it('should return an object with query', () => {
  //     expect(typeof knexQuery).toBe('object');
  //     expect(typeof knexQuery.toString).toBe('function');
  //   });

  //   it('should return a query with proper where conditions', () => {
  //     const queryString = knexQuery.toString();
  //     expect(queryString).toContain(
  //       "BETWEEN '2014-01-31 23:59:59' AND '2018-03-31 23:59:59'"
  //     );
  //   });
  // });
});
