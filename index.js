var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('client.html');
});

app.get('/host', function(req, res){
  res.sendfile('host.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  // Add to list of connected clients
  socket.on('disconnect', function(){
    console.log('user disconnected');
    // Remove from list of connected clients
  });
  socket.on('newChannel', function(channelName){
    console.log('New Channel: ' + channelName);
    // Add to list of available channels
    // Send to all connected clients
    io.emit('newChannel', channelName);
  });
  socket.on('newUser',function(userName){
    console.log("New User: "+ userName);
    // Send to all connected clients
    io.emit('newUser',userName);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
