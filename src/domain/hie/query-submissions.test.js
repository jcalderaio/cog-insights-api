const Knex = require("knex");
const mockDb = require("mock-knex");
const sqlFormatter = require("sql-formatter");
const factory = require("./queries-submissions");

describe("Queries and Submissions test", () => {
  let knex, tracker, mockknex;

  beforeEach(() => {
    knex = Knex({ client: "pg", debug: false });
    mockknex = mockDb.mock(knex);
    tracker = mockDb.getTracker();
    tracker.install();
  });

  afterEach(() => {
    tracker.uninstall();
  });

  test("NO arguments should bring last 5 years", () => {
    const expectedSql =
      'select "year", sum("queries") as "queries", sum("queries_no_result") as "queriesNoResult", sum("submissions") as "submissions" from "queries_and_submissions" where "year" between $1 and $2 group by "year" order by "year" asc';
    tracker.on("query", query => {
      expect(query.method).toBe("select");
      expect(sqlFormatter.format(query.sql)).toBe(sqlFormatter.format(expectedSql));
      expect(query.bindings).toHaveLength(2);
      const upper = new Date().getFullYear();
      expect(query.bindings[0]).toEqual(upper - 5);
      expect(query.bindings[1]).toEqual(upper);
      query.response([]);
    });
    return factory(mockknex).getStats();
  });

  test("YEAR argument should bring current year by month only", () => {
    const expectedSql =
      'select "year", "month", sum("queries") as "queries", sum("queries_no_result") as "queriesNoResult", sum("submissions") as"submissions" from "queries_and_submissions" where "year" = $1 group by "year", "month" order by "year" asc, "month" asc';
    const year = 2010;
    tracker.on("query", query => {
      expect(query.method).toBe("select");
      expect(sqlFormatter.format(query.sql)).toBe(sqlFormatter.format(expectedSql));
      expect(query.bindings).toHaveLength(1);
      expect(query.bindings[0]).toEqual(year);
      query.response([]);
    });
    return factory(mockknex).getStats(year);
  });
});
