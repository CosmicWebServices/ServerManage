var sockets = [];
var specs = [];

for (i in config.servers){
  sockets[i] = io.connect(config.servers[i][1]);
  specs[i]={};
  sockets[i].on('diskSpace', function(info){
    specs[info.i].disk = info.space;

  })
  sockets[i].on('cpuUsage', function(info){
    specs[info.i].cpu = info.cpu;
  })

  $(".navbar-nav.mr-auto").append('<li class="nav-item"><a class="nav-link" href="#">'+ config.servers[i][0] +'</a></li>');
}


function tick15s(){
  console.log("15 second tick ran")
  for (i in sockets){
    sockets[i].emit("diskSpace", i)
    sockets[i].emit("cpuUsage", i)
  }
}

tick15s();
setInterval(tick15s, 15000)
