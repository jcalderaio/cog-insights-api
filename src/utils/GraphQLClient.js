const { execute, makePromise } = require('apollo-link');
const { createHttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const gql = require('graphql-tag');
const { isString } = require('lodash');

var link;

class GraphQLClient {
  constructor(graphQLEndpoint) {
    this._graphQLEndpoint = graphQLEndpoint;
  }

  getLink() {
    console.log('@@@@', this._graphQLEndpoint);
    link = link || createHttpLink({ uri: this._graphQLEndpoint, fetch });
    return link;
  }

  query(graphqlQuery, vars) {
    const q = isString(graphqlQuery)
      ? gql`
          ${graphqlQuery}
        `
      : graphqlQuery;
    const operation = { query: q, variables: vars || {} };
    console.log('++++++');
    return makePromise(execute(this.getLink(), operation))
      .then(r => {
        console.log('*********', r);
        return r;
      })
      .catch(err => {
        console.log('######', err);
        return Promise.reject(err);
      });
  }
}

module.exports = url => new GraphQLClient(url);
