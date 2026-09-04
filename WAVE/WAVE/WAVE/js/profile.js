function loadProfile() {

    const username = getCurrentUser();

    if (!username) {
        window.location.href = "login.html";
        return;
    }

    const users = getUsers();

    const user = users.find(user => user.username === username);

    if (!user) return;

    document.getElementById("profileUsername").textContent = user.username;
    document.getElementById("profileBio").textContent = user.bio;

    const posts = getPosts().filter(post => post.username === username);

    document.getElementById("postCount").textContent = posts.length;

    const profilePosts = document.getElementById("profilePosts");

    profilePosts.innerHTML = "";

    posts.forEach(post => {

        const div = document.createElement("div");

        div.textContent = post.content;

        profilePosts.appendChild(div);
    });
}


function editProfile() {

    const username = getCurrentUser();

    const newBio = prompt(
        "Enter your new bio:"
    );

    if (newBio === null) return;

    const users = getUsers();

    const user = users.find(user => user.username === username);

    if (user) {
        user.bio = newBio;
        saveUsers(users);
        loadProfile();
    }
}


loadProfile();
