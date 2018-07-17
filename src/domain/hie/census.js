const raw_fips_state = require('./census.state_fips.json');
const raw_population_fips = require('./census.state_population.json');

class Census {
  constructor() {
    this._state_population = this.build_state_population();
  }

  build_state_population() {
    // parse census.state_fips.json
    // [ [ '01', 'AL' ] -> { '01': 'AL' }
    let fips_state = {};

    raw_fips_state.forEach(e => {
      // 0: fips, 1: state
      const fips = e[0];
      const state = e[1];
      fips_state[fips] = state;
    });

    // parse census.state_population.json
    // [ [ population, '01' ] -> { 'AL': population }
    let state_population = {};

    raw_population_fips.forEach(e => {
      // 0: population, 1: fips
      const population = e[0];
      const state = fips_state[e[1]];
      state_population[state] = population;
    });

    return state_population;
  }

  state(state) {
    return {
      population: this._state_population[state.toUpperCase()]
    };
  }
}

module.exports = () => new Census();
