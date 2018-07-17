const CacheConnection = require('./cache-sync');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  const config = process.env;
  const conn = new CacheConnection({
    ip_address: config.HS_HOST,
    tcp_port: config.HS_PORT,
    username: config.HS_USERNAME,
    password: config.HS_PASSWORD,
    namespace: config.HS_REGISTRY_NAMESPACE,
    debug: 0,
    stop_signal: 'SIGINT,SIGTERM',
    log: s => console.log(s)
  });
  conn
    .execute(
      'SELECT AssigningAuthority as facility, count(*) as value FROM HS_Registry.Patient group by AssigningAuthority'
    )
    .then(result => {
      console.log('Query executed');
      res.json(result);
    });
});

const port = 8000;
app.listen(port);
console.log('Magic happens on port ' + port);
