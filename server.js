var express = require('express');
var app = express();
 
var http = require('http');
const { exit } = require('process');
var server = http.Server(app);
 
var socket = require('socket.io');
var io = socket(server);
 
var port = 5000;
var socketList = []; //socket담는 공간
let userarr = []; //최초 이름 저장 공간
let getnamearr = []; //같은 이름 확인 후 이름 저장 공간

app.use('/', function(req, resp) {
    resp.sendFile(__dirname + '/chat.html');
});
 

io.on('connection', function(socket) {

    socketList.push(socket); 

    console.log('User Join');
    socket.on('SEND', function(msg, user_name) {
        console.log(msg);
        socketList.forEach(function(item, i) {
            console.log(item.id); //소켓 고유값(?)주소값(?)
            if (item != socket) {
                item.emit('SEND', msg, user_name);
            }
        });
    });

    

    socket.on('USER_LIST', function (user_id) {
        userarr.push({"user_id":user_id});
        let found;
        userarr.forEach(function(name, idx) {
            found = getnamearr.find(element => element ==name.user_id);
            
        });

        socketList.forEach(function (item, i) {
            
            console.log(getnamearr)
            item.emit('ENTERINFO',JSON.stringify(user_id), true);
        
        });
 
        if(found) {//같은 값을 찾으면
            socket.emit('LISTINFO',false);
            return;
            
        } else {
            getnamearr.push(user_id); //요소 추가
            sendNameToEachClient();
        }
        
  
    });

    socket.on('disconnect', function() {
        let sidx = socketList.indexOf(socket)
   
        console.log(getnamearr[sidx]);

        socketList.forEach(function (item, i) {
            
            console.log(getnamearr)
            item.emit('ENTERINFO',JSON.stringify(getnamearr[sidx]), false);
        
        });
        socketList.splice(sidx, 1);
        userarr.splice(sidx, 1);
        getnamearr.splice(sidx, 1);
    
        sendNameToEachClient();
        
    });

    function sendNameToEachClient() {
        socketList.forEach(function (item, i) {
            
            console.log(getnamearr)
            item.emit('LISTINFO',JSON.stringify(getnamearr));
        });
      
    }

});
 
server.listen(port, function() {
    console.log('Server On !');
});

