var sockets = [];
var specs = [];

for (i in config.servers){
  sockets[i] = io.connect(config.servers[i]);
  specs[i]={};
  sockets[i].on('diskSpace', function(space){
    specs[space.i].disk = space.space;
  })
}


function tick15s(){
  console.log("15 second tick ran")
  for (i in sockets){
    sockets[i].emit("diskSpace", i)
  }
}

tick15s();
setInterval(tick15s, 15000)
