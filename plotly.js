var mysql = require('mysql');
var plotly = require('plotly')('spuz', 'etqu8gt69m');

var connection = new mysql.createConnection({
    "host": "localhost",
    "user": "reddit",
    "password": "redditbutton",
    "database": "reddit"
});

connection.connect();

connection.query('SELECT timestamp, clicks, secondsleft from buttonclicks', function(err, rows, fields) {
  if (err) throw err;

  var interval = Math.floor(rows.length / 1000);
  var timestamps = [];
  var clickcount = [];
  var clicksdelta = [];
  var minseconds = [];
  var lastclicks = rows[0].clicks - 400;
  var lasttime = new Date(rows[0].timestamp) - 60000;

  for (var i = 0; i < rows.length; i += interval) {
    timestamps.push(rows[i].timestamp);
    clickcount.push(rows[i].clicks);

    var thisTime = new Date(rows[i].timestamp); 
    var timeDelta = thisTime - lasttime;
    var delta = Math.floor((rows[i].clicks - lastclicks) * 60000 / timeDelta);
    clicksdelta.push(delta);
    lastclicks = rows[i].clicks;
    lasttime = thisTime;

    var intervalminseconds = 60;
    for (var j = i; j < i+interval && j < rows.length; j++) {
      if (rows[j].secondsleft < intervalminseconds) {
        intervalminseconds = rows[j].secondsleft;
      }
    }
    minseconds.push(intervalminseconds);
  }

  var clicks = {x:timestamps, y:clickcount, type:"scatter", name: "Clicks"};
  var clicksdelta = {x:timestamps, y:clicksdelta, type:"scatter", yaxis:'y2', name: "Clicks delta"};
  var seconds = {x:timestamps, y:minseconds, type:"scatter", yaxis:'y3', name: "Seconds left"};

  var data = [clicks, clicksdelta, seconds];

  var layout = {
    title: 'Reddit button clicks over time',
    yaxis: {title: "Total clicks"},
    yaxis2: {title: "Clicks per minute", overlaying: "y", side: "right"},
    yaxis3: {title: "Seconds left reached", overlaying: "y", side: "right", anchor: "free", position: 0.85}
  };

  var graphOptions = {layout: layout, filename: "reddit-button-clicks", fileopt: "overwrite"};

  console.log("Plotting " + timestamps.length + " points...");
  plotly.plot(data, graphOptions, function (err, msg) {
    if (err) {
      console.log("Error plotting", err, msg);
      process.exit(1);
    } else {
      console.log("Plotted successfully");
      process.exit();
    }
  });
});
