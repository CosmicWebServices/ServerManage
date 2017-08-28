var sockets = [];
var specs = [];
var currentServer = 0;

for (i in config.servers) {
  sockets[i] = io.connect(config.servers[i][1]);
  specs[i] = {};
  sockets[i].on('diskSpace', function(info) {
    specs[info.i].disk = info.space;
    $("#DiskPerc").html(info.space[2]);
    $("#DiskUsed").html(info.space[1]);
    $("#DiskMax").html(info.space[0]);

    if (info.space[2] < config.diskColors[0]) {
      $("#DiskUsageIcon").removeClass("bg-red").removeClass("bg-yellow").addClass("bg-green")
    }
    if (info.space[2] < config.diskColors[1] && info.space[2] > config.diskColors[0]) {
      $("#DiskUsageIcon").removeClass("bg-red").removeClass("bg-green").addClass("bg-yellow")
    }
    if (info.space[2] > config.diskColors[1]) {
      $("#DiskUsageIcon").removeClass("bg-yellow").removeClass("bg-green").addClass("bg-red")
    }

  })

  sockets[i].on('uptime', function(info) {
    info.uptime[0] = sformat(info.uptime[0]);

    if (info.uptime[0].split(":")[0] == '00') {
      info.uptime[0] = info.uptime[0].substring(3);

      if (info.uptime[0] != "01") {
        info.uptime[0] += " Hours!";
      } else {
        info.uptime[0] += " Hour!";
      }

    } else {
      info.uptime[0] = info.uptime[0].slice(0, -3);

      if (info.uptime[0] != "01") {
        info.uptime[0] += " Days!";
      } else {
        info.uptime[0] += " Day!";
      }
    }

    if (info.uptime[0].startsWith("0")) {
      info.uptime[0] = info.uptime[0].substring(1);
    }


    if (info.uptime[0] == "0 Hours!") {
      info.uptime[0] = "Less Than 1 Hour :("
    }

    specs[info.i].uptime = info.uptime;
    $("#uptimecounter").html(info.uptime[0]);

  })

  sockets[i].on('cpuUsage', function(info) {
    info.cpu[0] = Math.ceil(info.cpu[0] * 100) / 100;
    specs[info.i].cpu = info.cpu;
    $("#CPUPerc").html(info.cpu[0]);

  })
}

function drawNav() {
  $(".treeview-menu").html("");
  for (i in config.servers) {
    $(".treeview-menu").append('<li ' + navBarActive() + '><a href="#"><i class="fa fa-circle-o"></i>' + config.servers[i][0] + '</a></li>');
  }
}

function navBarActive() {
  if (i == currentServer) {
    return 'class="active"'
  } else {
    return "";
  }
}

function tick15s() {
  console.log("15 second tick ran")
  sockets[currentServer].emit("diskSpace", currentServer)
  sockets[currentServer].emit("uptime", currentServer)
}

function sformat(s) {
  var fm = [
    Math.floor(s / 60 / 60 / 24), // DAYS
    Math.floor(s / 60 / 60) % 24 // HOURS
  ];
  return $.map(fm, function(v, i) {
    return ((v < 10) ? '0' : '') + v;
  }).join(':');
}

function tick5s() {
  console.log("5 second tick ran")
  sockets[currentServer].emit("cpuUsage", currentServer)
}

drawNav();
tick15s();
setInterval(tick15s, 15000)
tick5s();
setInterval(tick5s, 5000)
