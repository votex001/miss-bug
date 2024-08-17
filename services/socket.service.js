import { Server } from "socket.io";
import { loggerService } from "./logger.service.js";

var gIo = null;

export function setupSocketAPI(http) {
  gIo = new Server(http, {
    cors: {
      origin: "*",
    },
  });
  gIo.on("connection", (socket) => {
    console.log("connection");
    socket.on("disconnect", (socket) => {
      console.log("disconnect");
    });

    socket.on("user-watch", (userId) => {
      console.log(
        `user-watch from socket [id: ${socket.id}], on user ${userId}`
      );
      socket.join("watching:" + userId);
    });
    socket.on("set-user-socket", (userId) => {
      loggerService.info(
        `Setting socket.userId = ${userId} for socket [id: ${socket.id}]`
      );
      socket.userId = userId;
    });
    socket.on("unset-user-socket", () => {
      loggerService.info(
        `Removing socket.userId for socket [id: ${socket.id}]`
      );
      delete socket.userId;
    });
  });
}

function emitTo({ type, data, label }) {
  if (label) gIo.to("watching:" + label.toString()).emit(type, data);
  else gIo.emit(type, data);
}

async function emitToUser({ type, data, userId }) {
  userId = userId.toString();
  const socket = await _getUserSocket(userId);

  if (socket) {
    loggerService.info(
      `Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`
    );
    socket.emit(type, data);
  } else {
    loggerService.info(`No active socket for user: ${userId}`);
    // _printSockets()
  }
}

// If possible, send to all sockets BUT not the current socket
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, userId }) {
  userId = userId.toString();

  loggerService.info(`Broadcasting event: ${type}`);
  const excludedSocket = await _getUserSocket(userId);
  if (room && excludedSocket) {
    loggerService.info(`Broadcast to room ${room} excluding user: ${userId}`);
    excludedSocket.broadcast.to(room).emit(type, data);
  } else if (excludedSocket) {
    loggerService.info(`Broadcast to all excluding user: ${userId}`);
    excludedSocket.broadcast.emit(type, data);
  } else if (room) {
    loggerService.info(`Emit to room: ${room}`);
    gIo.to(room).emit(type, data);
  } else {
    loggerService.info(`Emit to all`);
    gIo.emit(type, data);
  }
}

async function _getUserSocket(userId) {
  const sockets = await _getAllSockets();
  const socket = sockets.find((s) => s.userId === userId);
  return socket;
}

async function _getAllSockets() {
  // return all Socket instances
  const sockets = await gIo.fetchSockets();
  return sockets;
}

async function _printSockets() {
  const sockets = await _getAllSockets();
  console.log(`Sockets: (count: ${sockets.length}):`);
  sockets.forEach(_printSocket);
}
function _printSocket(socket) {
  console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`);
}

export const socketService = {
  // set up the sockets service and define the API
  setupSocketAPI,
  // emit to everyone / everyone in a specific room (label)
  emitTo,
  // emit to a specific user (if currently active in system)
  emitToUser,
  // Send to all sockets BUT not the current socket - if found
  // (otherwise broadcast to a room / to all)
  broadcast,
};
