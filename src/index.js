var logger = require('tracer').console();

const { version, name, hash } = require('../package');
const Knex = require('knex');
const cache = require('@cognosante/healthshare-cache-sql');

const knexCache = {};

const fetch = require('node-fetch');
const { createHttpLink } = require('apollo-link-http');
const mdxClient = require('./utils/MdxClient');
const graphqlClient = require('./utils/GraphQLClient');

function lazyKnex(cacheKey, create) {
  if (!knexCache[cacheKey]) {
    logger.log(`------>\t Creating new [${cacheKey}]`);
    knexCache[cacheKey] = create();
  } else {
    logger.log(`------>\t Reusing existing [${cacheKey}]`);
  }
  return knexCache[cacheKey];
}

module.exports = {
  appInfo: { version: version, name: name, hash: hash },
  schemas: config => [require('./graphql'), config.HEDIS_API_URL, config.MIPS_API_URL, config.PROVISIONING_API_URL],
  context: (config, req) => {
    return {
      db: lazyKnex(`${config.DB_HOST} -> ${config.DB_DATABASE}`, () =>
        Knex({
          client: 'pg',
          debug: (config.DEBUG || '').toLowerCase() === 'true',
          connection: {
            host: config.DB_HOST,
            port: config.DB_PORT,
            database: config.DB_DATABASE,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            application_name: name
          }
        })
      ),
      wso2db: lazyKnex(`${config.WSO2_DB_HOST}.${config.WSO2_DB_DATABASE}`, () =>
        Knex({
          client: 'mysql',
          debug: (config.DEBUG || '').toLowerCase() === 'true',
          connection: {
            host: config.WSO2_DB_HOST,
            port: config.WSO2_DB_PORT,
            database: config.WSO2_DB_DATABASE,
            user: config.WSO2_DB_USER,
            password: config.WSO2_DB_PASSWORD,
            application_name: name
          }
        })
      ),
      hsregistrydb: lazyKnex(`${config.HS_HOST}-${config.HS_REGISTRY_NAMESPACE}`, () => {
        logger.log(`Creating healthcare connection: date ${Date.now()}`);
        return cache({
          ip_address: config.HS_HOST,
          tcp_port: config.HS_PORT,
          username: config.HS_USERNAME,
          password: config.HS_PASSWORD,
          namespace: config.HS_REGISTRY_NAMESPACE,
          debug: 0,
          stop_signal: 'SIGINT,SIGTERM',
          log: s => logger.log(s)
        });
      }),
      //TODO: remove this and replace with provisioning Api call
      provisioningLink: createHttpLink({
        uri: config.PROVISIONING_API_URL.startsWith('http')
          ? config.PROVISIONING_API_URL
          : `https://${config.PROVISIONING_API_URL}`,
        fetch: fetch
      }),
      hsMdxClient: mdxClient(config.HS_BASE_URL, config.HS_USERNAME, config.HS_PASSWORD),
      provisioningApi: graphqlClient(config.PROVISIONING_API_URL)
    };
  }
};
