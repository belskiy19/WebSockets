const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 3000 });
const clients = new Set();

server.on("connection", (ws) => {
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

function broadcast(message, sender) {
	for (let client of clients) {
		if (client !== sender && client.readyState === WebSocket.OPEN) {
			client.send(message);
		}
	}
}

console.log("Сервер чату запущено на ws://localhost:3000");
