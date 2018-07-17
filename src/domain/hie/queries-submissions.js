module.exports = db => new HieQueriesAndSubmissions(db);

class HieQueriesAndSubmissions {
  constructor(db) {
    this._db = db;
  }

  getStats(year) {
    let query;
    if (year) {
      query = this._db("queries_and_submissions")
        .select("year", "month")
        .sum("queries AS queries")
        .sum("queries_no_result AS queriesNoResult")
        .sum("submissions AS submissions")
        .where({ year })
        .orderBy("year")
        .orderBy("month")
        .groupBy("year", "month");
    } else {
      const end = new Date().getFullYear();
      const start = end - 5;
      query = this._db("queries_and_submissions")
        .select("year")
        .sum("queries AS queries")
        .sum("queries_no_result AS queriesNoResult")
        .sum("submissions AS submissions")
        .whereBetween("year", [start, end])
        .orderBy("year")
        .groupBy("year");
    }
    return query;
  }
}
