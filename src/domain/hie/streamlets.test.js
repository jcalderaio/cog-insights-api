// jest --watch -t Streamlets --collectCoverageFrom=src/domain/hie/streamlets.js
const Knex = require('knex');
const mockDb = require('mock-knex');
const Streamlets = require('./streamlets');

describe('Streamlets', () => {
  const knex = Knex({ client: 'mysql', debug: false });
  const mockknex = mockDb.mock(knex);

  describe('_buildFitler()', () => {
    it('should be a function', () => {
      expect(typeof(Streamlets()._buildFilter)).toBe('function');
    });

    it('should return an array with filtering an MDX query by gateway', () => {
      const filters = Streamlets()._buildFilter({gateway: "edge1"})
      const expected = ['[Gateway].[H1].[Gateway].&[edge1]'];
      expect(filters).toEqual(expect.arrayContaining(expected));
    });

    it('should return an array with filtering an MDX query by facility', () => {
      const filters = Streamlets()._buildFilter({facility: "boston memorial"})
      const expected = ['[FACILITY].[H1].[FACILITY].&[boston memorial]'];
      expect(filters).toEqual(expect.arrayContaining(expected));
    });

    it('should return an array with filtering an MDX query by type', () => {
      const filters = Streamlets()._buildFilter({type: "Allergy"})
      const expected = ['[STREAMLETTYPE].[H1].[STREAMLETTYPE].&[Allergy]'];
      expect(filters).toEqual(expect.arrayContaining(expected));
    });

  });

  describe('list()', () => {
    it('should be a function', () => {
      expect(typeof(Streamlets().list)).toBe('function');
    });

    // const knexQuery = Streamlets(mockknex).list('2018-06-01', '2018-05-01');
    // it('should return a knex object with query', () => {
    //   expect(typeof(knexQuery)).toBe('object');
    //   expect(typeof(knexQuery.toString)).toBe('function');
    // });

    // it('should return a query with proper where conditions', () => {
    //   const queryString = knexQuery.toString();
    //   expect(queryString).toContain("`run_date` between");
    //   expect(queryString).toContain("2018-06-01");
    //   expect(queryString).toContain("2018-05-01");
    // });
    
    // it('should allow for queries by facility (organization)', () => {
    //   const knexQuery = Streamlets(mockknex).list('2018-06-01', '2018-05-01', null, 'Cognosante');
    //   const queryString = knexQuery.toString();
    //   expect(queryString).toContain("Cognosante");
    // });

    // it('should allow for queries by streamlet type', () => {
    //   const knexQuery = Streamlets(mockknex).list('2018-06-01', '2018-05-01', 'MEDICATION');
    //   const queryString = knexQuery.toString();
    //   expect(queryString).toContain("MEDICATION");
    // });

    // it('should allow for queries by streamlet gateway', () => {
    //   const knexQuery = Streamlets(mockknex).list('2018-06-01', '2018-05-01', null, null, 'ip-10-19-10-219.ec2.internal:HSEDGE1');
    //   const queryString = knexQuery.toString();
    //   expect(queryString).toContain("ip-10-19-10-219.ec2.internal:HSEDGE1");
    // });
  });

  describe('history()', () => {
    it('should be a function', () => {
      expect(typeof(Streamlets().history)).toBe('function');
    });

    // TODO: Mock MDX?
  });

  describe('gateways()', () => {
    it('should be a function', () => {
      expect(typeof(Streamlets().gateways)).toBe('function');
    });

    // it('should return a query to list distinct gateway values', () => {
    //   const knexQuery = Streamlets(mockknex).gateways();
    //   const queryString = knexQuery.toString();
    //   expect(queryString).toContain("distinct");
    //   expect(queryString).toContain("gateway");
    // });
  });

  describe('types()', () => {
    it('should be a function', () => {
      expect(typeof(Streamlets().types)).toBe('function');
    });

    // it('should return a query to list distinct gateway values', () => {
    //   const knexQuery = Streamlets(mockknex).types();
    //   const queryString = knexQuery.toString();
    //   expect(queryString).toContain("distinct");
    //   expect(queryString).toContain("streamlet_type");
    // });
  });
  
});
