const si = require('systeminformation');
const os = require('os');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.port || 3000;
const origins = process.env.domains || "*:*";
io.origins(origins)

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log("Connected")
  socket.on('disconnect', function() {
    console.log("Disconnect")
  });

  socket.on('cpuUsage', function(i) {
    si.currentLoad(function(value) {
      var response = {
        i: i,
        cpu: [value.currentload]
      }
      console.log(response)
      socket.emit('cpuUsage', response);
    })
  })

  socket.on('diskSpace', function(i) {
    si.fsSize(function(value) {
      var response = {
        i: i,
        space: [formatBytes(value[0].size), formatBytes(value[0].used), value[0].use]
      }
      console.log(response)
      socket.emit('diskSpace', response);
    })
  })

});

http.listen(port, function() {
  console.log('listening on *:' + port);
});

function formatBytes(a, b) {
  if (0 == a) return "0 Bytes";
  var c = 1024,
    d = b || 2,
    e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    f = Math.floor(Math.log(a) / Math.log(c));
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}
