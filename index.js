var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};
app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});

io.on('connection', function(socket){
    socket.on('join',function(user){
        socket.emit('user-list',users);
        users[socket.id] = user;
        socket.broadcast.emit('update-user-list',user,socket.id);
    })

    socket.on('user-tab',function(){
        socket.broadcast.emit('user-tab',users[socket.id]);
    })

     socket.on('rem-user-tab',function(){
        socket.broadcast.emit('rem-user-tab');
    })

    socket.on('chat message', function(msg,id){
        if(id){
            io.sockets.sockets[id].emit('chat message', msg,users[socket.id]);
            socket.emit('chat message', msg,users[socket.id]);
            return
        }else{
        socket.broadcast.emit('chat message', msg,users[socket.id]);
        }
    });

    socket.on("disconnect", function(){
        socket.broadcast.emit('delete-user-id',socket.id,users[socket.id]);
        delete users[socket.id];
    })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});