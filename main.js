var fs = require('fs-extra');
var express = require('express');
var app = express();

var dir = "/opt/app/";

app.get('/', function (req, res) {
  res.send('Whalee Monit Application !');
});

app.get('/ui', function (req, res) {
  var html = '<html><head></head><body>';
  html +='<a href="" target="_blank"></a>';
  html +='<br><a href="/git?action=clone&url=https://github.com/julienbiau/whalee-container-application-example.git" target="_blank">Clone</a>';
  html +='<br><a href="/git?action=update" target="_blank">Update</a>';
  html +='<br><a href="/node?action=npm_install" target="_blank">Npm install</a>';
  html +='<br><a href="/node?action=app_start&main=main.js" target="_blank">Start</a>';
  html +='<br><a href="/node?action=app_restart&main=main.js" target="_blank">Restart</a>';
  html +='<br><a href="/node?action=app_stop" target="_blank">Stop</a>';
  html +='</body></html>';
  res.send(html);
});

app.get('/git', function (req, res) {
  var url = decodeURIComponent(req.query.url);
  var action = req.query.action;
  console.log("action: "+action+" url: "+url);
  if (action=="clone") {
    fs.remove(dir,function (err) {
      if (err) return res.status(500).send(err);
      var exec = require('child_process').exec;
      child = exec('git clone '+url+' '+dir, { cwd: null }, function (error, stdout, stderr) {
        console.log('stdout: '+stdout);
        console.log('stderr: '+stderr);
        if (error) {
          console.log('error: '+error);
          return res.status(500).send(error);
        } else {
          return res.status(200).send();
        }
      });
    });
  } else if (action=="update") {
    var exec = require('child_process').exec;
    child = exec('git pull', { cwd: dir }, function (error, stdout, stderr) {
      console.log('stdout: '+stdout);
      console.log('stderr: '+stderr);
      if (error) {
        console.log('error: '+error);
        return res.status(500).send(error);
      } else {
        return res.status(200).send();
      }
    });
  } else {
    return res.status(404).send();
  }
});

app.get('/node', function (req, res) {
  var action = req.query.action;
  var main = req.query.main;
  console.log("action: "+action+" main: "+main);
  if (action=="npm_install") {
    var exec = require('child_process').exec;
    child = exec('/opt/npm_install', { cwd: null }, function (error, stdout, stderr) {
      console.log('stdout: '+stdout);
      console.log('stderr: '+stderr);
      if (error) {
        console.log('error: '+error);
        return res.status(500).send(error);
      } else {
        return res.status(200).send();
      }
    });
  } else if (action=="app_start") {
    var exec = require('child_process').exec;
    child = exec('bash /opt/app_start '+main, { cwd: null }, function (error, stdout, stderr) {
      console.log('stdout: '+stdout);
      console.log('stderr: '+stderr);
      if (error) {
        console.log('error: '+error);
        return res.status(500).send(error);
      } else {
        return res.status(200).send();
      }
    });
  } else if (action=="app_stop") {
    var exec = require('child_process').exec;
    child = exec('bash /opt/app_stop', { cwd: null }, function (error, stdout, stderr) {
      console.log('stdout: '+stdout);
      console.log('stderr: '+stderr);
      if (error) {
        console.log('error: '+error);
        return res.status(500).send(error);
      } else {
        return res.status(200).send();
      }
    });
  } else if (action=="app_restart") {
    var exec = require('child_process').exec;
    child = exec('bash /opt/app_restart '+main, { cwd: null }, function (error, stdout, stderr) {
      console.log('stdout: '+stdout);
      console.log('stderr: '+stderr);
      if (error) {
        console.log('error: '+error);
        return res.status(500).send(error);
      } else {
        return res.status(200).send();
      }
    });
  } else {
    return res.status(404).send();
  }
});

app.get('/setup', function (req, res) {
  var url = decodeURIComponent(req.query.url);
  var main = req.query.main;
  console.log("setup => main: "+main+" url: "+url);
  fs.remove(dir,function (err) {
    if (err) return res.status(500).send(err);
    var exec = require('child_process').exec;
    child = exec('git clone '+url+' '+dir, { cwd: null }, function (error, stdout, stderr) {
      console.log('stdout: '+stdout);
      console.log('stderr: '+stderr);
      if (error) {
        console.log('error: '+error);
        return res.status(500).send(error);
      } else {
        var exec = require('child_process').exec;
        child = exec('/opt/npm_install', { cwd: null }, function (error, stdout, stderr) {
          console.log('stdout: '+stdout);
          console.log('stderr: '+stderr);
          if (error) {
            console.log('error: '+error);
            return res.status(500).send(error);
          } else {
            var exec = require('child_process').exec;
            child = exec('bash /opt/app_start '+main, { cwd: null }, function (error, stdout, stderr) {
              console.log('stdout: '+stdout);
              console.log('stderr: '+stderr);
              if (error) {
                console.log('error: '+error);
                return res.status(500).send(error);
              } else {
                return res.status(200).send();
              }
            });
          }
        });
      }
    });
  });
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
