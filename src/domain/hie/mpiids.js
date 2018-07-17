class Mpiids {
  constructor(hsregistry) {
    this._db = hsregistry;
  }

  byMonth(startDate, endDate) {
    return this._db
      .execute(
        `
        SELECT TO_CHAR(CreatedOn, 'YYYY/MM/01') AS month, COUNT(*) AS month_count
        FROM
        (
          SELECT MPIID, MIN(CreatedOn) as CreatedOn
          FROM HS_Registry.Patient
          GROUP BY MPIID
        )
        WHERE CreatedOn >= TO_DATE('${startDate}', 'YYYY/MM/DD')
        AND CreatedOn <= TO_DATE('${endDate}', 'YYYY/MM/DD')  
        GROUP BY TO_CHAR(CreatedOn, 'YYYY/MM/01')
       `
      )
      .then(result => {
        console.log('Mpiids.byMonth ---->', JSON.stringify(result));
        return result.map(e => ({
          month: e.month,
          count: e.month_count
        }));
      });
  }
}

module.exports = hsregistry => new Mpiids(hsregistry);
