function getUsers() {
    return JSON.parse(localStorage.getItem("waveUsers")) || [];
}

function saveUsers(users) {
    localStorage.setItem("waveUsers", JSON.stringify(users));
}

function getPosts() {
    return JSON.parse(localStorage.getItem("wavePosts")) || [];
}

function savePosts(posts) {
    localStorage.setItem("wavePosts", JSON.stringify(posts));
}

function getCurrentUser() {
    return localStorage.getItem("waveCurrentUser");
}

function setCurrentUser(username) {
    localStorage.setItem("waveCurrentUser", username);
}

function logoutUser() {
    localStorage.removeItem("waveCurrentUser");
}
