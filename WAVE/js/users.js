function searchUsers() {
    const input = document.getElementById("userSearchInput");
    const results = document.getElementById("userResults");

    if (!input || !results) return;

    const search = input.value.toLowerCase().trim();
    const currentUser = getCurrentUser();
    const users = getUsers().filter(user => user.username !== currentUser);
    const matchingUsers = search
        ? users.filter(user => user.username.toLowerCase().includes(search))
        : users;

    results.innerHTML = "";

    if (!matchingUsers.length) {
        results.innerHTML = "<p class=\"empty-users\">No people found.</p>";
        return;
    }

    matchingUsers.forEach(user => {
        const card = document.createElement("article");
        const following = isFollowing(user.username);

        card.className = "user-result";
        card.innerHTML = `
            <div class="user-result-avatar">👤</div>
            <div class="user-result-info">
                <strong>${escapeHTML(user.username)}</strong>
                <small>${escapeHTML(user.bio || "Welcome to my WAVE profile.")}</small>
            </div>
            <button class="follow-button" onclick="followUser('${escapeAttribute(user.username)}')">
                ${following ? "Following" : "Follow"}
            </button>
            <a class="message-button" href="messages.html?to=${encodeURIComponent(user.username)}" title="Message ${escapeAttribute(user.username)}">💬</a>
        `;

        results.appendChild(card);
    });
}

function followUser(username) {
    if (!requireLogin()) return;

    toggleFollow(username);
    searchUsers();
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function escapeAttribute(text) {
    return String(text).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

searchUsers();
