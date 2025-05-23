import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";
import express, { Express } from "express";
import authRoutes from "./routes/auth_route";
import postRoutes from "./routes/posts_route";
import userRoutes from "./routes/users_route";
import commentRoutes from "./routes/comments_route";
import tagRoutes from "./routes/tags_route";
import fileRoutes from "./routes/files_route";
import chatbotRoutes from "./routes/chatbot_route";
import usersRoutes from "./routes/users_route";
import mongoose, { ConnectOptions } from "mongoose";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import path from "path";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/comments", commentRoutes);
app.use("/posts", postRoutes);
app.use("/tags", tagRoutes);
app.use("/files", fileRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/users", usersRoutes);

app.use("/public", express.static("public"));
app.use("/storage", express.static("storage"));
app.use(express.static("front"));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2022 REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [
    { url: `http://localhost:${process.env.PORT}` }, 
    { url: "https://10.10.246.37" },
    { url: "https://node37.cs.colman.ac.il" }
    ],
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../front/index.html")); 
});

const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    if (!process.env.DATABASE_URL) {
      reject("DATABASE_URL is not defined in .env file");
    } else {
      mongoose
        .connect(process.env.DATABASE_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        } as ConnectOptions)
        .then(() => {
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export default initApp;
