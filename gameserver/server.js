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
  height: 320,
  maxScore: 5
}

const game = {
  players: {},
  rooms: {},
  match: {},
  names: {}
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

  switch (match.status) {
    case "PLAY":
      moveBall(match);
      movePaddle(match);
      checkColision(match, roomID);
      break;
  }

  updateMatchs(roomID);

  setTimeout(() => {gameProgress(roomID)}, 1000 / 30);
}

const checkColision = (match, roomID) => {
  const { gameConfig, ball} = match;

  if(ball.y > gameConfig.height - ball.width)
  {
    ball.y = gameConfig.height - (ball.width * 2);
    ball.ydirection = -1;
  }

  if(ball.y < ball.width) 
  {
    ball.y = ball.width * 2;
    ball.ydirection = 1;
  }

  const {x: bx, y: by, width: br} = ball;

  const playerN = bx < gameConfig.width / 2 ? 1 : 2;
  const player = "player" + playerN;

  const {x: rx, y: ry, width: rw, height: rh} = match[player];

  let testX = bx;
  let testY = by;

  if(bx < rx)
  {
    testX = rx;
  } else if(bx > rx + rw) {
    testX = rx + rw;
  }

  if(by < ry)
  {
    testY = ry;
  } else if(by > ry + rh) {
    testY = ry + rh;
  }

  const distX = bx - testX;
  const distY = by - testY;
  const distance = Math.sqrt((distX * distX) + (distY * distY));

  if(distance <= br)
  {
    ball.xdirection *= -1;
    ball.x = playerN === 1 ? match[player].x + match[player].width + br : match[player].x - br;

    const quarterTop = by < ry + (rh / 4);
    const quarterBott = by > ry + rh - (rh / 4);
    const halfTop = by < ry + (rh / 2);
    const halfBott = by > ry + rh - (rh / 2);
    
    if(quarterBott || quarterTop)
    {
      ball.yspeed += 0.15;
      ball.xspeed -= 0.15;

      ball.ydirection = quarterBott ? 1 : -1;
    } else if(halfTop || halfBott) {
      ball.yspeed += 0.05;
      ball.xspeed -= 0.05;
    }

    ball.xspeed *= 1.1;
  } else if(ball.x < ball.width) {
    match.score2++;
    restartMatch(match, roomID);
  } else if(ball.x > gameConfig.width - ball.width) {
    match.score1++;
    restartMatch(match, roomID);
  }

}

const moveBall = ({ ball }) => {
  const xPos = ball.x + ball.xspeed * ball.xdirection;
  const yPos = ball.y + ball.yspeed * ball.ydirection;

  ball.x = xPos;
  ball.y = yPos;
}

const movePaddle = (match) => {
  [1,2].forEach((i) => {
    const player = match["player" + i];

    switch(player.direction) 
    {
      case "UP":
        player.y -= player.speed;
        break;
      case "DOWN":
        player.y += player.speed;
        break;
    }

    if(player.y < 0)
    {
      player.y = 0;
    } else if(player.y + player.height > match.gameConfig.height) {
      player.y = match.gameConfig.height - player.height;
    }
  })
}

const restartMatch = (match, roomID) => {

  if(match.score1 === match.gameConfig.maxScore || match.score2 === match.gameConfig.maxScore)
  {
    const playerN = match.score1 === match.gameConfig.maxScore ? 1 : 2;
    const playerSocketID = game.rooms[roomID]["player" + playerN];
    match.status = "END";
    match.message = "O JOGADOR \"" +  game.names[playerSocketID].newname + "\" GANHOU";
  }

  game.rooms[roomID] = {
    ...game.rooms[roomID], 
    score1: match.score1, 
    score2: match.score2
  }

  match.ball = {
    width: 5,
    xdirection: match.ball ? match.ball.xdirection * -1 : 1,
    ydirection: 2,
    xspeed: 5,
    yspeed: 5 * (match.gameConfig.height / match.gameConfig.width),
    x: gameConfig.width / 2,
    y: gameConfig.height / 2,
  }

  updateRooms();
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
      if(match.status !== "END")
      {
        match.status = "END";
        match.message = "O player " + game.names[socket.id].newname + " se desconectou";    
      }
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
    socket.leave(roomID);
    updateMatchs(roomID);
    socket.emit("ClearMatch")
  }
}

const nameUpdate = () => {
  sockets.emit("NamesUpdate", game.names);
}


sockets.on("connection", (socket) => {
    const name = "player_" + socket.id.substr(0,5);
    game.players[socket.id] = { name };
    //sendMessage(game.players[socket.id].name, "(CONNECTED)");
    updatePlayers();
    updateRooms();

    socket.on('disconnect', () => {
      leaveRoom(socket);
      if(game.names[socket.id])
      {
        delete game.names[socket.id];
      }
      delete game.players[socket.id];
      updatePlayers();
      nameUpdate();
      updateRooms();
    })

    socket.on("SendMessage", (message) => {
      sendMessage(game.players[socket.id].name, message);
    })

    socket.on("CreateRoom", () => {
      socket.join(socket.id);

      game.rooms[socket.id] = {
        name: "Sala do player: " + game.names[socket.id].newname,
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
          player1: {
            ready: false,
            x: 5,
            y: gameConfig.height / 2 - 40,
            height: 80,
            width: 10,
            speed: 5
          },
          player2: {
            ready: false,
            x: gameConfig.width - 15,
            y: gameConfig.height / 2 - 40,
            height: 80,
            width: 10,
            speed: 5
          },
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

      match[player] = {
        ...match[player],
        ready: true
      };

      if(match.player1.ready && match.player2.ready)
      {
        match.status = "PLAY";
        restartMatch(match, roomID);
      }

      updateRooms();
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
    })

    socket.on("NameAdd", (newname) => {
      game.names[socket.id] = { newname };
      sendMessage(game.names[socket.id].newname, "(ENTROU)");  
      nameUpdate();
    })
})


app.get("/", (req,res) => res.send("Porta do server"));
const port = 4000;
server.listen(port, () => console.log("Testando a porta " + port + " do server"));