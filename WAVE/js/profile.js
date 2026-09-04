function loadProfile() {

    if (!requireLogin()) return;

    const username = getCurrentUser();

    const users = getUsers();

    const user = users.find(
        user => user.username === username
    );

    if (!user) return;

    const usernameElement =
        document.getElementById("profileUsername");

    const bioElement =
        document.getElementById("profileBio");

    if (usernameElement) {
        usernameElement.textContent = user.username;
    }

    if (bioElement) {
        bioElement.textContent = user.bio;
    }

    const posts = getPosts().filter(
        post => post.username === username
    );

    const postCount =
        document.getElementById("postCount");

    if (postCount) {
        postCount.textContent = posts.length;
    }

    const followerCount = document.getElementById("followerCount");
    const followingCount = document.getElementById("followingCount");

    if (followerCount) {
        followerCount.textContent = getFollowersCount(username);
    }

    if (followingCount) {
        followingCount.textContent = getFollowingCount(username);
    }

    const profilePosts =
        document.getElementById("profilePosts");

    if (!profilePosts) return;

    profilePosts.innerHTML = "";

    posts.forEach(post => {

        const div = document.createElement("div");

        div.textContent = post.content;

        profilePosts.appendChild(div);
    });
}


function editProfile() {

    if (!requireLogin()) return;

    const username = getCurrentUser();

    const users = getUsers();

    const user = users.find(
        user => user.username === username
    );

    if (!user) return;

    const newBio = prompt(
        "Enter your new bio:",
        user.bio
    );

    if (newBio === null) {
        return;
    }

    user.bio = newBio;

    saveUsers(users);

    loadProfile();
}


loadProfile();