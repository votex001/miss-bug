// app.js
import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { bugRoutes } from "./api/bug/bug.routes.js";
import { authRoutes } from "./api/auth/auth.routes.js";
import { userRouter } from "./api/user/user.routes.js";
import { setupSocketAPI } from "./services/socket.service.js";

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5174",
    "http://localhost:5174",
  ],
  credentials: true,
};
app.use(express.static("public"));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

//Routes
app.use("/api/bug", bugRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
setupSocketAPI(server);

app.get("/api/logs", requiredAdmin, async (req, res) => {
  const path = process.cwd() + "/logs/backend.log";
  res.sendFile(path);
});

function requiredAdmin(req, res, next) {
  const { pass } = req.query;
  if (pass === "admin") {
    next();
  } else {
    loggerService.warn(
      "Unauthenticated user tried to access a restricted path"
    );
    return res.status(401).send("Need Authorization");
  }
}

app.get("**", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

const port = 3030;
server.listen(port, () => {
  console.log(`Server listening on port http://127.0.0.1:${port}`);
});
