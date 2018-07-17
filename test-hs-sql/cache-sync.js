const cache = require('@cognosante/healthshare-cache');
const CacheSyncConnection = require('./cache-sync');

function formatSql(s) {
  const v = s ? s.replace(/\n/g, ' ') : '';
  return v.trim();
}

module.exports = class ASyncCache {
  constructor(config) {
    this.config = config;
    this.log = config.log && typeof config.log === 'function' ? config.log : s => {};
    this.connInfo = `${this.config.ip_address}:${this.config.tcp_port}/${this.config.namespace}`;
  }

  execute(sql) {
    return new Promise((resolve, reject) => {
      let ret;
      try {
        const conn = cache();
        // opening connection
        const oresult = conn.open(this.config);
        if (oresult && !oresult.ok) reject(oresult);
        this.log(`Healthshare ${this.connInfo} opened (CACHE_PID=${oresult.cache_pid})`);
        // executing query
        const iresult = conn.invoke_classmethod({
          class: 'EnsLib.SQL.JsonSqlRunner',
          method: 'RunSQL',
          arguments: [sql]
        });
        // closing connection
        const cresult = conn.close();
        this.log(`Healthshare ${this.connInfo} closed`);
        this.log(`Executed SQL: ${formatSql(sql)}`);
        // parsing result
        this.log('Processing result ...');
        if (iresult && iresult.result) {
          this.log(`Parsing query json string result ...`);
          ret = JSON.parse(iresult.result);
        }
        this.log(`Resolving promise and returning result`);
        resolve(ret);
      } catch (err) {
        reject(err);
      }
    });
  }
};
