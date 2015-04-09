var WebSocket = require('ws');
var mysql = require('mysql');

var ws = new WebSocket('wss://wss.redditmedia.com/thebutton?h=ba3ba5328bbf8adf0ad600c7bc65cfa9d9f5413c&e=1428584441');

ws.on('open', function open() {
  console.log("Opened websocket");
});

var connection = new mysql.createConnection({
    "host": "localhost",
    "user": "reddit",
    "password": "redditbutton",
    "database": "reddit"
});

connection.connect();

ws.on('message', function(data, flags) {
  // flags.binary will be set if a binary data is received.
  // flags.masked will be set if the data was masked.
  console.log(data);

  var clickcount = 0;
  var messagetimestamp = 0;
  var secondsleft = 0;

  if (data) {
    var clickdata = JSON.parse(data);
    if (clickdata) {
      if (clickdata.payload) {
        if (clickdata.payload.participants_text) {
          clickcount = clickdata.payload.participants_text.replace(',','');
        }
        if (clickdata.payload.now_str) {
          var nowarr = clickdata.payload.now_str.split('-');
          var date = nowarr[0] + "/" + nowarr[1] + "/" + nowarr[2];
          var time = nowarr[3] + ":" + nowarr[4] + ":" + nowarr[5];
          messagetimestamp = new Date(date + " " + time + "Z");
        }
        if (clickdata.payload.seconds_left) {
          secondsleft = clickdata.payload.seconds_left;
        }
      }
    }
  }

  console.log('Count: ' + clickcount + ', timestamp: ' + messagetimestamp + ', seconds left: ' + secondsleft);

  if (clickcount && messagetimestamp) {
    connection.query('INSERT into buttonclicks SET ?', {timestamp: messagetimestamp, clicks: clickcount, secondsleft: secondsleft}, function (err, result) {
      if (err) {
        console.log('Error inserting row into mysql:', err, result);
      }
    });
  }
});

ws.on('error', function(err) {
  console.log('WS error', err);
});
