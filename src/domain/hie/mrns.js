const { execute, makePromise } = require('apollo-link');
const gql = require('graphql-tag');

const { keyBy, groupBy, uniq, compact } = require('lodash');

class Mrns {
  constructor(hsregistry, provisioningLink) {
    this._db = hsregistry;
    this._provisioningLink = provisioningLink;
  }

  loadOrganizations() {
    const operation = {
      query: gql`
        query organization {
          organization {
            list {
              id
              gisLng
              gisLat
              address {
                street1
                street2
                city
                state
              }
            }
          }
        }
      `,
      variables: {}
    };

    return makePromise(execute(this._provisioningLink, operation))
      .then(data => {
        // console.log(`received data ${JSON.stringify(data, null, 2)}`);
        console.log(`loadOrganizations(), loaded ${data.data.organization.list.length}`);

        // add upper-case keys for filtering/stitching
        return data.data.organization.list.map(e =>
          Object.assign(e, { organization_uc: e.id.toUpperCase(), city_uc: e.address && e.address.city.toUpperCase() })
        );
      })
      .catch(error => {
        console.log(`loadOrganizations(), error: ${JSON.stringify(error)}`);
        return Promise.reject(error);
      });
  }

  buildFilter(organizations, organization, city) {
    let conditions = ['1=1'];

    if (organization) {
      const organization_uc = organization.toUpperCase();
      const match = keyBy(organizations, 'organization_uc')[organization_uc];

      if (match) {
        conditions.push(`UPPER(Facility) = '${organization_uc}'`);
      } else {
        conditions.push('1=0');
      }
    }

    if (city) {
      const city_uc = city.toUpperCase();
      const matches = groupBy(organizations, 'city_uc')[city_uc];

      if (matches) {
        const organization_ucs = uniq(matches.map(e => e.organization_uc));
        const organization_list = organization_ucs.map(e => `'${e}'`).join(',');

        conditions.push(`UPPER(Facility) IN (${organization_list})`);
      } else {
        conditions.push('1=0');
      }
    }

    return conditions.join(' AND ');
  }

  byOrganization(startDate, endDate, organization, city) {
    return this.loadOrganizations().then(organizations => {
      const whereFacility = this.buildFilter(organizations, organization, city);
      console.log(`whereFacility: ${whereFacility}`);

      return this._db
        .execute(
          `
          SELECT Facility as facility, COUNT(*) as facility_count
          FROM (
            SELECT Facility, MRN FROM
            HS_Registry.Patient
            WHERE CreatedOn <= TO_DATE('${endDate}', 'YYYY/MM/DD')
              AND Facility <> ''
              AND ${whereFacility}
          )
          GROUP BY UPPER(Facility)
          ORDER BY UPPER(Facility)
          `
        )
        .then(result => {
          // merge data from provisioning api
          const facility_organizations = keyBy(organizations, 'organization_uc');
          return result.map(e => {
            const facility_uc = e.facility.toUpperCase();
            const organization = facility_organizations[facility_uc];

            return {
              organization: e.facility,
              address:
                organization &&
                organization.address &&
                compact([organization.address.street1, organization.address.street2]).join(', '),
              city: organization && organization.address && organization.address.city,
              gisLng: organization && organization.gisLng,
              gisLat: organization && organization.gisLat,
              count: e.facility_count
            };
          });
        })
        .catch(err => {
          console.error(`byOrganization(), error: ${JSON.stringify(err)}`);
        });
    });
  }

  byMonth(startDate, endDate, organization, city) {
    return this.loadOrganizations().then(organizations => {
      const whereFacility = this.buildFilter(organizations, organization, city);
      console.log(`whereFacility: ${whereFacility}`);

      console.log(`Start Date: ${startDate}`);
      console.log(`End Date: ${endDate}`);

      return this._db
        .execute(
          `
            SELECT month, COUNT(Id) AS month_count
            FROM (
              SELECT TO_CHAR(CreatedOn, 'YYYY/MM/01') as month, Id
              FROM HS_Registry.Patient
              WHERE CreatedOn BETWEEN TO_DATE('${startDate}', 'YYYY/MM/DD') AND TO_DATE('${endDate}', 'YYYY/MM/DD')
                AND ${whereFacility}
            )
            GROUP BY month
          `
        )
        .then(result => {
          console.log('===>', result);
          return result.map(e => ({
            month: e.month,
            count: e.month_count || 0
          }));
        });
    });
  }
}

module.exports = (hsregistry, provisioningLink) => new Mrns(hsregistry, provisioningLink);
