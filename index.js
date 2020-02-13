// code away!
const express = require("express");

const postRouter = require("./posts/postRouter");

const userRouter = require("./users/userRouter");

const server = express();

server.use(logger);

server.use(express.json());

server.use("/api/posts", postRouter);

server.use("/api/users", userRouter);

function logger(req, res, next) {
	console.log(
		`[${new Date().toISOString()}] ${req.method} to ${req.url}}`
	);
	next();
}

server.listen(5000, () => {
	console.log("\n* Server Running on http://localhost:5000 *\n");
});