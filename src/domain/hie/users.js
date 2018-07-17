module.exports = wso2db => new Users(wso2db);

class Users {
  constructor(wso2db) {
    this.wso2db = wso2db;
  }

  /**
   * This will list all users by give month, year, organization.
   *
   * @param {Number} month
   * @param {Number} year
   * @param {String} organization
   */
  list(month, year, organization) {
    const dateArgs = this.getDateArgs(month, year);

    let query = this.wso2db.select(
      this.wso2db.raw(`
        *
          FROM (
            SELECT 
              U.UM_TENANT_ID as "tenant_id"
              ,T.UM_DOMAIN_NAME as "tenant_name"
              ,U.UM_ID as "user_id"
              ,U.UM_USER_NAME as "user_name"
              ,MAX(IF(UA.UM_ATTR_NAME = 'organization', UA.UM_ATTR_VALUE, NULL)) as "organization"
              ,MAX(IF(UA.UM_ATTR_NAME = 'addresses', UA.UM_ATTR_VALUE, NULL)) as "address"
              ,MAX(IF(UA.UM_ATTR_NAME = 'country', UA.UM_ATTR_VALUE, NULL)) as "country"
              ,CAST(MAX(IF(UA.UM_ATTR_NAME = 'createdDate', UA.UM_ATTR_VALUE, NULL)) AS DATETIME) AS "created"
                FROM UM_USER U
                LEFT JOIN UM_USER_ATTRIBUTE AS UA ON U.UM_ID = UA.UM_USER_ID
                LEFT JOIN UM_TENANT AS T ON U.UM_TENANT_ID = T.UM_ID
                GROUP BY U.UM_ID
          ) users
      `)
    );

    // Don't return users without a created date.
    query = query.whereRaw("users.created IS NOT NULL");

    // Can't really have a month without a year...I mean I suppose you can. But it'd be the same month for each year?
    // Currently no use case for that.
    if (year) {
      query = query.whereRaw("EXTRACT(YEAR FROM CAST(created AS DATE)) = ?", dateArgs.year);
      query = query.whereRaw("EXTRACT(MONTH FROM CAST(created AS DATE)) = ?", dateArgs.month);
    }

    if (organization) {
      query = query.whereRaw("organization = ?", organization);
    }

    query = query.groupByRaw("user_name");

    return query;
  }

  count(month, year, organization) {
    const dateArgs = this.getDateArgs(month, year);

    // Inner most query
    // Note: "created" is cast to datetime. The attribute in the table is a string.
    // There is no index on any sort of time, so this query will scan the whole table.
    // The only indexes that exist are on a primary key (um_id and um_tenant_id) and
    // the user name (um_user_name and um_tenant_id).
    let query = this.wso2db.select(
      this.wso2db.raw(`
        *
          FROM (
            SELECT 
              U.UM_TENANT_ID as "tenant_id"
              ,T.UM_DOMAIN_NAME as "tenant_name"
              ,U.UM_ID as "user_id"
              ,U.UM_USER_NAME as "user_name"
              ,MAX(IF(UA.UM_ATTR_NAME = 'organization', UA.UM_ATTR_VALUE, NULL)) as "organization"
              ,MAX(IF(UA.UM_ATTR_NAME = 'addresses', UA.UM_ATTR_VALUE, NULL)) as "address"
              ,MAX(IF(UA.UM_ATTR_NAME = 'country', UA.UM_ATTR_VALUE, NULL)) as "country"
              ,CAST(MAX(IF(UA.UM_ATTR_NAME = 'createdDate', UA.UM_ATTR_VALUE, NULL)) AS DATETIME) AS "created"
                FROM UM_USER U
                LEFT JOIN UM_USER_ATTRIBUTE AS UA ON U.UM_ID = UA.UM_USER_ID
                LEFT JOIN UM_TENANT AS T ON U.UM_TENANT_ID = T.UM_ID
                GROUP BY U.UM_ID
          ) users
      `)
    );

    // Don't include any rows with a null created attribute, that won't help us (there actually were some, but may be just our testing).
    query = query.whereRaw("users.created IS NOT NULL");

    // If filtering by organization
    if (organization) {
      query = query.whereRaw("organization = ?", organization);
    }

    // We want to group by user by month and year
    query = query.groupByRaw(
      "user_name, EXTRACT(MONTH FROM CAST(users.created AS DATE)), EXTRACT(YEAR FROM CAST(users.created AS DATE))"
    );

    // Ordering by the created date (again a string cast to datetime) will help with the cumulative counting.
    query = query.orderBy("created");

    // The count and running total
    // Requires a subquery and variable.
    // In this case "created" data is really the last one seen from the group by in the previous query.
    // We're using it to ensure we're counting things chronologically...But maybe that's also handy to know?
    // It can be considered the last time a user was created for that month/year.
    // The t.total is the count for each month/year combo. Simple enough.
    // The @running_total part is the fun one.
    // The JOIN (SELECT @running_total := 0) r is a cross join, and allows for variable declaration without requiring a separate SET command.
    // We're using "r" as the alias for it, though it doesn't matter.
    // The running total simply adds the total from each row (this is why the order by is so important).
    query = this.wso2db.select(
      this.wso2db.raw(
        `
      t.month
      ,t.year
      ,t.created
      ,t.total
      ,@running_total := @running_total + t.total AS cumulative

        FROM (
        SELECT
          COUNT(*) AS total
          ,EXTRACT(MONTH FROM CAST(created AS DATE)) AS "month"
          ,EXTRACT(YEAR FROM CAST(created AS DATE)) AS "year"
          ,created

          FROM (` +
          query.toString() +
          `) aggUsers

          GROUP BY
            EXTRACT(MONTH FROM CAST(created AS DATE))
            ,EXTRACT(YEAR FROM CAST(created AS DATE))

          ORDER BY created
        ) t
        JOIN (SELECT @running_total := 0) r
      `
      )
    );

    // This limits everything at the end. Again, a full table scan is required.
    query = query.whereRaw("t.created <= ?", dateArgs.toDate);

    // Knex does not make complex queries easy, it makes them harder. This is handy way to debug.
    // console.log(query.toString());

    return query;
  }

  /**
   * getDateArgs will return all of the query condition values
   * needed to build the report queries. It defaults to the
   * current month/year.
   *
   * @param  {Number} month
   * @param  {Number} year
   * @return {Object}
   */
  getDateArgs(month, year) {
    if (!year) {
      year = new Date().getFullYear();
    }
    if (!month) {
      // If a month is not provided, then we are looking at year by year data.
      // Use the last month of the year to include it all.
      month = 12;
    }

    let monthStr = `${month}`;
    if (month < 10) {
      monthStr = `0${month}`;
    }

    // Get last day of month (note the month + 1, because month is array index 0 - 11).
    const day = new Date(year, month, 0).getDate();

    // Note: toDate is always the last day of the month (last second of the day). We don't allow daily reporting.
    return {
      year: year,
      month: month,
      toDate: `${year}-${monthStr}-${day} 23:59:59`
    };
  }
}
