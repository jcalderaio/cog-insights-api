const moment = require('moment');
const { isNumber } = require('lodash');

class Searches {
  constructor(hsMdxClient) {
    this._mdxClient = hsMdxClient;
  }

  _toMonthYear(date) {
    return moment(date).format('YYYYMM');
  }

  _buildFilter(filter) {
    // start with event type filter. this is always the same
    const filters = [
      `%OR({
        [EVENT TYPE].[H1].[EVENT TYPE].&[PatientSearch],
        [EVENT TYPE].[H1].[EVENT TYPE].&[SearchPatient],
        [EVENT TYPE].[H1].[EVENT TYPE].&[SearchPatientBreakGlass]
      })`
    ];
    // add date filter - if not specified fallbacks to 24 months
    const endDate = filter && filter.endDate ? moment(filter.endDate) : moment();
    const startDate = filter && filter.startDate ? moment(filter.startDate) : moment(endDate).subtract(24, 'M');
    filters.push(
      `%OR([EVENTTIMED].[H1].[MONTH YEAR].&[${this._toMonthYear(startDate)}]:&[${this._toMonthYear(endDate)}])`
    );
    // add facility filter
    if (filter.orgId) {
      filters.push(`[USER].[H2].[FACILITY].&[${filter.orgId}]`);
    }
    // add user filter
    if (filter.username) {
      filters.push(`[USER].[H1].[USER NAME].&[${filter.username}]`);
    }
    return filters;
  }

  history(filter) {
    return this._mdxClient
      .executeMdx({
        namespace: 'HSREGISTRY',
        mdx: `SELECT
                [Measures].[%COUNT] ON 0,
                NON EMPTY [EventTimeD].[H1].[Month Year].Members ON 1
              FROM [AUDIT EVENTS]`,
        filters: this._buildFilter(filter),
        mapper: { Count: 'count' }
      })
      .then(data => {
        return data.map(d => {
          const monthYear = moment(d['Month Year'], 'YYYYMM');
          return {
            year: monthYear.year(),
            month: monthYear.month() + 1, // months start at 0 in momentjs
            count: isNumber(d.count) ? d.count : 0
          };
        });
      });
  }

  list(filter) {
    const mdx = filter.orgId
      ? `SELECT
          [Measures].[%COUNT] ON 0,
          NON EMPTY ORDER(
            HEAD(NONEMPTYCROSSJOIN(
                ORDER([User].[H2].[Facility].Members,Measures.[%COUNT],BDESC),
                ORDER([User].[H1].[User Name].Members,Measures.[%COUNT],BDESC)
            ),2000,SAMPLE) ,Measures.[%COUNT],BDESC) ON 1
        FROM [AUDIT EVENTS]
      `
      : `SELECT
          [Measures].[%COUNT] ON 0,
          NON EMPTY ORDER([User].[H2].[Facility].Members,Measures.[%COUNT],BDESC) ON 1
        FROM [AUDIT EVENTS]`;
    console.log('Using query: \n ' + mdx);
    return this._mdxClient
      .executeMdx({
        namespace: 'HSREGISTRY',
        mdx: mdx,
        filters: this._buildFilter(filter),
        mapper: {
          Facility: 'orgId',
          'User name': 'username',
          Count: 'count'
        }
      })
      .then(data => {
        return data.map(d => {
          console.log(d);
          return {
            orgId: d.orgId,
            username: d.username,
            count: isNumber(d.count) ? d.count : 0
          };
        });
      });
  }
}

module.exports = hsMdxClient => new Searches(hsMdxClient);
