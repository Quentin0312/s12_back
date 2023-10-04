import express, { Request, Response , Application } from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io'

import dotenv from 'dotenv';

import { webSocketConnection } from './webSocket';

//For env File 
dotenv.config();
const port = Number(process.env.PORT)
const URLFrontDev = process.env.URL_FRONT_DEV as string
const URLFrontProd = process.env.URL_FRONT_PROD as string


const app: Application = express();
const server = createServer(app)
const io = new Server(server, {
  cors:{
    origin: [URLFrontDev, URLFrontProd]
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