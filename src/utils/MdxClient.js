const axios = require('axios');
const { isString, isEmpty } = require('lodash');
// see:
// https://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=SETDeepSee
// https://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=D2CLIENT_intro_rest
// https://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=D2CLIENT_post_data_mdxexecute
// https://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=D2CLIENT_post_data_mdxdrillthrough

class MdxClient {
  constructor(hsMdxBaseUrl, hsUsername, hsPassword) {
    this._baseUrl = hsMdxBaseUrl;
    this._username = hsUsername;
    this._password = hsPassword;
  }

  // '2018/05/01' -> '201805'
  yyyymmddToMemberKey(yyyymmdd) {
    return yyyymmdd.substring(0, 4) + yyyymmdd.substring(5, 7);
  }

  // '201805' -> '2018/05/01'
  memberKeyToYYYYMMDD(memberKey) {
    return memberKey.substring(0, 4) + '/' + memberKey.substring(4) + '/01';
  }

  fetchMdxDrillthrough(namespace, query) {
    const url = `${this._baseUrl}/api/deepsee/v1/${namespace}/Data/MDXDrillthrough`;

    return axios.post(
      url,
      { MDX: query },
      {
        auth: {
          username: this._username,
          password: this._password
        }
      }
    );
  }

  _buildPivot(mdxResult, colMapper) {
    const mapper = colMapper || {};
    const propName = c => {
      const key = Object.keys(mapper).find(p => p.toLowerCase() === c.toLowerCase());
      return key ? mapper[key] : c;
    };
    const rows = [];
    const columns = [];
    mdxResult.Result.Axes[0].Tuples.forEach(t => {
      t.Members.forEach((m, i) => {
        columns.push(m.Name || `Col${i + 1}`);
      });
    });
    if (columns.length === 0) columns.push('All');
    mdxResult.Result.Axes[1].Tuples.forEach(t => {
      const row = {};
      rows.push(row);
      t.MemberInfo.forEach(m => {
        row[propName(m.levelName)] = m.memberKey;
      });
    });
    // console.log(`Cols  #${columns.length} : ` + JSON.stringify(columns, null, 2));
    // console.log(`Rows  #${rows.length} : ` + JSON.stringify(rows, null, 2));
    // console.log('Total cells:', mdxResult.Result.CellData.length);

    // fill out cells
    let rowIndex = -1;
    mdxResult.Result.CellData.forEach((cell, i) => {
      const colIndex = i % columns.length;
      if (colIndex === 0) {
        rowIndex++;
      }
      const row = rows[rowIndex];
      row[propName(columns[colIndex])] = cell.ValueLogical;
    });
    // console.log('================>\n' + JSON.stringify(rows, null, 2));
    return rows;
  }

  executeMdx(cfg) {
    const payload = { MDX: cfg.mdx };
    if (cfg.filters && cfg.filters.length) payload['FILTERS'] = cfg.filters;
    return axios
      .post(`${this._baseUrl}/api/deepsee/v1/${cfg.namespace}/Data/MDXExecute`, payload, {
        auth: { username: this._username, password: this._password }
      })
      .then(result => {
        const data = result.data;
        if (data && data.info && data.info.Error) {
          throw new Error(`MDX Execution failed: ${data.info.Error}`);
        }
        return this._buildPivot(data, cfg.mapper);
      });
  }
}

module.exports = (hsMdxUrl, hsUsername, hsPassword) => new MdxClient(hsMdxUrl, hsUsername, hsPassword);
