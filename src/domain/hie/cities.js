module.exports = db => new Cities(db);

const mock = require("./cities.mock");

class Cities {
  constructor(db) {
    this._db = db;
  }

  list() {
    return mock.cities.map(e => ({ name: e }));
  }
}
