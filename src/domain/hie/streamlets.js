const moment = require('moment');

module.exports = db => new Streamlets(db);

class Streamlets {
  constructor(hsMdxClient) {
    this._mdxClient = hsMdxClient;
  }

  _toMonthYear(date) {
    return moment(date).format('YYYYMM');
  }

  _buildFilter(args) {
    const filters = [];
    // add date filter - if not specified fallbacks to 24 months
    // moment() ? or 'NOW' ?
    const endDate = args && args.endDate ? moment(args.endDate) : moment();

    // Is this always a sliding 24 months when not defined?? Or simply no start date at all? Does there need to be a start date?
    // ...and should there be any sort of validation to check that it's not 500 months ago?
    // Currently right now, it doesn't matter much because our front-end is always passing dates.
    // But something to think about because it's a front-end UI story's acceptance criteria steering the API.
    // What if the PO says "actually make the trend history just the past year" ? Do we update the API here again?
    // On top of the front-end too? Or simply not set a start date at all and rely upon the front-end.
    // Much like if(args.facility) below. No facility? No condition.
    // This also means the startDate argument is technically not required yet it has ! in the types defintion.
    // Also means unless "" is given, it'll never actually use this -24 month caluclation.
    const startDate = args && args.startDate ? moment(args.startDate) : moment().subtract(24, 'M');
    filters.push(
      `%OR([DATE].[H1].[BYMONTH].&[${this._toMonthYear(startDate)}]:&[${this._toMonthYear(endDate)}])`
    );

    // add type filter
    if (args.type) {
      filters.push(`[STREAMLETTYPE].[H1].[STREAMLETTYPE].&[${args.type}]`);
    }
    // add facility filter
    if (args.facility) {
      filters.push(`[FACILITY].[H1].[FACILITY].&[${args.facility}]`);
    }
    // add edge gateway (ie. ip-10-19-10-219.ec2.internal:HSEDGE1)
    // could also do it by edge "name" which would be just HSEDGE1
    // not sure what should be used/displayed on front-end
    if (args.gateway) {
      filters.push(`[Gateway].[H1].[Gateway].&[${args.gateway}]`);
    }
    // console.log('FILTERS: ' + JSON.stringify(filters, null, 2));
    return filters;
  }
 
  /**
   * Returns historical, month by month, counts for streamlets.
   * Both a count for the current month as well as a running total is returned.
   * Note: This running total is not "all time" - it's since the specified time window.
   * 
   * @param {Object} args GraphQL args
   *        {String} startDate Start date, 2018/01/01 or 2018-01-01 (required)
   *        {String} endDate   End date (required)
   *        {String} type      Optional streamlet type to filter by
   *        {String} facility  Optional facility to filter by
   *        {String} gateway   Optional gateway to filter by
   */
  history(args) {
    return this._mdxClient
      .executeMdx({
        namespace: 'COGNOSANTE',
        mdx: `SELECT
                NON EMPTY {[Measures].[Sum],[MEASURES].[RUNNING TOTAL]} ON 0
                ,NON EMPTY [Date].[H1].[ByMonth].Members ON 1
              FROM [DATAVOLUMESTREAMLETS]`,
        filters: this._buildFilter(args)//,
        // mapper: { Count: 'Sum' } // ?
      })
      .then(data => {
        return data.map(d => {
          const monthYear = moment(d['ByMonth'], 'YYYYMM');
          return {
            date: monthYear,
            year: monthYear.year(),
            month: monthYear.month() + 1, // months start at 0 in JavaScript
            count: d.Sum,
            cumulative: d['Running Total']
          };
        });
      })
      .catch(e => {
        console.log(e);
        // Return error to GraphQL?
        return [];
      });
  }

  /**
   * Returns a query for a listing of streamlets sent by month.
   * This includes additional details not seen in count() and groups
   * by date, streamlet type, facility, and gateway.
   *
   * @param {Object} args      GraphQL args
   *        {String} startDate Start date, 2018/01/01 or 2018-01-01
   *        {String} endDate   End date
   *        {String} type      Optional streamlet type to filter by
   *        {String} facility  Optional facility to filter by
   *        {String} gateway   Optional gateway to filter by
   */
  list(args) {
    // Here's this behemoth of a query
    // SELECT NON EMPTY [Measures].[Sum] ON 0,NON EMPTY HEAD(NONEMPTYCROSSJOIN([Date].[H1].[ByMonth].Members,NONEMPTYCROSSJOIN([Gateway].[H1].[Gateway].Members,NONEMPTYCROSSJOIN([Facility].[H1].[Facility].Members,[StreamletType].[H1].[StreamletType].Members))),2000,SAMPLE) ON 1 FROM [DATAVOLUMESTREAMLETS] %FILTER %OR([DATE].[H1].[BYMONTH].&[201612]:&[NOW])
    return this._mdxClient.executeMdx({
      namespace: 'COGNOSANTE',
      mdx: `SELECT
        NON EMPTY [Measures].[Sum] ON 0
        ,NON EMPTY HEAD(
          NONEMPTYCROSSJOIN(
            [Date].[H1].[ByMonth].Members
            ,NONEMPTYCROSSJOIN(
              [Gateway].[H1].[Gateway].Members
              ,NONEMPTYCROSSJOIN(
                [Facility].[H1].[Facility].Members
                ,[StreamletType].[H1].[StreamletType].Members
              )
            )
          )
          ,2000
          ,SAMPLE
        ) ON 1
        FROM [DATAVOLUMESTREAMLETS]`,
      fiters: this._buildFilter(args),
      mapper: {
        Gateway: 'gateway',
        Facility: 'facility',
        StreamletType: 'type',
        Sum: 'count'
      }
    })
    .then(data => {
      return data.map(d => {
        const monthYear = moment(d['ByMonth'], 'YYYYMM');
        return {
          date: monthYear,
          year: monthYear.year(),
          month: monthYear.month() + 1, // months start at 0 in JavaScript
          count: d.count,
          facility: d.facility,
          gateway: d.gateway,
          type: d.type
        };
      });
    })
    .catch(e => {
      console.log(e);
      // Return error to GraphQL?
      return [];
    });
  }

  /**
   * Returns a query for listing all gateways in the data volume streamlets by type
   * reporting table. These gateways can be used to filter various queries.
   *
   */
  gateways() {
    return this._mdxClient
      .executeMdx({
        namespace: 'COGNOSANTE',
        mdx: `SELECT [Gateway].[H1].[Gateway].AllMembers ON 1 FROM [DataVolumeStreamlets]`
      })
      .then(data => {
        return data.map(d => {
          return {
            gateway: d['Gateway']
          };
        });
      })
      .catch(e => {
        console.log(e);
        // Return error to GraphQL?
        return [];
      });
  }

  /**
   * Returns a query for listing all streamlet types in the data volume streamlets by type
   * reporting table. These types can be used to filter various queries.
   *
   */
  types() {
    return this._mdxClient
      .executeMdx({
        namespace: 'COGNOSANTE',
        mdx: `SELECT [StreamletType].[H1].[StreamletType].AllMembers ON 1 FROM [DataVolumeStreamlets]`
      })
      .then(data => {
        return data.map(d => {
          return {
            type: d['StreamletType']
          };
        });
      })
      .catch(e => {
        console.log(e);
        // Return error to GraphQL?
        return [];
      });
  }
}
