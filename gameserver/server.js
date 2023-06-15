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

const gameConfig = {
  width: 580,
  height: 320
}

const game = {
  players: {},
  rooms: {},
  match: {}
}


const updatePlayers = () => {
  sockets.emit("PlayerUpdate", game.players);
}

const updateRooms = () => {
  sockets.emit("RoomsUpdate", game.rooms);
}

const updateMatchs = (roomid) => {
  sockets.to(roomid).emit("MatchUpdate", game.match[roomid] || {});
}

const sendMessage = (name,message) => {
  sockets.emit("ReciMessage", name + ": " + message);
}

const gameProgress = (roomID) => {
  const match = game.match[roomID];

  if(!match || match.status === "END")
  {
    return;
  }

  const { ball } = match;

  switch (match.status) {
    case "PLAY":
      const xpos = ball.x + ball.xspeed * ball.xdirection;
      const ypos = ball.y + ball.yspeed * ball.ydirection;

      ball.x = xpos;
      ball.y = ypos;

      if(xpos > match.gameConfig.width - ball.width || xpos < ball.width)
      {
        ball.xdirection *= -1;
      }

      if(ypos > match.gameConfig.height - ball.width || ypos < ball.width)
      {
        ball.ydirection *= -1;
      }

      if(xpos < ball.width)
      {
        match.score2++;
      }

      if(xpos > match.gameConfig.width - ball.width)
      {
        match.score1++;
      }
      break;
  }

  updateMatchs(roomID);

  setTimeout(() => {gameProgress(roomID)}, 1000 / 60);
}

const leaveRoom = (socket) => {
  const socketID = socket.id;
  const roomID = game.players[socketID].room;
  const room = game.rooms[roomID];

  if(room) {
    const match = game.match[roomID];
    
    const playerN = "player" + (socketID === room.player1 ? 1 : 2);

    room[playerN] = undefined;

    if(match)
    {
      match[playerN] = undefined;
      match.status = "END";
      match.message = "O player " + game.players[socketID].name + " se desconectou";
    }

    if((room.player1 === undefined && room.player2 === undefined))
    {
      console.log
      delete game.rooms[game.players[socketID].room];
      if(match)
      {
        delete game.match[roomID];
      }
    }
    game.players[socketID].room = undefined;
    updateMatchs(roomID);
    socket.leave(roomID);
  }
}

sockets.on("connection", (socket) => {
    const name = "player_" + socket.id.substr(0,5);
    game.players[socket.id] = { name };
    sendMessage(game.players[socket.id].name, "(CONNECTED)");

    socket.on('disconnect', () => {
      leaveRoom(socket);
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
        name: "Sala do player: " + game.players[socket.id].name,
        player1: socket.id,
        player2: undefined
      }

      game.players[socket.id].room = socket.id;

      updatePlayers();
      updateRooms();
    })

    socket.on("LeaveRoom", () => {
      leaveRoom(socket);    
      updatePlayers();
      updateRooms();
    })

    socket.on("JoinRoom", (roomid) => {
      socket.join(roomid);

      const pos = game.rooms[roomid].player1 ? "2" : "1";

      game.rooms[roomid]["player" + pos] = socket.id;

      game.players[socket.id].room = roomid;

      const room = game.rooms[roomid];
      if(room.player1 && room.player2)
      {
        game.match[roomid] = {
          gameConfig,
          player1: {ready: false},
          player2: {ready: false},
          score1: 0,
          score2: 0,
          status: "START"
        }

        gameProgress(roomid);
      }
      updatePlayers();
      updateRooms();
      updateMatchs(roomid);
    })

    socket.on("GameLoaded", () => {
      const roomID = game.players[socket.id].room;
      const match = game.match[roomID];
      const player = "player" + (game.rooms[roomID].player1 == socket.id ? 1 : 2);

      match[player] = {ready: true};

      if(match.player1.ready && match.player2.ready)
      {
        match.status = "PLAY";
        match.ball = {
          width: 5,
          xdirection: 1,
          ydirection: 2,
          xspeed: 2.8,
          yspeed: 2.2,
          x: gameConfig.width / 2,
          y: gameConfig.height / 2,
        }
      }
    })


    socket.on("SendKey", ({ type, key }) => {
      const socketID = socket.id;
      const player = game.players[socketID];
      const roomID = player.room;
      const room = game.rooms[roomID];
      const playerNum = "player" + (socketID === room.player1 ? 1 : 2);
      const match = game.match[roomID];
      const direction = (type === "keyup" ? "STOP" : key.replace("Arrow", '').toUpperCase());

      match[playerNum] = {...match[playerNum], direction};

      console.log("A tecla " + key + " foi pressionada e agora a direção do player é: " + direction);
    })

    updatePlayers();
    updateRooms();
})


app.get("/", (req,res) => res.send("Porta do server"));
const port = 4000;
server.listen(port, () => console.log("Testando a porta " + port + " do server"));