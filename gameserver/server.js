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
  players: {

  }
}


const updatePlayers = () => {
  sockets.emit("PlayerUpdate", game.players);
}

//Função quando um player é conectado
sockets.on("connection", (socket) => {
    console.log( socket.id + " foi conectado");

    const name = "player_" + socket.id.substr(0,5);

    game.players[socket.id] = { name };

    //"Define um parametro" para quando o player(id) for desconctado
    socket.on('disconnect', () => {
      delete game.players[socket.id];
      updatePlayers();
    })

    updatePlayers();
})

//app.get("/", (req,res) => res.send("Oi mundo"));

const port = 4000;
server.listen(port, () => console.log("Testando a porta " + port + " do server"));