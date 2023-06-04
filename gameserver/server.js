import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const sockets = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
});

sockets.on("connection", (socket) => {
    console.log( socket.id + " foi conectado");
})

app.get("/", (req,res) => res.send("Oi mundo"));

const port = 4000;
server.listen(port, () => console.log("Testando a porta " + port + " do server"));