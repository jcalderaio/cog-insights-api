const Knex = require('knex');
const mockDb = require('mock-knex');
const Users = require('./users');

describe('Users', () => {
  const knex = Knex({ client: 'mysql', debug: false });
  const mockknex = mockDb.mock(knex);

  describe('getDateArgs', () => {
    it('should be a function', () => {
      expect(typeof(Users().getDateArgs)).toBe('function');
    });

    it('should return an object with proper `month`, `year`, and `toDate`', () => {
      const dateArgs = Users().getDateArgs(3, 2018);

      expect(dateArgs.year).toBe(2018);
      expect(dateArgs.month).toBe(3);
      expect(dateArgs.toDate).toBe("2018-03-31 23:59:59");
    });

    it('should set default values', () => {
      const dateArgs = Users().getDateArgs();
      const currentYear = new Date().getFullYear();
      
      expect(dateArgs.year).toBe(currentYear);
      expect(dateArgs.month).toBe(12);
    });
  });

  describe('list', () => {
    it('should be a function', () => {
      expect(typeof(Users().list)).toBe('function');
    });

    const knexQuery = Users(mockknex).list(3, 2018);
    it('should return a knex object with query', () => {
      expect(typeof(knexQuery)).toBe('object');
      expect(typeof(knexQuery.toString)).toBe('function');
    });

    it('should return a query with proper where conditions', () => {
      const queryString = knexQuery.toString();
      expect(queryString).toContain("users.created IS NOT NULL");
      expect(queryString).toContain("EXTRACT(MONTH FROM CAST(created AS DATE)) = 3");
      expect(queryString).toContain("EXTRACT(YEAR FROM CAST(created AS DATE)) = 2018");
    });
    
    it('should allow for queries by organization', () => {
      const knexQuery = Users(mockknex).list(3, 2018, "Cognosante");
      const queryString = knexQuery.toString();
      expect(queryString).toContain("Cognosante");
    });

    it('should default list users by all time', () => {
      const knexQuery = Users(mockknex).list();
      const queryString = knexQuery.toString();
      expect(queryString).not.toContain("EXTRACT(MONTH FROM CAST(created AS DATE))");
      expect(queryString).not.toContain("EXTRACT(YEAR FROM CAST(created AS DATE))");
    })
    
  });

  describe('count', () => {
    it('should be a function', () => {
      expect(typeof(Users().count)).toBe('function');
    });

    const knexQuery = Users(mockknex).count(3, 2018);
    it('should return a knex object with query', () =>{
      expect(typeof(knexQuery)).toBe('object');
      expect(typeof(knexQuery.toString)).toBe('function');
    });

    it('should return a query with proper where conditions', () => {
      const queryString = knexQuery.toString();
      expect(queryString).toContain("users.created IS NOT NULL");
      expect(queryString).toContain("t.created <= '2018-03-31 23:59:59'");
    });

    it('should allow for queries by organization', () => {
      const knexQuery = Users(mockknex).count(3, 2018, "Cognosante");
      const queryString = knexQuery.toString();
      expect(queryString).toContain("Cognosante");
    });
    
  });
  
});
