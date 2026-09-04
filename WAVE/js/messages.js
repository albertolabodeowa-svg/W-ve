if (!requireLogin()) {
    throw new Error("Login required");
}

if (!requireLogin()) {
    throw new Error("Login required");
}

const currentUser = getCurrentUser();
const messageParams = new URLSearchParams(window.location.search);
let recipient = messageParams.get("to") || "";

function renderMessages() {
    const messagesElement = document.getElementById("messages");
    const title = document.getElementById("messageTitle");
    const recipientInput = document.getElementById("recipientInput");

    if (!messagesElement) return;

    if (recipientInput && !recipientInput.value) {
        recipientInput.value = recipient;
    }

    if (title) {
        title.textContent = recipient
            ? `Messages with ${recipient}`
            : "Messages";
    }

    const conversation = getMessages().filter(message =>
        (message.from === currentUser && message.to === recipient) ||
        (message.from === recipient && message.to === currentUser)
    );

    messagesElement.innerHTML = conversation.length
        ? conversation.map(message => `
            <div class="message">
                <strong>${escapeMessage(message.from)}</strong>
                <p>${escapeMessage(message.text)}</p>
            </div>
        `).join("")
        : "<p class=\"empty-messages\">Choose a person from Explore to start a conversation.</p>";
}

function selectRecipient() {
    const input = document.getElementById("recipientInput");
    const username = input.value.trim();
    const userExists = getUsers().some(user => user.username === username);

    if (!username || !userExists || username === currentUser) {
        alert("Enter another registered username.");
        return;
    }

    recipient = username;
    window.history.replaceState({}, "", `messages.html?to=${encodeURIComponent(recipient)}`);
    renderMessages();
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value.trim();

    if (!recipient) {
        alert("Choose a recipient first.");
        return;
    }

    if (!message) return;

    const messages = getMessages();

    messages.push({
        from: currentUser,
        to: recipient,
        text: message,
        createdAt: new Date().toLocaleString()
    });

    saveMessages(messages);
    input.value = "";
    renderMessages();
}

function escapeMessage(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

renderMessages();