const si = require('systeminformation');
const os = require('os');
const cmd = require('node-cmd');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const config = require('./config.json')
const port = config.port || 3000;
const origins = config.domains || "*:*";
io.origins(origins)


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {

  var handshakeData = socket.request;

  if (handshakeData._query['password'] != config.password){
    socket.disconnect();
    console.log("Disconnect: Wrong Password")
  }

  console.log("Connected")
  socket.on('disconnect', function() {
    console.log("Disconnect")
  });

  socket.on('uptime', function(i) {
    var response = {
      i: i,
      uptime: [si.time().uptime]
    }
    console.log(response)
    socket.emit('uptime', response);
  })

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


  socket.on('shell', function(msg) {
    cmd.get(
      msg,
      function(err, data, stderr) {
        socket.emit('shell', [err, data, stderr])
      }
    );
  });
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
  return parseInt((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}
