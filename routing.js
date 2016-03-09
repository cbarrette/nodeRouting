var fs = require('fs');
var http = require('http');
var httpProxy = require('http-proxy');
var url = require('url');


http.createServer(function(req, res) {
  var proxy = httpProxy.createProxyServer({});
  proxy.on('error', function(err, req, res) {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Something borked, come back later');
  });
  var conf = JSON.parse(fs.readFileSync(`${__dirname}/conf.json`, 'utf8'));
  var hostname = url.parse(`http://${req.headers.host}`).hostname;
  var host = conf[hostname];
  if (!host) {
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    res.end('Nothing here, move along');
  } else {
    target = getTarget(host);
    console.log(target);
    proxy.web(req, res, target);
  }
}).listen(8000);


function getTarget(host) {
  return {
    target: `http://${host.ip}:${host.port}`
  };
}
