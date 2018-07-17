module.exports = db => new DirectMessage(db);

class DirectMessage {
  constructor(db) {
    this._db = db;
  }

  getStats(startDate, endDate, organization) {
    if (organization === undefined || organization === null) {
      organization = 'all';
    }
    return this.getByOrganization(startDate, endDate, organization);
  }

  /**
   * Returns messages delivered by organization.
   *
   * @param {String} startDate
   * @param {String} endDate
   * @param {String} organization
   */
  getByOrganization(startDate, endDate, organization) {
    let query = this._db.select(
      this._db.raw(`
        EXTRACT(MONTH FROM CAST(o.date_month AS DATE)) AS "month"
        ,EXTRACT(YEAR FROM CAST(o.date_month AS DATE)) AS "year"
        ,CAST(o.date_month AS DATE) AS "date"
        ,o.entity AS "organization"
        ,o.message_count AS "messagesDelivered"
        ,CASE
            WHEN mO.message_type = 'number_of_messages_originated_by_account'
            THEN mO.message_count
            ELSE 0 
            END AS "messagesOriginated"
        ,CASE
            WHEN mR.message_type = 'number_of_messages_received_by_account'
            THEN mR.message_count
            ELSE 0 
            END AS "messagesReceived"
          FROM "public"."direct_message_count" o
            LEFT JOIN "public"."direct_message_count" AS mO
            ON mO.entity = o.entity AND mO.date_month = o.date_month 
            AND mO.message_type = 'number_of_messages_originated_by_account'
            LEFT JOIN "public"."direct_message_count" AS mR
            ON mR.entity = o.entity AND mR.date_month = o.date_month 
            AND mR.message_type = 'number_of_messages_received_by_account'
      `)
    );
    query = query.whereRaw(`o.entity_type = 'account'`);
    query = query.whereRaw(`o.message_type = 'total_number_of_messages_by_account__delivered'`);

    if (startDate) {
      query = query.whereRaw('CAST(o.date_month AS DATE) >= ?', startDate);
    }
    if (endDate) {
      query = query.whereRaw('CAST(o.date_month AS DATE) <= ?', endDate);
    }
    if (organization && organization !== 'all') {
      query = query.whereRaw('o.entity = ?', organization);
    }
    query = query.orderBy('date', 'DESC');

    // This entire query is the same even if doing a complete aggregate
    // Wrap the entire thing if organization is 'all'
    if (organization === 'all') {
      query = this._db.select(
        this._db.raw(
          `
        orgs.date
        ,EXTRACT(MONTH FROM CAST(orgs.date AS DATE)) AS "month"
        ,EXTRACT(YEAR FROM CAST(orgs.date AS DATE)) AS "year"
        ,SUM(orgs."messagesDelivered") AS "messagesDelivered"
        ,SUM(orgs."messagesOriginated") AS "messagesOriginated"
        ,SUM(orgs."messagesReceived") AS "messagesReceived"
          FROM
          (
          ` +
            query.toString() +
            `
          ) orgs
        `
        )
      );
      query = query.groupBy('orgs.date');
    }

    return query;
  }

  /**
   * Returns messages sent by user along with their organization.
   *
   * @param {String} startDate
   * @param {String} endDate
   * @param {String} organization
   */
  getByUser(startDate, endDate, organization) {
    let query = this._db.select(
      this._db.raw(`
        EXTRACT(MONTH FROM CAST(u.date_month AS DATE)) AS "month"
        ,EXTRACT(YEAR FROM CAST(u.date_month AS DATE)) AS "year"
        ,CAST(u.date_month AS DATE) AS "date"
        ,u.message_count AS "messagesSent"
        ,u.entity AS "user"
        ,SUBSTRING(u.entity FROM '\@(.*$)') AS "organization"
          FROM "public"."direct_message_count" u
      `)
    );
    query.whereRaw(`u.entity_type = 'user'`);
    query.whereRaw(`u.message_type = 'number_of_messages_originated_by_user'`);

    // query.toString()

    query = this._db.select(
      this._db.raw(
        `
      *
        FROM
        (
        ` +
          query.toString() +
          `
        ) m
      `
      )
    );
    if (startDate) {
      query = query.whereRaw('CAST(m.date AS DATE) >= ?', startDate);
    }
    if (endDate) {
      query = query.whereRaw('CAST(m.date AS DATE) <= ?', endDate);
    }
    if (organization) {
      query = query.whereRaw('m.organization = ?', organization);
    }
    query = query.orderBy('m.date', 'DESC');
    return query;
  }
}
