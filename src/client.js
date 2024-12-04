const connect = () => {
	const socket = new WebSocket("ws://localhost:3000");

	socket.onopen = () => console.log("З’єднання відкрите");
	socket.onmessage = (event) => {
		const chat = document.getElementById("chat");
		const newMessage = document.createElement("div");
		newMessage.innerText = event.data;
		chat.appendChild(newMessage);

		if (!document.hasFocus()) {
			playNotificationSound();
		}
	};

	socket.onclose = () => {
		console.log("З’єднання закрите, спроба перепідключення...");
		setTimeout(connect, 3000);
	};

	socket.onerror = (error) => {
		console.error("Помилка WebSocket:", error);
	};

	window.socket = socket;
};
connect();

function sendMessage() {
	const messageInput = document.getElementById("message");
	const message = messageInput.value.trim();

	if (!message) {
		alert("Поле вводу не може бути порожнім!");
		return;
	}

	socket.send(message);
	messageInput.value = "";
}

const playNotificationSound = () => {
	const audio = new Audio("notification.mp3");
	audio.play();
};
