var sockets = [];
var specs = [];
var currentServer = 0;

for (i in config.servers){
  sockets[i] = io.connect(config.servers[i][1]);
  specs[i]={};
  sockets[i].on('diskSpace', function(info){
    specs[info.i].disk = info.space;

  })
  sockets[i].on('cpuUsage', function(info){
    specs[info.i].cpu = info.cpu;
  })
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
function drawNav(){
  for (i in config.servers){
    $(".treeview-menu").append('<li class="active"><a href="#"><i class="fa fa-circle-o"></i>'+config.servers[i][0]+'</a></li>');
  }
}
