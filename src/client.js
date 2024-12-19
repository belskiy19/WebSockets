let USER_DISCONNECTED = false;

const connect = () => {
	const socket = new WebSocket("ws://localhost:3000");

	socket.onopen = () => {
		console.log("З’єднання відкрите");
		hideShow(false);
	};
	socket.onmessage = (event) => {
		addMessage(event.data);

		if (!document.hasFocus()) {
			playNotificationSound();
		}
	};

	socket.onclose = () => {
		if (USER_DISCONNECTED) return;
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

function disconnect() {
	fetch("http://localhost:3000/disconnect", { method: "GET" })
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				alert("Ви відключились від чату");
				socket.close();
				hideShow(true);
				addMessage("Ви відключились від чату");
			} else {
				alert("Помилка при відключенні");
			}
		})
		.catch((error) => console.error("Помилка запиту до сервера:", error));
}

function addMessage(message) {
	const chat = document.getElementById("chat");
	const newMessage = document.createElement("div");
	newMessage.innerText = message;
	chat.appendChild(newMessage);
}

function hideShow(hide) {
	USER_DISCONNECTED = hide;
	document.getElementById("message").disabled = hide;
	document.getElementById("send").disabled = hide;
	document.getElementById("disconnect").disabled = hide;
	document.getElementById("info").style.display = hide ? "block" : "none";
}
