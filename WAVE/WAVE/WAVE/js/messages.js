function sendMessage() {

    const input = document.getElementById("messageInput");

    const message = input.value.trim();

    if (!message) return;

    const messages = document.getElementById("messages");

    messages.innerHTML += `
        <div class="message">
            <strong>You</strong>
            <p>${message}</p>
        </div>
    `;

    input.value = "";
}
