import express, { json } from "express";

const server = express();

import authorsRouter from "./authors.js";
import booksRouter from "./books.js";
import bookStoreRouter from "./bookstores.js";
import ownerRouter from "./owner.js"

server.use(json());
server.use("/api/owner", ownerRouter)

server.use("/api/author", authorsRouter);
server.use("/api/book", booksRouter);
server.use("/api/bookstore", bookStoreRouter);
server.use("/api/owner", ownerRouter)

export default server;