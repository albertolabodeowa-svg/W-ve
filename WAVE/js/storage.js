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

function getFollows() {
    return JSON.parse(localStorage.getItem("waveFollows")) || {};
}

function saveFollows(follows) {
    localStorage.setItem("waveFollows", JSON.stringify(follows));
}

function isFollowing(username) {
    const currentUser = getCurrentUser();
    const follows = getFollows();

    return Boolean(currentUser && follows[currentUser]?.includes(username));
}

function toggleFollow(username) {
    const currentUser = getCurrentUser();

    if (!currentUser || currentUser === username) return false;

    const follows = getFollows();
    const following = follows[currentUser] || [];
    const index = following.indexOf(username);

    if (index === -1) {
        following.push(username);
    } else {
        following.splice(index, 1);
    }

    follows[currentUser] = following;
    saveFollows(follows);

    return index === -1;
}

function getFollowingCount(username) {
    return (getFollows()[username] || []).length;
}

function getFollowersCount(username) {
    return Object.values(getFollows())
        .filter(following => following.includes(username))
        .length;
}

function getUserPostLikes() {
    return JSON.parse(localStorage.getItem("waveUserPostLikes")) || {};
}

function saveUserPostLikes(likes) {
    localStorage.setItem("waveUserPostLikes", JSON.stringify(likes));
}

function getPostComments() {
    return JSON.parse(localStorage.getItem("wavePostComments")) || {};
}

function savePostComments(comments) {
    localStorage.setItem("wavePostComments", JSON.stringify(comments));
}

function getMessages() {
    return JSON.parse(localStorage.getItem("waveMessages")) || [];
}

function saveMessages(messages) {
    localStorage.setItem("waveMessages", JSON.stringify(messages));
}