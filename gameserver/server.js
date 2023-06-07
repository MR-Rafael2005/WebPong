import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";

//Http cria o server usando a função express, e o a variavel socket reconhece a criação de um server e usa o socket nesse server 
const app = express();
const server = http.createServer(app);
const sockets = new Server(server, {
    //Parte responsavel por permitir a execução em localhost
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
});

const game = {
  players: {},
  rooms: {}
}


const updatePlayers = () => {
  sockets.emit("PlayerUpdate", game.players);
}

const updateRooms = () => {
  sockets.emit("RoomsUpdate", game.rooms);
}

const sendMessage = (name,message) => {
  sockets.emit("ReciMessage", name + ": " + message);
}

const leaveRoom = (socketID) => {
  const roomID = game.players[socketID].room;
  const room = game.rooms[roomID];

  if(room) {
    if(socketID === room.player1)
    {
      room.player1 = undefined;
    } else {
      room.player2 = undefined;
    }
    if((room.player1 === undefined && room.player2 === undefined))
    {
      delete game.rooms[socketID];
    }

    game.players[socketID].room = undefined;
  }
  updatePlayers();
  updateRooms();
}

sockets.on("connection", (socket) => {
    const name = "player_" + socket.id.substr(0,5);
    game.players[socket.id] = { name };
    sendMessage(game.players[socket.id].name, "(CONNECTED)");

    socket.on('disconnect', () => {
      leaveRoom(socket.id);
      sendMessage(game.players[socket.id].name, "(DISCONNECTED)");
      delete game.players[socket.id];
      updatePlayers();
      updateRooms();
    })

    socket.on("SendMessage", (message) => {
      sendMessage(game.players[socket.id].name, message);
    })

    socket.on("CreateRoom", () => {
      socket.join(socket.id);

      game.rooms[socket.id] = {
        name: game.players[socket.id].name + "_ROOM",
        player1: socket.id,
        player2: undefined
      }

      game.players[socket.id].room = socket.id;
      updatePlayers();
      updateRooms();
    })

    socket.on("LeaveRoom", () => {
      leaveRoom(socket.id);    
      updatePlayers();
      updateRooms();
    })

    socket.on("JoinRoom", (roomid) => {
      socket.join(roomid);

      const pos = game.rooms[roomid].player1 ? "2" : "1";

      game.rooms[roomid]["player" + pos] = socket.id;

      game.players[socket.id].room = roomid;
      updatePlayers();
      updateRooms();
    })

    updatePlayers();
    updateRooms();
})


app.get("/", (req,res) => res.send("Porta do server"));
const port = 4000;
server.listen(port, () => console.log("Testando a porta " + port + " do server"));