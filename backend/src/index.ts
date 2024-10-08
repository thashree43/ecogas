import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { userroute } from "./interface/route/userroute";
import { agentroute } from "./interface/route/agentroute";
import {adminroute} from "./interface/route/adminroute"
import { connectDb } from "./infrastructure/database/mongoconnect";
import logger from "../src/infrastructure/utilis/logger"
import morgan from "morgan";

const port = 3000;
connectDb();
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "AgentAutherization"],
  })
);
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userroute);
app.use("/api/admin",adminroute)
app.use("/api/agent", agentroute);

app.listen(port, () => {
  console.log(
    `The userside server has connected at http://localhost:${port}/api/user`
  );
  console.log(
    `The adminside server has connected at http://localhost:${port}/api/admin`
  );
  console.log(
    `The brokerside has connected at http://localhost:${port}/api/agent`
  );
});
