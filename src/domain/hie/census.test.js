const Census = require('./census');

describe('Census', () => {
  describe('state()', () => {
    it('should return the population of a state', () => {
      expect(Census().state('WY')).toEqual({ population: '579315' });
    });
  });
});
