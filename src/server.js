const WebSocket = require("ws");
const http = require("http");

const server = http.createServer((req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization"
	);

	if (req.method === "OPTIONS") {
		res.writeHead(200);
		res.end();
		return;
	}

	if (req.method === "GET" && req.url === "/disconnect") {
		const socket = req.socket;
		if (socket) {
			// Websocket will handle rest of the disconnection
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ success: true }));
		} else {
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(
				JSON.stringify({
					success: false,
					message: "Неможливо знайти з'єднання",
				})
			);
		}
	} else {
		res.writeHead(404);
		res.end();
	}
});

const wss = new WebSocket.Server({ noServer: true });
const clients = new Set();

wss.on("connection", (ws) => {
	const id = `User-${Math.floor(Math.random() * 1000)}`;
	clients.add(ws, id);

	console.log(`${id} приєднався до чату`);
	broadcast(`${id} приєднався до чату`, ws);

	ws.on("message", (message) => {
		console.log(`${id}: ${message}`);
		broadcast(`${id}: ${message}`);
	});

	ws.on("close", () => {
		console.log(`${id} вийшов з чату`);
		clients.delete(ws);
		broadcast(`${id} вийшов з чату`);
	});

	ws.on("error", (error) => {
		console.log(`Помилка: ${error.message}`);
	});
});

server.on("upgrade", (request, socket, head) => {
	wss.handleUpgrade(request, socket, head, (ws) => {
		wss.emit("connection", ws, request);
	});
});

server.listen(3000, () => {
	console.log("Сервер працює на порту 3000");
});

function broadcast(message, sender) {
	for (let client of clients) {
		if (client !== sender && client.readyState === WebSocket.OPEN) {
			client.send(message);
		}
	}
}

console.log("Сервер чату запущено на ws://localhost:3000");
