//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var express = require('express');

const SERVER_PORT = process.env.PORT || 3000;
const SERVER_IP = process.env.IP || "0.0.0.0";
// const HTML_CLIENT = 'angular-client';
const HTML_CLIENT = 'jquery-client';

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);

var $mqio = require('@mapquest/io')('minimum-viable-security', 'test');

router.get('/test', (request, response, next) => {
  console.log('test request', request.params);
  response.send('hello world');
});

router.get('/clients', (request, response, next) => {
  $mqio.clients.list()
    .then(clientList => {
      var subClientList = clientList.clients.slice(0,4);
      console.log(subClientList);
      return subClientList;
    })
    .then(clients => response.send({clients}), next);
    //.then((clientList) => response.send(clientList), next);
});

router.get('/geofences', (request, response, next) => {
  $mqio.geofences.list()
    .then(geofenceList => {
      console.log('geofence list', Object.keys(geofenceList), geofenceList.geofences.length);
      return geofenceList.geofences.slice(0, 5);
    })
    .then(geofences => response.send({ geofences }), next);
    //.then((geofences) => response.send(geofences), next);
});

router.get('/speed-alerts', (request, response, next) => {
  $mqio.speedAlerts.list()
    .then(speedAlertList => {
      console.log('speed alert list', Object.keys(speedAlertList), speedAlertList.speedAlerts.length);
      return speedAlertList.speedAlerts.slice(0, 5);
    })
    .then(speedAlerts => response.send({ speedAlerts }), next);
    //.then((speedAlerts) => response.send(speedAlerts), next);
});

router.use(express.static(path.resolve(__dirname, HTML_CLIENT)));

server.listen(SERVER_PORT, SERVER_IP, function onServerListening() {
  var serverAddress = server.address();
  console.log("Server listening at", serverAddress.address + ":" + serverAddress.port);
});
