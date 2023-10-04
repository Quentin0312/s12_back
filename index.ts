import express, { Request, Response , Application } from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io'

import dotenv from 'dotenv';

import { webSocketConnection } from './webSocket';

//For env File 
dotenv.config();
const port = Number(process.env.PORT)

const app: Application = express();
const server = createServer(app)
// TODO: Spécifier les urls pour CORS et pas laisser "*"
const io = new Server(server, {
  cors:{
    origin: "*"
  }
})

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

io.on('connection', (socket) => webSocketConnection(socket, io))

// server.listen(Number(port), hostname,() => {
//   console.log(`Server is Fire at ${hostname}:${port}`);
// });
server.listen(port,() => {
  console.log(`Server is Fire at port ${port}`);
});