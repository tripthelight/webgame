import fs from "fs";
import https from "https";
import express from "express";
import {Server} from "socket.io";

const key = fs.readFileSync("../../certs/server/cert.key");
const cert = fs.readFileSync("../../certs/server/cert.crt");

export const app = express();
export const httpServer = https.createServer({key, cert}, app);
export const io = new Server(httpServer, {
  cors: [
    // the domains that are allowed
    "localhost:3000",
    "localhost:3001",
  ],
  method: ["GET", "POST"],
});
