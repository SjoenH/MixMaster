var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var channelList = [];
var clientList = [];
var userObjects = [];

var dev = true;
if (dev) {
  channelList = ['Kick','Snare','Rack-Tom','Floor-Tom','Hi-hat','OH','Bass','Guitar','Keys'];
}
// for (var i = 0; i < demoChannels.length; i++) {
//    socket.emit('newChannel',demoChannels[i]);
// }

app.get('/', function(req, res){
  res.sendfile('client.html');
});

app.get('/host', function(req, res){
  res.sendfile('host.html');
});

app.get('/admin', function(req,res){
  res.sendFile('admin.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('userSendsID',function(userID){
    if (userID == 'admin') {
        socket.emit('allChannels',channelList);
    }else {
      //if new userID
      // Add to list of connected clients
      console.log(userID);
      if(clientList.indexOf(userID)==-1){
        //Add channels to user.
        var newPerson = {Name:userID};
        clientList.push(userID);
        userObjects.push(newPerson);
        //Send all available channels
        socket.emit('allChannels',channelList);
        console.log(clientList);
        //send new user to host
        io.emit('newUser',channelList,userID);
      }else {
        //TODO: send the users existing channels
        console.log("User already exists!");
        // Temporarily sending this:
        socket.emit('allChannels',channelList);
      };
      console.log("clientList.length: ",clientList.length);
    };
  });

  //on disconnect:
  socket.on('disconnect', function(){
    console.log('user disconnected');
    // Remove from list of connected clients
  });
  socket.on('newChannel', function(channelName){
    console.log('New Channel: ' + channelName);
    // Add to list of available channels
    console.log(io.clients);
    channelList.push(channelName);
    console.log(channelList);
    // Send to all connected clients
    io.emit('newChannel', channelName);
  });
  socket.on('setChannelValue',function(userID,channelId,channelValue){
    console.log("User: ",userID);
    console.log("channelId: "+channelId);
    console.log("channelValue: "+ channelValue);
    // Send to master view
    io.emit('setChannelValue',userID,channelId,channelValue);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
