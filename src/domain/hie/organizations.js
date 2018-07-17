module.exports = db => new Organizations(db);

class Organizations {
  constructor(db) {
    this._db = db;
  }

  list() {
    let query = this._db.select(
      this._db.raw(`
        DISTINCT UM_ATTR_VALUE as 'name'
        FROM UM_USER_ATTRIBUTE
        WHERE UM_ATTR_NAME = 'organization'
          AND UM_ATTR_VALUE IS NOT NULL
          AND UM_ATTR_VALUE <> ''
        ORDER BY name ASC
      `)
    );
    return query;
  }
}
