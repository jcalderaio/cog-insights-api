var logger = require('tracer').console();

const mockQuery = `
(SELECT TO_DATE('2018-02-01', 'YYYY-MM-DD') as month, 'dd' as organization, '123 street' as address,
'Birmingham' as city, 7 as num)
UNION
(SELECT TO_DATE('2018-02-01', 'YYYY-MM-DD') as month, 'Cognosante' as organization, '234 ave' as address,
'Mobile' as city, 8 as num)
UNION
(SELECT TO_DATE('2018-04-01', 'YYYY-MM-DD') as month, 'Cognosante' as organization, '234 ave' as address,
'Mobile' as city, 9 as num)
UNION
(SELECT TO_DATE('2018-04-01', 'YYYY-MM-DD') as month, 'Organization 3' as organization, '234 ave #3' as address,
'Mobile' as city, 10 as num)
UNION
(SELECT TO_DATE('2018-04-01', 'YYYY-MM-DD') as month, 'Organization 4' as organization, '234 ave #4' as address,
'Mobile' as city, 11 as num)
UNION
(SELECT TO_DATE('2018-04-01', 'YYYY-MM-DD') as month, 'Organization 5' as organization, '234 ave #5' as address,
'Mobile' as city, 12 as num)
UNION
(SELECT TO_DATE('2018-04-01', 'YYYY-MM-DD') as month, 'Organization 6' as organization, '234 ave #6' as address,
'Mobile' as city, 13 as num)
UNION
(SELECT TO_DATE('2018-04-01', 'YYYY-MM-DD') as month, 'Organization 7' as organization, '234 ave #7' as address,
'Mobile' as city, 14 as num)
UNION
(SELECT TO_DATE('2018-04-01', 'YYYY-MM-DD') as month, 'Organization 8' as organization, '234 ave #8' as address,
'Mobile' as city, 15 as num)
UNION
(SELECT TO_DATE('2018-05-01', 'YYYY-MM-DD') as month, 'Organization 9' as organization, '234 ave #9' as address,
'Mobile' as city, 16 as num)
UNION
(SELECT TO_DATE('2018-05-01', 'YYYY-MM-DD') as month, 'Organization 10' as organization, '234 ave #10' as address,
'Mobile' as city, 17 as num)
UNION
(SELECT TO_DATE('2018-05-01', 'YYYY-MM-DD') as month, 'Organization 11' as organization, '234 ave #11' as address,
'Mobile' as city, 18 as num)
UNION
(SELECT TO_DATE('2018-05-01', 'YYYY-MM-DD') as month, 'Organization 12' as organization, '234 ave #12' as address,
'Mobile' as city, 19 as num)
`;

class RegisteredDocuments {
  constructor(hsregistry) {
    this._db = hsregistry;
  }

  count(startDate, endDate, organization, city) {
    const whereOrganization = organization ? `organization = '${organization}'` : '1=1';
    const whereCity = city ? `city = '${city}'` : '1=1';

    const query = `
      SELECT TO_CHAR(month, 'YYYY/MM/01') as month, SUM(num) as num FROM (
        ${mockQuery}
      )
      WHERE month >= TO_DATE('${startDate}', 'YYYY/MM/DD')
        AND month <= TO_DATE('${endDate}', 'YYYY/MM/DD')
        AND ${whereOrganization}
        AND ${whereCity}
      GROUP BY TO_CHAR(month, 'YYYY/MM/01')
  `;

    return this._db.execute(query).then(result => {
      return result.map(e => ({ month: e.month, count: e.num }));
    });
  }

  list(startDate, endDate, organization, city) {
    const whereOrganization = organization ? `organization = '${organization}'` : '1=1';
    const whereCity = city ? `city = '${city}'` : '1=1';

    const query = `
    SELECT organization, address, city, SUM(num) as num FROM (
      ${mockQuery}
    )
    WHERE month <= TO_DATE('${endDate}', 'YYYY/MM/DD')
      AND ${whereOrganization}
      AND ${whereCity}
    GROUP BY organization
    ORDER BY organization ASC
    `;
    return this._db
      .execute(query)
      .then(result => {
        logger.log('DOCUMENTS ---->', JSON.stringify(result, null, 2));
        return result.map(e => ({
          organization: e.organization,
          address: e.address,
          city: e.city,
          count: e.num
        }));
      })
      .catch(err => {
        logger.error(`Error: ${JSON.stringify(err)}`);
      });
  }
}

module.exports = hsregistry => new RegisteredDocuments(hsregistry);
