var mysql = require('mysql');
var plotly = require('plotly')('spuz', 'etqu8gt69m');

var connection = new mysql.createConnection({
    "host": "localhost",
    "user": "reddit",
    "password": "redditbutton",
    "database": "reddit"
});

connection.connect();

connection.query('SELECT timestamp, clicks from buttonclicks', function(err, rows, fields) {
  if (err) throw err;

  var timestamps = [];
  var clickcount = [];
  var clicksdelta = [];
  var lastclicks = rows[0].clicks - 400;
  var lasttime = new Date(rows[0].timestamp) - 60000;

  for (var i = 0; i < rows.length; i += 40) {
    timestamps.push(rows[i].timestamp);
    clickcount.push(rows[i].clicks);

    var thisTime = new Date(rows[i].timestamp); 
    var timeDelta = thisTime - lasttime;
    var delta = Math.floor((rows[i].clicks - lastclicks) * 60000 / timeDelta);
    clicksdelta.push(delta);
    lastclicks = rows[i].clicks;
    lasttime = thisTime;
  }

  var clicks = {x:timestamps, y:clickcount, type:"scatter", name: "Clicks"};
  var clicksdelta = {x:timestamps, y:clicksdelta, type:"scatter", yaxis:'y2', name: "Clicks Delta"};

  var data = [clicks, clicksdelta];

  var layout = {
    title: 'Reddit button clicks over time',
    yaxis: {title: "Total clicks"},
    yaxis2: {title: "Clicks per minute", overlaying: "y", side: "right"}
  };

  var graphOptions = {layout: layout, filename: "reddit-button-clicks", fileopt: "overwrite"};

  console.log("Plotting " + timestamps.length + " points...");
  plotly.plot(data, graphOptions, function (err, msg) {
    console.log("Plotted", err, msg);
  });
});
